import React from 'react';
import { View } from 'react-native';
import { SafeAreaView, type Edge } from 'react-native-safe-area-context';
import { cn } from '../helper/cn';

interface ScreenProps {
  children: React.ReactNode;
  /** Extra classes for the content column, e.g. "justify-center". */
  className?: string;
  /** Safe-area edges to pad. Leave out 'bottom' when a tab bar owns it. */
  edges?: Edge[];
  /** Let the content use the full width on tablets instead of a centered column. */
  fullWidth?: boolean;
}

/**
 * Standard screen wrapper: safe area + theme background + a content column
 * that stays readable on tablets (max 560dp, centered) and gets more side
 * padding from the `md` breakpoint (window width >= 768dp).
 */
const Screen = ({
  children,
  className,
  edges = ['top', 'bottom', 'left', 'right'],
  fullWidth = false,
}: ScreenProps) => (
  <SafeAreaView edges={edges} className="flex-1 bg-background">
    <View
      className={cn(
        'w-full flex-1 px-6 md:px-10',
        !fullWidth && 'max-w-[560px] self-center',
        className,
      )}>
      {children}
    </View>
  </SafeAreaView>
);

export default Screen;
