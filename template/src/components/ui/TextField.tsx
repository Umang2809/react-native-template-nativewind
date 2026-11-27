import React, { useState } from 'react';
import { Pressable, Text, TextInput, View, type TextInputProps } from 'react-native';
import { Controller, type Control, type FieldValues, type Path } from 'react-hook-form';
import { useTheme } from '../../hooks/ThemeContext';
import { cn } from '../../helper/cn';
import { AppString } from '../../../constants/AppString';

interface Props<T extends FieldValues>
  extends Omit<TextInputProps, 'value' | 'onChangeText' | 'onBlur' | 'className'> {
  control: Control<T>;
  name: Path<T>;
  label?: string;
  isRequired?: boolean;
  /** Hides the text and shows a Show/Hide toggle. */
  isPassword?: boolean;
  /** Last field of the form: return key becomes "done". */
  isLast?: boolean;
  startIcon?: React.ReactNode;
  endIcon?: React.ReactNode;
  /** Classes for the outer wrapper (margins, width). */
  className?: string;
  /** Classes for the input box. */
  inputClassName?: string;
}

/**
 * Text input wired to react-hook-form: label, error message and focus/error
 * border are handled here. For a field outside a form, use a plain
 * TextInput with the same classes.
 */
function TextField<T extends FieldValues>({
  control,
  name,
  label,
  isRequired,
  isPassword,
  isLast,
  startIcon,
  endIcon,
  className,
  inputClassName,
  ...inputProps
}: Props<T>) {
  const { theme } = useTheme();
  const [hidden, setHidden] = useState(true);
  const [focused, setFocused] = useState(false);

  return (
    <Controller
      control={control}
      name={name}
      render={({ field: { value, onChange, onBlur }, fieldState: { error } }) => (
        <View className={cn('gap-1.5', className)}>
          {label ? (
            <Text className="text-subhead text-text">
              {label}
              {isRequired ? <Text className="text-error"> *</Text> : null}
            </Text>
          ) : null}

          <View
            className={cn(
              'h-12 flex-row items-center gap-3 rounded-xl border border-border bg-card px-4',
              focused && 'border-primary',
              error && 'border-error',
              inputClassName,
            )}>
            {startIcon}
            <TextInput
              value={value ?? ''}
              onChangeText={onChange}
              onFocus={() => setFocused(true)}
              onBlur={() => {
                setFocused(false);
                onBlur();
              }}
              secureTextEntry={isPassword && hidden}
              returnKeyType={isLast ? 'done' : 'next'}
              placeholderTextColor={theme.muted}
              accessibilityLabel={label}
              className="h-full flex-1 text-body1 text-text"
              {...inputProps}
            />
            {isPassword ? (
              <Pressable onPress={() => setHidden(h => !h)} hitSlop={12} accessibilityRole="button">
                {/* ⚠️ Swap for EyeIcon / EyeOffIcon once the SVGs are converted */}
                <Text className="text-footnote text-primary">
                  {hidden ? AppString.show : AppString.hide}
                </Text>
              </Pressable>
            ) : (
              endIcon
            )}
          </View>

          {error?.message ? (
            <Text className="text-footnote text-error">{error.message}</Text>
          ) : null}
        </View>
      )}
    />
  );
}

export default TextField;
