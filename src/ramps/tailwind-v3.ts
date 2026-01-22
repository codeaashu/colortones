import { parse, oklch, type Oklch } from 'culori';
import { tailwindV3Colors } from './raw/tailwind-v3';

export type Ramp = Record<string, Oklch>;

export const tailwindV3Ramps = new Map<string, Ramp>(
  Object.entries(tailwindV3Colors).map(([key, value]) => [
    key,
    Object.fromEntries(
      Object.entries(value).map(([shade, color]) => [shade, oklch(parse(color)) as Oklch])
    ),
  ])
);

export default tailwindV3Ramps;
