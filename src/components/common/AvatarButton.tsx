import { Pressable, StyleSheet } from 'react-native';
import { PlayerAvatar } from './PlayerAvatar';

export function AvatarButton({ name, uri, onPress, size = 44 }: { name: string; uri?: string; onPress: () => void; size?: number }) {
  return (
    <Pressable onPress={onPress} style={({ pressed }) => [styles.button, pressed && styles.pressed]}>
      <PlayerAvatar name={name} uri={uri} size={size} />
    </Pressable>
  );
}

const styles = StyleSheet.create({
  button: { borderRadius: 999 },
  pressed: { transform: [{ scale: 0.94 }] },
});
