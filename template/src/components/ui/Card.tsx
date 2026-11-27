import React from 'react';
import { Pressable, View } from 'react-native';
import { cn } from '../../helper/cn';

interface Props {
  children: React.ReactNode;
  /** Makes the card pressable. */
  onPress?: () => void;
  className?: string;
  testID?: string;
}

/** Surface with the theme's card color and border. Pressable when `onPress` is set. */
const Card = ({ children, onPress, className, testID }: Props) => {
  const base = 'rounded-2xl border border-border bg-card p-4';

  if (onPress) {
    return (
      <Pressable
        testID={testID}
        onPress={onPress}
        accessibilityRole="button"
        className={cn(base, 'active:opacity-80', className)}>
        {children}
      </Pressable>
    );
  }

  return (
    <View testID={testID} className={cn(base, className)}>
      {children}
    </View>
  );
};

export default Card;
