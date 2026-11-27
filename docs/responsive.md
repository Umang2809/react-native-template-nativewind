# Responsive UI

## The approach: fixed sizes, flexible layout

React Native measures in **dp** (density-independent pixels), so `16` is about the same physical size on every phone. The template does **not** scale sizes by screen width (`moderateScale` etc.):

- Scaling makes text and buttons grow on bigger phones and tablets, where users expect to see *more* content, not bigger content.
- It stacks on top of the user's system font size.
- It can't be expressed in `className`.

Instead, keep sizes fixed and let the **layout** adapt. These are the same techniques vega-app uses.

## Techniques

### 1. Flex and percentages
Most screens only need this.

```tsx
<View className="flex-1 flex-row gap-3">
  <View className="flex-1 rounded-xl bg-card p-4" />
  <View className="w-1/3 rounded-xl bg-card p-4" />
</View>
```

### 2. A readable column on tablets
The `Screen` component already does this: content is `w-full max-w-[560px] self-center`, so forms and text don't stretch across a 12" tablet.

### 3. Breakpoints
NativeWind breakpoints react to the **window width** (they update on rotation and split-screen):

| Prefix | Window width ≥ |
| --- | --- |
| `sm:` | 640 dp |
| `md:` | 768 dp (tablets, landscape phones) |
| `lg:` | 1024 dp |
| `xl:` | 1280 dp |

```tsx
<View className="flex-col gap-4 md:flex-row">
  <Text className="text-title2 md:text-title1">Dashboard</Text>
</View>
```

`Screen` uses `px-6 md:px-10`.

### 4. Grid columns from the available width
For grids, keep each item a fixed target size and calculate **how many columns fit**:

```tsx
import { FlatList, useWindowDimensions } from 'react-native';

const TARGET_ITEM_WIDTH = 160;
const GAP = 12;
const PADDING = 24;

const ProductGrid = ({ items }) => {
  const { width } = useWindowDimensions();
  const available = width - PADDING * 2;
  const columns = Math.max(2, Math.floor((available + GAP) / (TARGET_ITEM_WIDTH + GAP)));
  const itemWidth = (available - GAP * (columns - 1)) / columns;

  return (
    <FlatList
      key={columns} // FlatList can't change numColumns without remounting
      data={items}
      numColumns={columns}
      columnWrapperClassName="gap-3"
      contentContainerClassName="gap-3 px-6"
      renderItem={({ item }) => <ProductCard item={item} style={{ width: itemWidth }} />}
    />
  );
};
```

A small phone gets 2 columns, a large phone 2–3, a tablet 4–6, and each card stays the same size.

Use `onLayout` instead of the window width when the grid doesn't span the whole screen (e.g. next to a side rail).

### 5. Switch navigation on large screens
Android's large-screen guideline: when the shorter side is ≥ 600 dp, use a side navigation rail instead of a bottom tab bar.

```ts
const { width, height } = useWindowDimensions();
const useRail = Math.min(width, height) >= 600;
```

### 6. Aspect ratio for media
```tsx
<Image source={…} className="aspect-video w-full rounded-xl" />
```

### 7. Screen-relative sizes
For heroes and sheets that should take a share of the screen: `h-[40vh]`, `w-[80vw]`.

## Fonts and accessibility

Text sizes come from the type scale (`text-body1`, `text-title2` …) and follow the user's system font size automatically. To stop very large accessibility sizes from breaking a tight layout, cap them on that `Text`:

```tsx
<Text maxFontSizeMultiplier={1.3} className="text-caption1">Badge</Text>
```

Don't turn font scaling off (`allowFontScaling={false}`) except for things that must fit exactly, such as video player overlays.

## Avoid

- `Dimensions.get('window')` inside components. It's read once and doesn't update on rotation. Use `useWindowDimensions()`.
- Device checks like `isTablet` for layout. Check available width instead (a phone in landscape and a tablet in split-screen are both "medium").
- Hard-coded widths for full-width elements. Use `w-full` / `flex-1`.

## Removed helpers

The old scaling helpers (`horizontalScale`, `verticalScale`, `moderateScale` in `matrics.ts`, and `responsiveFontSize` / `responsiveWidth` / `responsiveHeight` in `utility-functions.ts`) were removed from the template. Don't add them back: use the techniques above.
