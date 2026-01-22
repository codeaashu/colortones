import { parse, oklch, type Oklch } from 'culori';
import {
  gray,
  mauve,
  slate,
  sage,
  olive,
  sand,
  tomato,
  red,
  ruby,
  crimson,
  pink,
  plum,
  purple,
  violet,
  iris,
  indigo,
  blue,
  cyan,
  teal,
  jade,
  green,
  grass,
  bronze,
  gold,
  brown,
  sky,
  mint,
  lime,
  yellow,
  amber,
  orange,
} from './raw/radix-light';

export type Ramp = Record<string, Oklch>;

// Convert radix 1-12 keys to our format
function parseRamp(colors: Record<string, string>): Ramp {
  const ramp: Ramp = {};
  for (const [key, value] of Object.entries(colors)) {
    // Extract number from key like "gray1" -> "1"
    const num = key.replace(/[a-zA-Z]/g, '');
    const parsed = oklch(parse(value));
    if (parsed) ramp[num] = parsed;
  }
  return ramp;
}

export const radixRamps = new Map<string, Ramp>([
  ['gray', parseRamp(gray)],
  ['mauve', parseRamp(mauve)],
  ['slate', parseRamp(slate)],
  ['sage', parseRamp(sage)],
  ['olive', parseRamp(olive)],
  ['sand', parseRamp(sand)],
  ['tomato', parseRamp(tomato)],
  ['red', parseRamp(red)],
  ['ruby', parseRamp(ruby)],
  ['crimson', parseRamp(crimson)],
  ['pink', parseRamp(pink)],
  ['plum', parseRamp(plum)],
  ['purple', parseRamp(purple)],
  ['violet', parseRamp(violet)],
  ['iris', parseRamp(iris)],
  ['indigo', parseRamp(indigo)],
  ['blue', parseRamp(blue)],
  ['cyan', parseRamp(cyan)],
  ['teal', parseRamp(teal)],
  ['jade', parseRamp(jade)],
  ['green', parseRamp(green)],
  ['grass', parseRamp(grass)],
  ['bronze', parseRamp(bronze)],
  ['gold', parseRamp(gold)],
  ['brown', parseRamp(brown)],
  ['sky', parseRamp(sky)],
  ['mint', parseRamp(mint)],
  ['lime', parseRamp(lime)],
  ['yellow', parseRamp(yellow)],
  ['amber', parseRamp(amber)],
  ['orange', parseRamp(orange)],
]);

export default radixRamps;
