import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import * as ImagePicker from 'expo-image-picker';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ActionSheet } from '@/components/common/ActionSheet';
import { AnimatedNumber } from '@/components/common/AnimatedNumber';
import { ChallengeCard } from '@/components/common/ChallengeCard';
import { CoachCard } from '@/components/common/CoachCard';
import { CollapsibleSection } from '@/components/common/CollapsibleSection';
import { HorizontalCardRail } from '@/components/common/HorizontalCardRail';
import { MatchCard } from '@/components/common/MatchCard';
import { PlayerAvatar } from '@/components/common/PlayerAvatar';
import { PremiumButton } from '@/components/common/PremiumButton';
import { ProgressBar } from '@/components/common/ProgressBar';
import { ScreenTransitionWrapper } from '@/components/common/ScreenTransitionWrapper';
import { StreakBar } from '@/components/common/StreakBar';
import { VideoCard } from '@/components/common/VideoCard';
import { useAppState } from '@/state/AppState';
import { colors, radius, spacing } from '@/theme/tokens';
import { centeredContent } from '@/theme/layout';
import { CosmeticItem } from '@/types/Wallet';
import { Coach } from '@/types/Coach';
import { VideoPost, VideoTag } from '@/types/VideoPost';
import { formatPlayerStatus, winRate } from '@/utils/format';

