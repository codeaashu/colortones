# colortones

A mini-library to transform any color into a full palette, based on the perceptual "DNA" of any design system.

![colortones.png](https://raw.githubusercontent.com/codeaashu/colortones/main/colortones.png)

Demo: https://colortonesx.vercel.app/

## How it works

Most palette generators for popular frameworks either match a single color or ignore the careful work that was put into creating the original palettes entirely. colorTones takes a different approach: it analyzes the perceptual "DNA" (Lightness and Chroma curves in Oklch space) of popular design systems like Tailwind or Radix. It then maps your target hue onto these curves, ensuring your custom palette maintains similar accessible contrast ratios and vibrancy as the reference system.

## Install

```bash
npm install colortones
```

## Usage

```typescript
import { ColorTones } from 'colortones';
import { tailwindRamps } from 'colortones/ramps/tailwind';
// or
import { radixRamps } from 'colortones/ramps/radix';
import { formatCss, formatHex } from 'culori';

// Use Tailwind ramps (shades: 50-950)
const ditto = new ColorTones({ ramps: tailwindRamps });

// Or Radix ramps (shades: 1-12)
const dittoRadix = new ColorTones({ ramps: radixRamps });

const result = ditto.generate('#F97316');

// result.scale contains Oklch color objects
// Use culori's formatCss or formatHex to convert:

for (const [shade, color] of Object.entries(result.scale)) {
  console.log(`${shade}: ${formatCss(color)}`);
  // 50: oklch(0.98 0.016 49)
  // 100: oklch(0.954 0.038 49)
  // ...
}

// Or as hex:
for (const [shade, color] of Object.entries(result.scale)) {
  console.log(`${shade}: ${formatHex(color)}`);
}
```

## Result

```typescript
interface GenerateResult {
  inputColor: Oklch; // Parsed input color
  matchedShade: string; // e.g. "500"
  method: 'exact' | 'single' | 'blend';
  sources: {
    // Which ramps were used
    name: string;
    diff: number;
    weight: number;
  }[];
  scale: Record<string, Oklch>; // The generated palette
}
```

## How it works

1. **Parse input** — converts the input into `Oklch` via `culori`
2. **Handle neutrals** — if chroma is very low, picks the “most neutral” ramp and returns it as-is
3. **Find closest match** — finds the nearest ramp color by Euclidean distance in OKLCH (`diff`)
4. **Pick strategy** — `exact` if `diff` is below a small threshold, otherwise `single` (one ramp) or `blend` (two ramps; second ramp chosen by closest hue at the matched shade)
5. **Rotate hue + correct L/C** — sets the target hue across the scale, then adjusts lightness and chroma:
   - **Lightness**: Uses piecewise linear interpolation anchored at 0 (black) and 1 (white). This ensures the matched shade hits the target lightness exactly, while preventing lighter shades from being clamped to white or becoming too dark.
   - **Chroma**: Uses a hybrid approach. If the target chroma is higher than the reference, it applies **linear scaling** for lower chroma values (preserving delicate pastels) and **power curve scaling** for higher chroma values (preventing oversaturation in the most colorful shades). If the target chroma is lower, it uses a constant offset.

## Custom ramps

```typescript
import { ColorTones } from 'colortones';
import { parse, oklch, type Oklch } from 'culori';

const customRamps = new Map([
  [
    'brand',
    {
      '50': oklch(parse('oklch(98% 0.01 250)')) as Oklch,
      '500': oklch(parse('#3B82F6')) as Oklch,
      '950': oklch(parse('oklch(25% 0.05 250)')) as Oklch,
    },
  ],
]);

const ditto = new ColorTones({ ramps: customRamps });
```

## Dev

```bash
npm install
npm run dev     # Start dev server with demo
npm run build   # Build library
npm run preview # Preview the demo build
```

## Notes

- ESM-only package (`"type": "module"`).

## Flowchart

```text
      Input Color
           │
           ▼
     Parse to OKLCH
           │
           ▼
   Is chroma very low?
     ┌─────┴─────┐
     ▼           ▼
    yes          no
     │           │
     ▼           ▼
 Use most     Find closest ramp
 neutral      + matched shade
 ramp             │
     │            │
     │            ▼
     │   Is diff below threshold?
     │       ┌────┴────┐
     │       ▼         ▼
     │      yes        no
     │       │         │
     │       ▼         ▼
     │  Use single   Pick second ramp
     │     ramp      (closest hue at
     │               matched shade)
     │                 │
     │           ┌─────┴─────┐
     │           ▼           ▼
     │          none       found
     │           │           │
     │           ▼           ▼
     │      Use single   Blend ramps
     │         ramp      (weighted)
     │           │           │
     └──────┬────┴──────┬────┘
            │           │
            ▼           ▼
      Rotate hue + correct L/C
                 │
                 ▼
         Generated Palette
```


<h1 align="center"><img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Glowing%20Star.png" alt="Glowing Star" width="25" height="25" /> Give us a Star and let's make magic! <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Travel%20and%20places/Glowing%20Star.png" alt="Glowing Star" width="25" height="25" /></h1>

<div align="center">
    <a href="#top">
        <img src="https://img.shields.io/badge/Back%20to%20Top-000000?style=for-the-badge&logo=github&logoColor=white" alt="Back to Top">
    </a><br>
     <img src="https://raw.githubusercontent.com/Tarikul-Islam-Anik/Animated-Fluent-Emojis/master/Emojis/Objects/Mirror%20Ball.png" alt="Mirror Ball" width="150" height="150" />
</div>
