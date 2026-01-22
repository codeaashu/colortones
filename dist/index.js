import { differenceEuclidean, interpolate, oklch, parse } from "culori";
var ColorTones = class i {
	ramps;
	shadeKeys;
	diff;
	neutralRampName;
	static EXACT_THRESHOLD = .02;
	static NEUTRAL_CHROMA = .02;
	constructor(t) {
		this.ramps = t.ramps;
		let n = this.ramps.values().next().value;
		if (!n) throw Error("At least one ramp is required");
		this.shadeKeys = Object.keys(n);
		for (let [e, t] of this.ramps) {
			let n = Object.keys(t);
			if (n.length !== this.shadeKeys.length || !n.every((e) => this.shadeKeys.includes(e))) throw Error(`Ramp ${e} has inconsistent keys`);
		}
		this.diff = differenceEuclidean("oklch"), this.neutralRampName = this.findBestNeutralRamp();
	}
	findBestNeutralRamp() {
		let e = {
			name: "",
			avgChroma: Infinity
		};
		for (let [t, n] of this.ramps) {
			let r = 0, i = 0;
			for (let e of Object.values(n)) e && (r += e.c ?? 0, i++);
			let a = i > 0 ? r / i : Infinity;
			a < e.avgChroma && (e = {
				name: t,
				avgChroma: a
			});
		}
		return e.name;
	}
	generate(e) {
		let t = oklch(parse(e));
		if (!t) throw Error(`Invalid color: ${e}`);
		if ((t.c ?? 0) < i.NEUTRAL_CHROMA) return this.generateNeutral(t);
		let { rampName: a, shade: o, diff: s } = this.findClosestMatch(t);
		if (s < i.EXACT_THRESHOLD) return this.generateFromSingleRamp(t, a, o, s);
		let c = this.findSecondClosest(t, o, a);
		return c ? this.generateBlended(t, o, a, s, c.rampName, c.diff) : this.generateFromSingleRamp(t, a, o, s);
	}
	findClosestMatch(e) {
		let t = {
			rampName: "",
			shade: "",
			diff: Infinity
		};
		for (let [n, r] of this.ramps) for (let [i, a] of Object.entries(r)) {
			if (!a) continue;
			let r = this.diff(e, a);
			r < t.diff && (t = {
				rampName: n,
				shade: i,
				diff: r
			});
		}
		return t;
	}
	findSecondClosest(e, t, n) {
		let r = e.h ?? 0, a = null;
		for (let [o, s] of this.ramps) {
			if (o === n) continue;
			let c = s[t];
			if (!c || (c.c ?? 0) < i.NEUTRAL_CHROMA) continue;
			let l = c.h ?? 0, u = Math.abs(r - l);
			u > 180 && (u = 360 - u);
			let d = this.diff(e, c);
			(!a || u < a.hueDist) && (a = {
				rampName: o,
				diff: d,
				hueDist: u
			});
		}
		return a ? {
			rampName: a.rampName,
			diff: a.diff
		} : null;
	}
	generateNeutral(e) {
		let t = this.neutralRampName, n = this.ramps.get(t), r = this.findClosestShadeInRamp(e, n), i = e.h ?? 0, a = (e.c ?? 0) - (n[r]?.c ?? 0), o = {};
		for (let [e, t] of Object.entries(n)) t && (o[e] = {
			mode: "oklch",
			l: t.l,
			c: Math.max(0, (t.c ?? 0) + a),
			h: i
		});
		return o[r] = e, {
			inputColor: e,
			matchedShade: r,
			method: "exact",
			sources: [{
				name: t,
				diff: 0,
				weight: 1
			}],
			scale: o
		};
	}
	generateFromSingleRamp(e, t, n, r) {
		let a = this.ramps.get(t), o = this.buildScale(a, e, n);
		return {
			inputColor: e,
			matchedShade: n,
			method: r < i.EXACT_THRESHOLD ? "exact" : "single",
			sources: [{
				name: t,
				diff: r,
				weight: 1
			}],
			scale: o
		};
	}
	generateBlended(e, n, r, i, a, o) {
		let s = this.ramps.get(r), c = this.ramps.get(a), l = i + o > 0 ? i / (i + o) : .5, u = {};
		for (let e of this.shadeKeys) {
			let n = s[e], r = c[e];
			!n || !r || (u[e] = interpolate([n, r], "oklch")(l));
		}
		let d = this.buildScale(u, e, n);
		return {
			inputColor: e,
			matchedShade: n,
			method: "blend",
			sources: [{
				name: r,
				diff: i,
				weight: 1 - l
			}, {
				name: a,
				diff: o,
				weight: l
			}],
			scale: d
		};
	}
	findClosestShadeInRamp(e, t) {
		let n = {
			shade: "",
			diff: Infinity
		};
		for (let [r, i] of Object.entries(t)) {
			if (!i) continue;
			let t = this.diff(e, i);
			t < n.diff && (n = {
				shade: r,
				diff: t
			});
		}
		return n.shade;
	}
	buildScale(e, t, n) {
		let r = t.h ?? 0, a = {};
		for (let [t, n] of Object.entries(e)) n && (a[t] = {
			mode: "oklch",
			l: n.l,
			c: n.c ?? 0,
			h: r
		});
		let o = a[n];
		if (!o) return a;
		let s = (e) => Math.abs(e - o.l) < 1e-6 ? t.l : e < o.l ? o.l <= 1e-6 ? t.l : e * (t.l / o.l) : o.l >= .999999 ? t.l : t.l + (e - o.l) * (1 - t.l) / (1 - o.l), c = t.c ?? 0, l = o.c ?? 0, u;
		if (l > i.NEUTRAL_CHROMA) {
			let e = c / l;
			if (c > l) {
				let t = Math.log(c) / Math.log(l);
				u = (n) => n <= 0 ? 0 : Math.min(n * e, n ** +t);
			} else u = (t) => t * e;
		} else {
			let e = c - l;
			u = (t) => t + e;
		}
		let d = {};
		for (let [e, t] of Object.entries(a)) d[e] = {
			mode: "oklch",
			l: Math.max(0, Math.min(1, s(t.l))),
			c: Math.max(0, u(t.c ?? 0)),
			h: t.h
		};
		return d;
	}
	get rampNames() {
		return Array.from(this.ramps.keys());
	}
	get shades() {
		return this.shadeKeys;
	}
};
export { ColorTones };
