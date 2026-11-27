import React from 'react';
import { ActivityIndicator, Pressable, Text } from 'react-native';
import { useTheme } from '../../hooks/ThemeContext';
import { cn } from '../../helper/cn';

const containerVariants = {
  primary: 'bg-primary',
  secondary: 'bg-secondary',
  outline: 'border border-border active:bg-card',
  danger: 'bg-error',
  ghost: 'bg-transparent active:bg-card',
} as const;

const labelVariants = {
  primary: 'text-on-primary',
  secondary: 'text-text',
  outline: 'text-text',
  danger: 'text-on-primary',
  ghost: 'text-primary',
} as const;

const sizes = {
  sm: 'h-9 px-3 rounded-lg',
  md: 'h-12 px-5 rounded-xl',
  lg: 'h-14 px-6 rounded-2xl',
} as const;

export type ButtonVariant = keyof typeof containerVariants;
export type ButtonSize = keyof typeof sizes;

interface Props {
  label: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  loading?: boolean;
  disabled?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  /** Classes for the container (margins, width ...). */
  className?: string;
  /** Classes for the label (e.g. `text-error` on an outline button). */
  labelClassName?: string;
  testID?: string;
}

const Button = ({
  label,
  onPress,
  variant = 'primary',
  size = 'md',
  loading = false,
  disabled = false,
  startIcon,
  endIcon,
  className,
  labelClassName,
  testID,
}: Props) => {
  const { theme } = useTheme();
  const isDisabled = disabled || loading;
  const spinnerColor = variant === 'primary' || variant === 'danger' ? theme.onPrimary : theme.text;

  return (
    <Pressable
      testID={testID}
      onPress={onPress}
      disabled={isDisabled}
      accessibilityRole="button"
      accessibilityLabel={label}
      accessibilityState={{ disabled: isDisabled, busy: loading }}
      className={cn(
        'flex-row items-center justify-center gap-2 active:opacity-80',
        sizes[size],
        containerVariants[variant],
        isDisabled && 'opacity-50',
        className,
      )}>
      {loading ? (
        <ActivityIndicator color={spinnerColor} />
      ) : (
        <>
          {startIcon}
          <Text className={cn('text-headline', labelVariants[variant], labelClassName)}>
            {label}
          </Text>
          {endIcon}
        </>
      )}
    </Pressable>
  );
};

export default Button;
