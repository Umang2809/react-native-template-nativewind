import { clsx, type ClassValue } from 'clsx';
import { extendTailwindMerge } from 'tailwind-merge';

/**
 * Type-scale classes from tailwind.config.js (`text-title1`, `text-body2` ...).
 * tailwind-merge doesn't know them, so without this it would treat
 * `text-title1` as a color and drop it when combined with `text-muted`.
 * Keep in sync with `theme.extend.fontSize` in tailwind.config.js.
 */
const TYPE_SCALE = [
  'header',
  'title1',
  'title2',
  'title3',
  'headline',
  'body1',
  'subhead',
  'body2',
  'footnote',
  'caption1',
  'caption2',
  'overline',
];

const twMerge = extendTailwindMerge({
  extend: {
    classGroups: {
      'font-size': [{ text: TYPE_SCALE }],
    },
  },
});

/**
 * Joins class names and resolves Tailwind conflicts (the last one wins).
 *
 *   cn('h-12 px-5 bg-primary', isDisabled && 'opacity-50', className)
 *
 * Use it wherever a component merges its own classes with a `className`
 * prop, so a caller's `px-2` really replaces the component's `px-5`.
 */
export const cn = (...inputs: ClassValue[]) => twMerge(clsx(inputs));
