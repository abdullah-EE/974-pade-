import { useState } from 'react';
import * as ImagePicker from 'expo-image-picker';
import { Modal, Pressable, ScrollView, StyleSheet, Text, TextInput, View } from 'react-native';
import { MotiView } from 'moti';
import { PremiumButton } from '@/components/common/PremiumButton';
import { PlayerAvatar } from '@/components/common/PlayerAvatar';
import { useAppState } from '@/state/AppState';
import { colors, radius, spacing } from '@/theme/tokens';
import { Area, Level } from '@/types/models';

const levels: Level[] = ['Beginner', 'Intermediate', 'Advanced'];
const areas: Area[] = ['Lusail', 'Education City', 'Katara', 'Msheireb', 'The Pearl', 'West Bay', 'Aspire', 'Al Waab'];

export function OnboardingGate() {
  const { account, createAccount } = useAppState();
  const [name, setName] = useState('Abdullah Haydar');
  const [username, setUsername] = useState('@abdullah.haydar');
  const [level, setLevel] = useState<Level>('Intermediate');
  const [favoriteArea, setFavoriteArea] = useState<Area>('Lusail');
  const [avatarUri, setAvatarUri] = useState<string | undefined>();
  const [message, setMessage] = useState('');

  if (account) return null;

  const submit = () => {
    if (!name.trim() || !username.trim()) return;
    createAccount({ name, username, level, favoriteArea, avatarUri });
  };

  const chooseAvatar = async () => {
    const result = await ImagePicker.launchImageLibraryAsync({ mediaTypes: ImagePicker.MediaTypeOptions.Images, quality: 0.8 });
    if (!result.canceled) {
      setAvatarUri(result.assets[0].uri);
      setMessage('Avatar added locally.');
    }
  };

  return (
    <Modal visible transparent animationType="fade">
      <View style={styles.backdrop}>
        <MotiView from={{ opacity: 0, translateY: 28, scale: 0.98 }} animate={{ opacity: 1, translateY: 0, scale: 1 }} transition={{ type: 'timing', duration: 360 }} style={styles.sheet}>
          <Text style={styles.kicker}>974 Padel Qatar</Text>
          <Text style={styles.title}>Build your local ranking profile</Text>
          <Text style={styles.subtitle}>Create your local player profile for challenges, friends, match proof, and rankings.</Text>

          <View style={styles.avatarRow}>
            <PlayerAvatar name={name || '974 Player'} uri={avatarUri} size={58} />
            <View style={{ flex: 1 }}>
              <Text style={styles.label}>Profile photo</Text>
              <Text style={styles.subtitle}>{message || 'Optional now, important for player trust later.'}</Text>
            </View>
            <PremiumButton label="Choose" variant="secondary" icon="image-outline" onPress={chooseAvatar} />
          </View>

          <TextInput value={name} onChangeText={setName} placeholder="Full name" style={styles.input} placeholderTextColor={colors.textSecondary} />
          <TextInput value={username} onChangeText={setUsername} placeholder="@username" autoCapitalize="none" style={styles.input} placeholderTextColor={colors.textSecondary} />

          <Text style={styles.label}>Level</Text>
          <View style={styles.row}>
            {levels.map((item) => (
              <Pressable key={item} onPress={() => setLevel(item)} style={[styles.chip, level === item && styles.chipActive]}>
                <Text style={[styles.chipText, level === item && styles.chipTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </View>

          <Text style={styles.label}>Favorite area</Text>
          <ScrollView horizontal showsHorizontalScrollIndicator={false} contentContainerStyle={styles.row}>
            {areas.map((item) => (
              <Pressable key={item} onPress={() => setFavoriteArea(item)} style={[styles.chip, favoriteArea === item && styles.chipActive]}>
                <Text style={[styles.chipText, favoriteArea === item && styles.chipTextActive]}>{item}</Text>
              </Pressable>
            ))}
          </ScrollView>

          <PremiumButton label="Enter 974 Padel" icon="arrow-right" onPress={submit} />
        </MotiView>
      </View>
    </Modal>
  );
}

const styles = StyleSheet.create({
  backdrop: { flex: 1, justifyContent: 'flex-end', backgroundColor: 'rgba(26,16,21,0.56)' },
  sheet: { backgroundColor: colors.pearl, borderTopLeftRadius: 28, borderTopRightRadius: 28, padding: spacing.xl, gap: 14 },
  kicker: { color: colors.primary, fontSize: 12, fontWeight: '900', textTransform: 'uppercase' },
  title: { color: colors.textPrimary, fontSize: 30, lineHeight: 35, fontWeight: '900' },
  subtitle: { color: colors.textSecondary, fontWeight: '700', lineHeight: 20 },
  input: { minHeight: 52, backgroundColor: '#FFFFFF', borderRadius: radius.md, borderWidth: 1, borderColor: colors.border, paddingHorizontal: 14, color: colors.textPrimary, fontWeight: '800' },
  avatarRow: { flexDirection: 'row', alignItems: 'center', gap: 12, backgroundColor: '#FFFFFF', borderRadius: radius.lg, padding: 12, borderWidth: 1, borderColor: colors.border },
  label: { color: colors.textPrimary, fontWeight: '900', marginTop: 2 },
  row: { flexDirection: 'row', gap: 8, paddingRight: spacing.md },
  chip: { paddingHorizontal: 13, paddingVertical: 9, borderRadius: radius.pill, borderWidth: 1, borderColor: colors.border, backgroundColor: '#FFFFFF' },
  chipActive: { backgroundColor: colors.primary, borderColor: colors.primary },
  chipText: { color: colors.textSecondary, fontWeight: '800' },
  chipTextActive: { color: '#FFFFFF' },
});
