import { ReactNode, useCallback, useState } from 'react';
import { MotiView } from 'moti';
import { useFocusEffect } from 'expo-router';

export function ScreenTransitionWrapper({ children }: { children: ReactNode }) {
  const [focusKey, setFocusKey] = useState(0);
  useFocusEffect(
    useCallback(() => {
      setFocusKey((value) => value + 1);
    }, []),
  );
  return (
    <MotiView key={focusKey} from={{ opacity: 0, translateY: 14 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 320 }} style={{ flex: 1 }}>
      {children}
    </MotiView>
  );
}
