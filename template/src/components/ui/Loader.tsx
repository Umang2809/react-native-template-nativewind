import React from 'react';
import { ActivityIndicator, View } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { cn } from '../../helper/cn';

interface Props {
  isLoading: boolean;
  /** `overlay` covers the parent (blocks touches); `inline` is a centered spinner. */
  variant?: 'overlay' | 'inline';
  className?: string;
}

/**
 * Loading indicator. Put the overlay variant last inside a screen so it
 * covers the content: `<Loader isLoading={isPending} />`.
 */
const Loader = ({ isLoading, variant = 'overlay', className }: Props) => {
  const { theme } = useTheme();

  if (!isLoading) {
    return null;
  }

  return (
    <View
      accessibilityRole="progressbar"
      className={cn(
        'items-center justify-center',
        variant === 'overlay' ? 'absolute inset-0 z-50 bg-background/60' : 'py-6',
        className,
      )}>
      <ActivityIndicator size="large" color={theme.primary} />
    </View>
  );
};

export default Loader;
