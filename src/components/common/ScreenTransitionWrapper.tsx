import { ReactNode } from 'react';
import { MotiView } from 'moti';

export function ScreenTransitionWrapper({ children }: { children: ReactNode }) {
  return (
    <MotiView from={{ opacity: 0, translateY: 14 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 360 }} style={{ flex: 1 }}>
      {children}
    </MotiView>
  );
}
