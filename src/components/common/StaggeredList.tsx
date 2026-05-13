import { Children, ReactNode } from 'react';
import { MotiView } from 'moti';

export function StaggeredList({ children }: { children: ReactNode }) {
  return (
    <>
      {Children.map(children, (child, index) => (
        <MotiView from={{ opacity: 0, translateY: 12 }} animate={{ opacity: 1, translateY: 0 }} transition={{ type: 'timing', duration: 280, delay: index * 55 }}>
          {child}
        </MotiView>
      ))}
    </>
  );
}
