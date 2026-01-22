import { type Oklch } from 'culori';
export type Ramp = Record<string, Oklch>;
export type { Oklch };
export interface ColorTonesOptions {
    ramps: Map<string, Ramp>;
}
export interface GenerateResult {
    inputColor: Oklch;
    matchedShade: string;
    method: 'exact' | 'single' | 'blend';
    sources: {
        name: string;
        diff: number;
        weight: number;
    }[];
    scale: Record<string, Oklch>;
}
export declare class ColorTones {
    private ramps;
    private shadeKeys;
    private diff;
    private neutralRampName;
    private static EXACT_THRESHOLD;
    private static NEUTRAL_CHROMA;
    constructor(options: ColorTonesOptions);
    private findBestNeutralRamp;
    generate(color: string): GenerateResult;
    private findClosestMatch;
    private findSecondClosest;
    private generateNeutral;
    private generateFromSingleRamp;
    private generateBlended;
    private findClosestShadeInRamp;
    private buildScale;
    get rampNames(): string[];
    get shades(): string[];
}
//# sourceMappingURL=index.d.ts.map