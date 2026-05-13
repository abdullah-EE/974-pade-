import { useState } from 'react';
import { MaterialCommunityIcons } from '@expo/vector-icons';
import { ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { ActionSheet } from '@/components/common/ActionSheet';
import { ChallengeCard } from '@/components/common/ChallengeCard';
import { CoachCard } from '@/components/common/CoachCard';
import { CollapsibleSection } from '@/components/common/CollapsibleSection';
import { HorizontalCardRail } from '@/components/common/HorizontalCardRail';
import { MatchCard } from '@/components/common/MatchCard';
import { PlayerAvatar } from '@/components/common/PlayerAvatar';
import { PremiumButton } from '@/components/common/PremiumButton';
import { VideoCard } from '@/components/common/VideoCard';
import { useAppState } from '@/state/AppState';
import { colors, radius, spacing } from '@/theme/tokens';
import { CosmeticItem } from '@/types/Wallet';
import { Coach } from '@/types/Coach';
import { VideoPost } from '@/types/VideoPost';
import { winRate } from '@/utils/format';

export default function ProfileScreen() {
  const { currentUser: me, players, courts, matches, challenges, friendIds, coaches, videos, wallet, cosmetics, activeCosmeticIds, updateMatchStatus, updateChallenge, requestCoachSession, previewCosmetic, selectCosmetic, toggleVideoLike, toggleVideoSave } = useAppState();
  const [sheet, setSheet] = useState<'edit' | 'settings' | 'premium' | null>(null);
  const [coachSheet, setCoachSheet] = useState<Coach | null>(null);
  const [videoSheet, setVideoSheet] = useState<VideoPost | null>(null);
  const [cosmeticSheet, setCosmeticSheet] = useState<CosmeticItem | null>(null);
  const [friendSearch, setFriendSearch] = useState('');
  const myChallenges = challenges.filter((challenge) => challenge.from === me.id || challenge.to === me.id);
  const progress = Math.min(100, Math.round(((me.rating - 1800) / 500) * 100));
  const favoriteCourt = courts.find((court) => court.id === me.favoriteCourtId) || courts[0];

  return (
    <ScrollView style={styles.screen} contentContainerStyle={styles.content} showsVerticalScrollIndicator={false}>
      <View style={styles.header}>
        <View style={{ flex: 1 }}>
          <Text style={styles.kicker}>My 974 profile</Text>
          <Text style={styles.name}>{me.name}</Text>
          <Text style={styles.sub}>Rank #{me.rank} - Rating {me.rating}</Text>
        </View>
        <PlayerAvatar name={me.name} uri={me.avatar} size={78} />
      </View>

      <View style={styles.stats}>
        <View style={styles.stat}><Text style={styles.statValue}>{me.wins}-{me.losses}</Text><Text style={styles.statLabel}>Record</Text></View>
        <View style={styles.stat}><Text style={styles.statValue}>{winRate(me.wins, me.losses)}%</Text><Text style={styles.statLabel}>Win rate</Text></View>
        <View style={styles.stat}><Text style={styles.statValue}>{me.streak}</Text><Text style={styles.statLabel}>Streak</Text></View>
      </View>

      <View style={styles.panel}>
        <View style={styles.progressHead}>
          <Text style={styles.panelTitle}>Rating progress</Text>
          <Text style={styles.panelMeta}>{progress}% to next tier</Text>
        </View>
        <View style={styles.track}><View style={[styles.fill, { width: `${progress}%` }]} /></View>
        <View style={styles.cosmeticRow}>
          <Text style={styles.cosmetic}>{me.subscriptionTier || 'free'} profile</Text>
          <Text style={styles.cosmetic}>{me.tokens || me.weeklyPoints || 0} credits</Text>
        </View>
        <Text style={styles.panelMeta}>Cosmetics, themes, premium stats, and no-ads benefits plug in here later.</Text>
      </View>

      <CollapsibleSection title="Player Status" action="Ranking and form" defaultOpen>
        <View style={styles.panel}>
          <Text style={styles.panelTitle}>Verified record</Text>
          <Text style={styles.panelMeta}>{me.verifiedMatches} verified matches - {me.weeklyPoints} weekly points - {me.streak} streak</Text>
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
              <View style={{ flex: 1 }}>
                <Text style={styles.favoriteTitle}>{court.name}</Text>
                <Text style={styles.panelMeta}>{court.area} - {court.priceRange}</Text>
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
              <View style={{ flex: 1 }}>
                <Text numberOfLines={1} style={styles.favoriteTitle}>{player!.name}</Text>
                <Text numberOfLines={1} style={styles.friendStatus}>{player!.status}</Text>
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

      <CollapsibleSection title="Coaching" action="Requested sessions">
        <HorizontalCardRail>
          {coaches.map((coach) => (
            <CoachCard key={coach.id} coach={coach} onOpen={() => setCoachSheet(coach)} onRequest={() => requestCoachSession(coach.id, coach.availableSlots[0] || 'Next available')} />
          ))}
        </HorizontalCardRail>
      </CollapsibleSection>

      <CollapsibleSection title="Videos" action="Your clips and saves">
        <HorizontalCardRail>
          {videos.map((video) => (
            <VideoCard key={video.id} video={video} onOpen={() => setVideoSheet(video)} />
          ))}
        </HorizontalCardRail>
      </CollapsibleSection>

      <CollapsibleSection title="Wallet/Credits" action={`${wallet.credits} 974 Credits`} defaultOpen>
        <View style={styles.walletPanel}>
          <Text style={styles.walletBig}>{wallet.credits}</Text>
          <Text style={styles.walletCopy}>974 Credits earned from verified matches, streaks, challenges, profile completion, and future clip uploads.</Text>
        </View>
      </CollapsibleSection>

      <CollapsibleSection title="Customization" action={`${activeCosmeticIds.length} active`}>
        <View style={styles.cosmeticGrid}>
          {cosmetics.map((item) => (
            <View key={item.id} style={[styles.cosmeticCard, activeCosmeticIds.includes(item.id) && styles.cosmeticActive]}>
              <Text style={styles.favoriteTitle}>{item.name}</Text>
              <Text style={styles.panelMeta}>{item.unlocked ? 'Unlocked' : `${item.price} credits${item.premiumOnly ? ' - Premium' : ''}`}</Text>
              <View style={styles.cosmeticActions}>
                <PremiumButton label="Preview" variant="secondary" icon="eye-outline" onPress={() => { previewCosmetic(item.id); setCosmeticSheet(item); }} style={{ flex: 1 }} />
                <PremiumButton label={item.unlocked ? 'Select' : 'Locked'} variant={item.unlocked ? 'primary' : 'subtle'} icon={item.unlocked ? 'check' : 'lock-outline'} onPress={() => (item.unlocked ? selectCosmetic(item.id) : setCosmeticSheet(item))} style={{ flex: 1 }} />
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
        <Text style={styles.panelMeta}>{cosmeticSheet?.premiumOnly ? 'Premium-only cosmetic. Payment and premium unlocks connect later.' : 'Credits spending connects later; preview is local for now.'}</Text>
        <PremiumButton label="Close preview" icon="check" onPress={() => setCosmeticSheet(null)} />
      </ActionSheet>
    </ScrollView>
  );
}

const styles = StyleSheet.create({
  screen: { flex: 1, backgroundColor: colors.background },
  content: { paddingBottom: 104, gap: 20 },
  header: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: colors.primary, paddingTop: 58, paddingBottom: 24, paddingHorizontal: spacing.md },
  kicker: { color: '#F2DCE7', fontWeight: '900', textTransform: 'uppercase', fontSize: 12 },
  name: { color: '#FFFFFF', fontWeight: '900', fontSize: 30, marginTop: 5 },
  sub: { color: '#F7EEF2', fontWeight: '800', marginTop: 5 },
  stats: { marginHorizontal: spacing.md, marginTop: -4, flexDirection: 'row', gap: 10 },
  stat: { flex: 1, backgroundColor: '#FFFFFF', borderRadius: radius.lg, padding: 14, borderWidth: 1, borderColor: colors.border },
  statValue: { color: colors.textPrimary, fontWeight: '900', fontSize: 20 },
  statLabel: { color: colors.textSecondary, fontWeight: '800', marginTop: 4, fontSize: 12 },
  panel: { marginHorizontal: spacing.md, backgroundColor: '#FFFFFF', borderRadius: radius.lg, borderWidth: 1, borderColor: colors.border, padding: 14, gap: 10 },
  progressHead: { flexDirection: 'row', justifyContent: 'space-between', gap: 10 },
  panelTitle: { color: colors.textPrimary, fontWeight: '900' },
  panelMeta: { color: colors.textSecondary, fontWeight: '700' },
  track: { height: 10, borderRadius: 999, backgroundColor: colors.border, overflow: 'hidden' },
  fill: { height: '100%', borderRadius: 999, backgroundColor: colors.primary },
  cosmeticRow: { flexDirection: 'row', justifyContent: 'space-between', gap: 8 },
  cosmetic: { color: colors.primary, fontWeight: '900', fontSize: 12 },
  friendSearch: { marginHorizontal: spacing.md, marginBottom: 8, minHeight: 46, backgroundColor: '#FFFFFF', borderWidth: 1, borderColor: colors.border, borderRadius: radius.pill, paddingHorizontal: 14, color: colors.textPrimary, fontWeight: '800' },
  stack: { marginHorizontal: spacing.md, gap: 10 },
  favorite: { flexDirection: 'row', alignItems: 'center', gap: 10, backgroundColor: '#FFFFFF', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, padding: 12 },
  favoriteTitle: { color: colors.textPrimary, fontWeight: '900' },
  friendStrip: { marginHorizontal: spacing.md, flexDirection: 'row', flexWrap: 'wrap', gap: 8 },
  friendPill: { maxWidth: 178, flexDirection: 'row', alignItems: 'center', gap: 8, padding: 8, paddingRight: 12, borderRadius: radius.pill, backgroundColor: colors.courtSoft, borderWidth: 1, borderColor: '#C7E1D7' },
  friendStatus: { color: colors.textSecondary, fontWeight: '800', fontSize: 10, marginTop: 1 },
  actions: { marginHorizontal: spacing.md, flexDirection: 'row', gap: 10 },
  walletPanel: { marginHorizontal: spacing.md, backgroundColor: colors.darkSection, borderRadius: radius.lg, padding: 16, gap: 8 },
  walletBig: { color: '#FFFFFF', fontSize: 34, fontWeight: '900' },
  walletCopy: { color: '#F2DCE7', fontWeight: '800', lineHeight: 19 },
  cosmeticGrid: { marginHorizontal: spacing.md, gap: 10 },
  cosmeticCard: { backgroundColor: '#FFFFFF', borderRadius: radius.lg, padding: 12, borderWidth: 1, borderColor: colors.border, gap: 8 },
  cosmeticActive: { borderColor: colors.primary, backgroundColor: '#FFF8FB' },
  cosmeticActions: { flexDirection: 'row', gap: 8 },
});
