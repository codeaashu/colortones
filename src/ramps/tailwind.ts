import { parse, oklch, type Oklch } from 'culori';
import { tailwindColors } from './raw/tailwind';

export type Ramp = Record<string, Oklch>;

export const tailwindRamps = new Map<string, Ramp>(
  Object.entries(tailwindColors).map(([key, value]) => [
    key,
    Object.fromEntries(
      Object.entries(value).map(([shade, color]) => [shade, oklch(parse(color)) as Oklch])
    ),
  ])
);

export default tailwindRamps;
