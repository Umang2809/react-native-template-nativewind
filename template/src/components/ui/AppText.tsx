import React from 'react';
import { Text, type TextProps } from 'react-native';
import { cn } from '../../helper/cn';

/** Type-scale size + default theme color for each variant. */
const variants = {
  header: 'text-header text-text',
  title1: 'text-title1 text-text',
  title2: 'text-title2 text-text',
  title3: 'text-title3 text-text',
  headline: 'text-headline text-text',
  body: 'text-body1 text-text',
  subhead: 'text-subhead text-text',
  secondary: 'text-body2 text-muted',
  footnote: 'text-footnote text-muted',
  caption: 'text-caption1 text-muted',
  overline: 'text-overline uppercase text-muted',
  error: 'text-footnote text-error',
} as const;

export type AppTextVariant = keyof typeof variants;

interface Props extends TextProps {
  variant?: AppTextVariant;
  className?: string;
}

/**
 * Text with a type-scale variant and a theme color. `className` is merged
 * last, so `<AppText variant="body" className="text-primary">` works.
 */
const AppText = ({ variant = 'body', className, ...rest }: Props) => (
  <Text className={cn(variants[variant], className)} {...rest} />
);

export default AppText;