export default function ProfileScreen() {
  const { currentUser: me, players, courts, matches, challenges, friendIds, coaches, videos, wallet, cosmetics, activeCosmeticIds, updateAccount, updateMatchStatus, updateChallenge, requestCoachSession, previewCosmetic, selectCosmetic, buyCosmetic, toggleVideoLike, toggleVideoSave, createCoachProfile, uploadVideo } = useAppState();
  const [sheet, setSheet] = useState<'edit' | 'settings' | 'premium' | 'coachSignup' | 'videoUpload' | null>(null);
  const [coachSheet, setCoachSheet] = useState<Coach | null>(null);
  const [videoSheet, setVideoSheet] = useState<VideoPost | null>(null);
  const [cosmeticSheet, setCosmeticSheet] = useState<CosmeticItem | null>(null);
  const [friendSearch, setFriendSearch] = useState('');
  const [coachSpecialty, setCoachSpecialty] = useState('Bandeja and wall defense');
  const [coachPrice, setCoachPrice] = useState('QAR 180/session');
  const [coachBio, setCoachBio] = useState('Available for private ranked-match preparation sessions.');
  const [videoTitle, setVideoTitle] = useState('My latest ranked point');
  const [videoDescription, setVideoDescription] = useState('A local match clip uploaded for the 974 Padel community.');
  const [videoTag, setVideoTag] = useState<VideoTag>('Highlight');
  const [videoThumb, setVideoThumb] = useState<string | undefined>();
  const [uploadMessage, setUploadMessage] = useState('');
  const myChallenges = challenges.filter((challenge) => challenge.from === me.id || challenge.to === me.id);
  const progress = Math.min(100, Math.round(((me.rating - 1800) / 500) * 100));
  const favoriteCourt = courts.find((court) => court.id === me.favoriteCourtId) || courts[0];
  const localCoach = coaches.find((coach) => coach.id.startsWith('coach-local'));
  const equippedCosmetics = cosmetics.filter((item) => item.equipped || activeCosmeticIds.includes(item.id));
  const hasPearlBorder = equippedCosmetics.some((item) => item.id === 'pearl-border');
  const hasEliteBadge = equippedCosmetics.some((item) => item.id === 'elite-badge');
  const hasLusailBg = equippedCosmetics.some((item) => item.id === 'lusail-bg');
  const hasVictoryFlash = equippedCosmetics.some((item) => item.id === 'victory-flash');
  const hasMaroonCard = equippedCosmetics.some((item) => item.id === 'maroon-card');
  const activeCosmeticNames = equippedCosmetics.map((item) => item.name).slice(0, 5);

  const submitCoachSignup = () => {
    createCoachProfile({
      name: me.name,
      avatarUrl: me.avatar,
      heroImageUrl: favoriteCourt.image as string,
      specialty: coachSpecialty,
      level: me.level,
      area: me.area || favoriteCourt.area,
      courtId: favoriteCourt.id,
      priceLabel: coachPrice,
      bio: coachBio,
      specialties: coachSpecialty.split(',').map((item) => item.trim()).filter(Boolean),
      availableSlots: ['Tonight, 8:00 PM', 'Tomorrow, 7:30 PM', 'Saturday, 10:00 AM'],
    });
    setSheet(null);
  };

  const pickVideoThumb = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) {
      setVideoThumb(result.assets[0].uri);
      setUploadMessage('Thumbnail attached locally.');
    }
  };

  const submitVideoUpload = () => {
    uploadVideo({
      title: videoTitle,
      description: videoDescription,
      thumbnailUrl: videoThumb || (favoriteCourt.image as string),
      duration: '0:30',
      tag: videoTag,
    });
    setUploadMessage('Clip uploaded locally. +40 credits earned.');
    setSheet(null);
  };
  const changeAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.85 });
    if (!result.canceled) {
      updateAccount({ avatarUri: result.assets[0].uri, avatarUrl: result.assets[0].uri });
    }
  };

  return (
    <ScreenTransitionWrapper>
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={[styles.header, hasLusailBg && styles.headerLusail, hasEliteBadge && styles.headerElite]}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>My 974 profile</Text>
          <Text style={styles.name}>{me.name}</Text>
          <View style={styles.headerStats}>
            <AnimatedNumber value={me.rank} prefix="#" style={styles.subNumber} />
            <AnimatedNumber value={me.rating} style={styles.subNumber} />
          </View>
        </View>
        <View style={[styles.avatarShell, hasPearlBorder && styles.avatarPearl, hasEliteBadge && styles.avatarElite]}>
          <PlayerAvatar name={me.name} uri={me.avatar} size={78} />
        </View>
      </View>
      <View style={styles.avatarActions}>
        <PremiumButton label="Change avatar" icon="image-outline" variant="secondary" onPress={changeAvatar} />
      </View>

      <View style={styles.stats}>
        <View style={[styles.stat, hasMaroonCard && styles.cosmeticSurface]}><Text style={styles.statValue}>{me.wins}-{me.losses}</Text><Text style={styles.statLabel}>Record</Text></View>
        <View style={[styles.stat, hasMaroonCard && styles.cosmeticSurface]}><AnimatedNumber value={winRate(me.wins, me.losses)} suffix="%" style={styles.statValue} /><Text style={styles.statLabel}>Win rate</Text></View>
        <View style={[styles.stat, hasMaroonCard && styles.cosmeticSurface]}><AnimatedNumber value={me.streak} style={styles.statValue} /><Text style={styles.statLabel}>Streak</Text></View>
      </View>

      <View style={[styles.panel, hasMaroonCard && styles.cosmeticSurface, hasVictoryFlash && styles.victoryGlow]}>
        <View style={styles.progressHead}>
          <Text style={styles.panelTitle}>Rating progress</Text>
          <Text style={styles.panelMeta}>{progress}% to next tier</Text>
        </View>
        <ProgressBar value={progress} />
        <View style={styles.cosmeticRow}>
          <Text style={styles.cosmetic}>{me.subscriptionTier || 'free'} profile</Text>
          <Text style={styles.cosmetic}>{me.tokens || me.weeklyPoints || 0} credits</Text>
        </View>
        <Text style={styles.panelMeta}>Cosmetics, themes, premium stats, and no-ads benefits plug in here later.</Text>
      </View>

      <View style={styles.equippedBar}>
        <Text style={styles.panelTitle}>Equipped look</Text>
        <Text style={styles.panelMeta}>{activeCosmeticNames.join(' - ') || 'Classic Frame'}</Text>
      </View>

      <CollapsibleSection title="Player Status" action="Ranking and form" defaultOpen>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Verified record</Text>
          <Text style={styles.panelMeta}>{me.verifiedMatches} verified matches - {me.weeklyPoints} weekly points - {me.streak} streak</Text>
          <StreakBar value={me.streak} max={7} />
        </View>
      </CollapsibleSection>

      <CollapsibleSection title="Match History" action="Confirm or dispute">
        <View style={styles.stack}>
          {matches.slice(0, 4).map((match) => (
            <MatchCard key={match.id} match={match} court={courts.find((court) => court.id === match.courtId) || courts[0]} players={players} onConfirm={match.status === 'Pending' ? () => updateMatchStatus(match.id, 'Verified') : undefined} onDispute={match.status === 'Pending' ? () => updateMatchStatus(match.id, 'Disputed') : undefined} />
          ))}
        </View>
      </CollapsibleSection>

      <CollapsibleSection title="Favorite Courts" action="Training base">
        <View style={styles.stack}>
          {[favoriteCourt, ...courts.filter((court) => court.id !== favoriteCourt.id).slice(0, 2)].map((court) => (
            <View key={court.id} style={styles.favorite}>
              <MaterialCommunityIcons name={court.indoor ? 'home-roof' : 'weather-night'} size={20} color={colors.primary} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={1} style={styles.favoriteTitle}>{court.name}</Text>
                <Text numberOfLines={1} style={styles.panelMeta}>{court.area} - {court.priceRange}</Text>
              </View>
            </View>
          ))}
        </View>
      </CollapsibleSection>

      <CollapsibleSection title="Friends" action={`${friendIds.length} players`} defaultOpen>
        <TextInput value={friendSearch} onChangeText={setFriendSearch} placeholder="Search friends" placeholderTextColor={colors.textSecondary} style={styles.friendSearch} />
        <View style={styles.friendStrip}>
          {friendIds
            .map((id) => players.find((player) => player.id === id))
            .filter(Boolean)
            .filter((player) => `${player!.name} ${player!.username}`.toLowerCase().includes(friendSearch.trim().toLowerCase()))
            .map((player) => (
            <View key={player!.id} style={styles.friendPill}>
              <PlayerAvatar name={player!.name} uri={player!.avatar} size={34} />
              <View style={{ flex: 1, minWidth: 0 }}>
                <Text numberOfLines={1} style={styles.favoriteTitle}>{player!.name}</Text>
                <Text numberOfLines={1} style={styles.friendStatus}>{formatPlayerStatus(player!.status)}</Text>
              </View>
            </View>
          ))}
        </View>
      </CollapsibleSection>

      <CollapsibleSection title="My Challenges" action={`${myChallenges.length} active`}>
        <View style={styles.stack}>
          {myChallenges.map((challenge) => {
            const opponent = players.find((player) => player.id === (challenge.from === me.id ? challenge.to : challenge.from)) || players[1];
            return (
              <ChallengeCard
                key={challenge.id}
                challenge={challenge}
                opponent={opponent}
                court={courts.find((court) => court.id === challenge.courtId) || courts[0]}
                onAccept={() => updateChallenge(challenge.id, 'Accepted')}
                onDecline={() => updateChallenge(challenge.id, 'Declined')}
              />
            );
          })}
        </View>
      </CollapsibleSection>

      <CollapsibleSection title="Coaching" action={localCoach ? 'Coach profile active' : 'Become a coach'}>
        <View style={styles.stack}>
          <PremiumButton label={localCoach ? 'Edit coach profile' : 'Sign up as coach'} icon="whistle-outline" onPress={() => setSheet('coachSignup')} />
        </View>
        <HorizontalCardRail>
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} onOpen={() => setCoachSheet(coach)} onRequest={() => requestCoachSession(coach.id, coach.availableSlots[0] || 'Next available')} />
          ))}
        </HorizontalCardRail>
      </CollapsibleSection>

      <CollapsibleSection title="Videos" action="Upload and save clips">
        <View style={styles.stack}>
          <PremiumButton label="Upload local clip" icon="video-plus-outline" onPress={() => setSheet('videoUpload')} />
        </View>
        <HorizontalCardRail>
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onOpen={() => setVideoSheet(video)} />
          ))}
        </HorizontalCardRail>
      </CollapsibleSection>

      <CollapsibleSection title="Wallet/Credits" action={`${wallet.credits} 974 Credits`} defaultOpen>
        <View style={styles.walletPanel}>
          <AnimatedNumber value={wallet.credits} style={styles.walletBig} />
          <Text style={styles.walletCopy}>974 Credits earned from verified matches, streaks, challenges, profile completion, and future clip uploads.</Text>
        </View>
      </CollapsibleSection>

      <CollapsibleSection title="Customization" action={`${activeCosmeticIds.length} active`} defaultOpen>
        <View style={[styles.cosmeticPreview, hasLusailBg && styles.previewLusail, hasVictoryFlash && styles.victoryGlow]}>
          <View style={[styles.previewAvatar, hasPearlBorder && styles.avatarPearl, hasEliteBadge && styles.avatarElite]}>
            <PlayerAvatar name={me.name} uri={me.avatar} size={64} />
          </View>
          <View style={{ flex: 1, minWidth: 0 }}>
            <Text numberOfLines={1} style={styles.previewName}>{me.name}</Text>
            <Text numberOfLines={1} style={styles.previewMeta}>#{me.rank} - {me.rating} rating</Text>
            <View style={styles.previewBadges}>
              {hasPearlBorder ? <Text style={styles.previewBadge}>Pearl border</Text> : null}
              {hasEliteBadge ? <Text style={styles.previewBadge}>Elite badges</Text> : null}
              {hasLusailBg ? <Text style={styles.previewBadge}>Lusail BG</Text> : null}
              {hasVictoryFlash ? <Text style={styles.previewBadge}>Victory flash</Text> : null}
            </View>
          </View>
        </View>
        <View style={styles.cosmeticGrid}>
          {cosmetics.map((item) => (
            <View key={item.id} style={[styles.cosmeticCard, activeCosmeticIds.includes(item.id) && styles.cosmeticActive]}>
              <Text style={styles.favoriteTitle}>{item.name}</Text>
                <Text style={styles.panelMeta}>{item.unlocked ? (item.equipped ? 'Equipped' : 'Unlocked') : `${item.price} credits${item.premiumOnly ? ' - Premium' : ''}`}</Text>
                {item.description ? <Text style={styles.panelMeta}>{item.description}</Text> : null}
                <View style={styles.cosmeticActions}>
                  <PremiumButton label="Preview" variant="secondary" icon="eye-outline" onPress={() => { previewCosmetic(item.id); setCosmeticSheet(item); }} style={{ flex: 1 }} />
                <PremiumButton
                  label={item.unlocked ? (item.equipped ? 'Equipped' : 'Equip') : item.premiumOnly && me.subscriptionTier !== 'Premium' ? 'Premium' : 'Buy'}
                  variant={item.unlocked ? 'primary' : 'subtle'}
                  icon={item.unlocked ? 'check' : 'lock-open-outline'}
                  onPress={() => {
                    if (item.unlocked) selectCosmetic(item.id);
                    else if (buyCosmetic(item.id)) setCosmeticSheet({ ...item, unlocked: true });
                    else setCosmeticSheet(item);
                  }}
                  style={{ flex: 1 }}
                />
              </View>
            </View>
          ))}
        </View>
      </CollapsibleSection>

      <CollapsibleSection title="Premium" action="Future upgrade">
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Premium preview</Text>
          <Text style={styles.panelMeta}>No ads, advanced stats, premium themes, priority challenge visibility, deeper match history, private groups, and exclusive cosmetics.</Text>
          <PremiumButton label="Preview premium" icon="star-outline" onPress={() => setSheet('premium')} />
        </View>
      </CollapsibleSection>

      <CollapsibleSection title="Settings" action="Privacy and notifications">
        <PremiumButton label="Open settings" icon="cog-outline" variant="subtle" onPress={() => setSheet('settings')} />
      </CollapsibleSection>

      <View style={styles.actions}>
        <PremiumButton label="Edit profile" icon="account-edit-outline" variant="secondary" onPress={() => setSheet('edit')} style={{ flex: 1 }} />
        <PremiumButton label="Settings" icon="cog-outline" variant="subtle" onPress={() => setSheet('settings')} style={{ flex: 1 }} />
      </View>

      <ActionSheet visible={sheet === 'edit'} title="Edit profile" subtitle="Local-only profile settings for this MVP build." onClose={() => setSheet(null)}>
        <PremiumButton label="Save local changes" icon="content-save-outline" onPress={() => setSheet(null)} />
      </ActionSheet>
      <ActionSheet visible={sheet === 'settings'} title="Settings" subtitle="Notification, privacy, and verification preferences will connect later." onClose={() => setSheet(null)}>
        <PremiumButton label="Done" icon="check" onPress={() => setSheet(null)} />
      </ActionSheet>
      <ActionSheet visible={sheet === 'premium'} title="Premium preview" subtitle="Payments and subscriptions are intentionally inactive in this frontend MVP." onClose={() => setSheet(null)}>
        <PremiumButton label="Close" icon="check" onPress={() => setSheet(null)} />
      </ActionSheet>
      <ActionSheet visible={sheet === 'coachSignup'} title="Coach signup" subtitle="Create a local coach profile now. Backend verification comes next." onClose={() => setSheet(null)}>
        <Text style={styles.panelMeta}>Specialty</Text>
        <TextInput value={coachSpecialty} onChangeText={setCoachSpecialty} placeholder="Specialty" placeholderTextColor={colors.textSecondary} style={styles.input} />
        <Text style={styles.panelMeta}>Price</Text>
        <TextInput value={coachPrice} onChangeText={setCoachPrice} placeholder="QAR 180/session" placeholderTextColor={colors.textSecondary} style={styles.input} />
        <Text style={styles.panelMeta}>Bio</Text>
        <TextInput value={coachBio} onChangeText={setCoachBio} placeholder="Coach bio" placeholderTextColor={colors.textSecondary} multiline style={[styles.input, styles.tallInput]} />
        <View style={styles.cosmeticActions}>
          <PremiumButton label="Cancel" variant="subtle" icon="close" onPress={() => setSheet(null)} style={{ flex: 1 }} />
          <PremiumButton label="Create coach profile" icon="check" onPress={submitCoachSignup} style={{ flex: 1 }} />
        </View>
      </ActionSheet>
      <ActionSheet visible={sheet === 'videoUpload'} title="Upload clip" subtitle="Local upload prototype. Real storage/backend comes next." onClose={() => setSheet(null)}>
        <TextInput value={videoTitle} onChangeText={setVideoTitle} placeholder="Clip title" placeholderTextColor={colors.textSecondary} style={styles.input} />
        <TextInput value={videoDescription} onChangeText={setVideoDescription} placeholder="Description" placeholderTextColor={colors.textSecondary} multiline style={[styles.input, styles.tallInput]} />
        <View style={styles.tagRow}>
          {(['Match', 'Training', 'Tip', 'Highlight'] as VideoTag[]).map((tag) => (
            <PremiumButton key={tag} label={tag} variant={videoTag === tag ? 'primary' : 'subtle'} onPress={() => setVideoTag(tag)} style={{ flex: 1 }} />
          ))}
        </View>
        <Text style={styles.panelMeta}>{uploadMessage || 'Attach a thumbnail or use your favorite court image.'}</Text>
        <View style={styles.cosmeticActions}>
          <PremiumButton label="Thumbnail" variant="secondary" icon="image-outline" onPress={pickVideoThumb} style={{ flex: 1 }} />
          <PremiumButton label="Upload" icon="upload-outline" onPress={submitVideoUpload} style={{ flex: 1 }} />
        </View>
      </ActionSheet>
      <ActionSheet visible={!!coachSheet} title={coachSheet?.name || 'Coach'} subtitle={coachSheet?.specialty} onClose={() => setCoachSheet(null)}>
        {coachSheet ? (
          <>
            <Text style={styles.panelMeta}>{coachSheet.bio}</Text>
            <PremiumButton label="Request next slot" icon="calendar-check" onPress={() => { requestCoachSession(coachSheet.id, coachSheet.availableSlots[0] || 'Next available'); setCoachSheet(null); }} />
          </>
        ) : null}
      </ActionSheet>
      <ActionSheet visible={!!videoSheet} title={videoSheet?.title || 'Video'} subtitle={videoSheet?.creatorName} onClose={() => setVideoSheet(null)}>
        {videoSheet ? (
          <>
            <Text style={styles.panelMeta}>{videoSheet.description}</Text>
            <View style={styles.cosmeticActions}>
              <PremiumButton label={videoSheet.liked ? 'Liked' : 'Like'} icon="heart-outline" onPress={() => toggleVideoLike(videoSheet.id)} style={{ flex: 1 }} />
              <PremiumButton label={videoSheet.saved ? 'Saved' : 'Save'} variant="secondary" icon="bookmark-outline" onPress={() => toggleVideoSave(videoSheet.id)} style={{ flex: 1 }} />
            </View>
          </>
        ) : null}
      </ActionSheet>
      <ActionSheet visible={!!cosmeticSheet} title={cosmeticSheet?.name || 'Cosmetic'} subtitle={cosmeticSheet?.unlocked ? 'Unlocked cosmetic' : 'Locked cosmetic preview'} onClose={() => setCosmeticSheet(null)}>
        <Text style={styles.panelMeta}>
          {cosmeticSheet?.unlocked
            ? 'Unlocked locally. Equip it from Customization.'
            : cosmeticSheet?.premiumOnly && me.subscriptionTier !== 'Premium'
              ? 'Premium-only cosmetic. Premium checkout connects later.'
              : `Costs ${cosmeticSheet?.price || 0} 974 Credits. Earn more from verified matches and challenges.`}
        </Text>
        <PremiumButton label="Close preview" icon="check" onPress={() => setCosmeticSheet(null)} />
      </ActionSheet>
    </ScrollView>
    </ScreenTransitionWrapper>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { ...centeredContent, paddingBottom: 104, gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.primary, paddingTop: 58, paddingBottom: 24, paddingHorizontal: spacing.md },
  avatarActions: { marginHorizontal: spacing.md, marginTop: -10 },
  headerLusail: { backgroundColor: '#3A001D', borderBottomWidth: 1, borderBottomColor: colors.hotPink },
  headerElite: { shadowColor: colors.hotPink, shadowOpacity: 0.42, shadowRadius: 22, shadowOffset: { width: 0, height: 14 }, elevation: 10 },
  avatarShell: { padding: 3, borderRadius: 999, borderWidth: 1, borderColor: 'rgba(255,255,255,0.16)' },
  avatarPearl: { borderWidth: 3, borderColor: colors.pearl, shadowColor: colors.pearl, shadowOpacity: 0.26, shadowRadius: 12 },
  avatarElite: { borderColor: colors.hotPink, shadowColor: colors.hotPink, shadowOpacity: 0.55, shadowRadius: 16 },
  kicker: { color: '#F2DCE7', fontWeight: '900', textTransform: 'uppercase', fontSize: 12 },
  name: { color: '#FFFFFF', fontWeight: '900', fontSize: 30, marginTop: 5 },
  headerStats: { flexDirection: 'row', gap: 8, marginTop: 7, flexWrap: 'wrap' },
  subNumber: { color: colors.pearl, fontWeight: '900', fontSize: 15 },
  stats: { marginHorizontal: spacing.md, marginTop: -4, flexDirection: 'row', gap: 10 },
  stat: { flex: 1, backgroundColor: colors.card, borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border },
  statValue: { color: colors.textPrimary, fontWeight: '900', fontSize: 20 },
  statLabel: { color: colors.textSecondary, fontWeight: '800', marginTop: 4, fontSize: 12 },
  panel: { marginHorizontal: spacing.md, backgroundColor: colors.card, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 10 },
  cosmeticSurface: { borderColor: colors.hotPink, backgroundColor: '#321020' },
  victoryGlow: { shadowColor: colors.hotPink, shadowOpacity: 0.35, shadowRadius: 18, shadowOffset: { width: 0, height: 12 }, elevation: 8 },
  equippedBar: { marginHorizontal: spacing.md, backgroundColor: colors.glass, borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 6 },
  cosmeticPreview: { marginHorizontal: spacing.md, flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#321020', borderRadius: radius.xl, borderWidth: 1, borderColor: colors.hotPink, padding: 14, shadowColor: colors.hotPink, shadowOpacity: 0.22, shadowRadius: 18, shadowOffset: { width: 0, height: 10 }, elevation: 7 },
  previewLusail: { backgroundColor: '#3A001D' },
  previewAvatar: { padding: 3, borderRadius: 999, borderWidth: 1, borderColor: colors.border },
  previewName: { color: colors.pearl, fontWeight: '900', fontSize: 18 },
  previewMeta: { color: colors.textSecondary, fontWeight: '800', marginTop: 3 },
  previewBadges: { flexDirection: 'row', flexWrap: 'wrap', gap: 6, marginTop: 9 },
  previewBadge: { overflow: 'hidden', color: colors.pearl, backgroundColor: colors.softMaroon, borderRadius: radius.pill, paddingHorizontal: 8, paddingVertical: 4, fontWeight: '900', fontSize: 10 },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  panelTitle: { color: colors.textPrimary, fontWeight: '900' },
  panelMeta: { color: colors.textSecondary, fontWeight: '700' },
  cosmeticRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  cosmetic: { color: colors.primary, fontWeight: '900', fontSize: 12 },
  friendSearch: { marginHorizontal: spacing.md, marginBottom: 8, minHeight: 46, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: 14, color: colors.textPrimary, fontWeight: '800' },
  stack: { marginHorizontal: spacing.md, gap: 10 },
  favorite: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: colors.card, borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 12 },
  favoriteTitle: { color: colors.textPrimary, fontWeight: '900' },
  friendStrip: { marginHorizontal: spacing.md, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  friendPill: { maxWidth: 178, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, paddingRight: 12, borderRadius: radius.pill, backgroundColor: colors.glass, borderWidth: 1, borderColor: colors.border },
  friendStatus: { color: colors.textSecondary, fontWeight: '800', fontSize: 10, marginTop: 1 },
  actions: { marginHorizontal: spacing.md, flexDirection: 'row', gap: 10 },
  walletPanel: { marginHorizontal: spacing.md, backgroundColor: colors.darkSection, borderRadius: radius.lg, padding: 16, gap: 8 },
  walletBig: { color: '#FFFFFF', fontSize: 34, fontWeight: '900' },
  walletCopy: { color: '#F2DCE7', fontWeight: '800', lineHeight: 19 },
  cosmeticGrid: { marginHorizontal: spacing.md, gap: 10 },
  cosmeticCard: { backgroundColor: colors.card, borderRadius: radius.lg, padding: 12, borderWidth: 1, borderColor: colors.border, gap: 8 },
  cosmeticActive: { borderColor: colors.hotPink, backgroundColor: colors.softMaroon },
  cosmeticActions: { flexDirection: 'row', gap: 8 },
  input: { minHeight: 50, borderWidth: 1, borderColor: colors.border, borderRadius: radius.md, paddingHorizontal: 12, color: colors.textPrimary, fontWeight: '800', backgroundColor: colors.glass },
  tallInput: { minHeight: 86, paddingTop: 12 },
  tagRow: { flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
});
