import React, { useEffect, useState } from 'react';
import { Pressable, Text, View } from 'react-native';
import Animated, { FadeInDown, FadeOutDown } from 'react-native-reanimated';
import { useSafeAreaInsets } from 'react-native-safe-area-context';
import { subscribeSnackbar, type SnackbarMessage } from '../../helper/snackbar';
import { cn } from '../../helper/cn';

const toneClassNames = {
  success: 'bg-text',
  info: 'bg-text',
  error: 'bg-error',
} as const;

const titleClassNames = {
  success: 'text-background',
  info: 'text-background',
  error: 'text-on-primary',
} as const;

/**
 * Renders messages sent with showSnackbar / showErrorSnackbar. Mounted once
 * in App.tsx inside ThemeProvider; one message at a time, newest wins.
 */
const SnackbarHost = () => {
  const insets = useSafeAreaInsets();
  const [snack, setSnack] = useState<SnackbarMessage | null>(null);

  useEffect(() => subscribeSnackbar(setSnack), []);

  useEffect(() => {
    if (!snack) {
      return;
    }
    const timer = setTimeout(() => setSnack(null), snack.duration);
    return () => clearTimeout(timer);
  }, [snack]);

  return (
    <View
      pointerEvents="box-none"
      className="absolute inset-x-0 bottom-0 px-4"
      style={{ paddingBottom: insets.bottom + 16 }}>
      {/* Reanimated handles enter/exit; classes stay on plain RN components. */}
      {snack ? (
        <Animated.View key={snack.id} entering={FadeInDown} exiting={FadeOutDown}>
          <Pressable
            onPress={() => setSnack(null)}
            accessibilityRole="alert"
            accessibilityLiveRegion="polite"
            className={cn(
              'w-full max-w-[560px] self-center rounded-xl px-4 py-3 shadow-md',
              toneClassNames[snack.type],
            )}>
            <Text className={cn('text-subhead font-semibold', titleClassNames[snack.type])}>
              {snack.title}
            </Text>
            {snack.message ? (
              <Text className={cn('mt-0.5 text-footnote opacity-80', titleClassNames[snack.type])}>
                {snack.message}
              </Text>
            ) : null}
          </Pressable>
        </Animated.View>
      ) : null}
    </View>
  );
};

export default SnackbarHost;
