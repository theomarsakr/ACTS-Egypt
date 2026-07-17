/* Every product image in each brand's public/images/<folder>/, with the hero
   default first. Shared by the hero card stack (HeroProductCards) and the
   homepage "Represented brands" cards (AutoRotateImage), so the filename lists
   live in exactly one place. */

const FARRIS = [
  "pilot-operated",
  "actuated-control-valve",
  "body-options",
  "compact-relief-valve",
  "cross-section-detail",
  "cross-section",
  "direct-spring-closeup",
  "direct-spring-flanged-lever",
  "direct-spring-lever",
  "direct-spring-valve",
  "insure-monitoring-compact",
  "insure-monitoring",
  "pilot-assisted-pair",
  "pilot-operated-branded",
  "pilot-operated-dual-gauge",
  "spring-operated-angle",
  "spring-operated-compact",
  "spring-operated-lever",
  "valve-pair",
  "valve-range-grouped",
  "valve-range",
].map((n) => `/images/farris/${n}.jpg`);

const DYNAFLO = [
  "df400-rotary-plug",
  "4000-pressure-controller",
  "5000-level-controller",
  "760-positioner",
  "dfc-dfo-actuators",
  "dflp-piston-actuator",
  "dfn-yokeless-actuator",
  "dfr-rotary-actuator",
  "dfrp-piston-actuator",
  "integral-valve-actuator",
  "pro-50-regulator",
  "ps2-positioner",
  "rotary-ball",
  "sliding-stem",
  "t950xp-transducer",
].map((n) => `/images/dynaflo/${n}.jpg`);

const EST = [
  "griptight-max",
  "air-cooled-hx",
  "cpi-perma-plug",
  "double-block-bleed",
  "g250-vacuum-tube-tester",
  "g650-vacuum-joint-tester",
  "griptight-elbow",
  "griptight-isolation",
  "griptight-pe",
  "griptight-reverse-pressure",
  "high-lift-flange-weld",
  "hydra-loc-sleeving",
  "manual-installation-tool",
  "od-griptight",
  "p2-plug",
  "ram-package",
  "removal-tool",
  "smart-ram-640t",
  "smart-ram-plus",
  "socket-weld-sqs",
  "tube-stabilizer",
].map((n) => `/images/est/${n}.jpg`);

/** Keyed by the public/images/ folder name. */
export const brandProductImages: Record<string, string[]> = {
  farris: FARRIS,
  dynaflo: DYNAFLO,
  est: EST,
};

/** Brand slug (from lib/data.ts) → its public/images/ folder name. */
export const brandSlugToFolder: Record<string, string> = {
  "farris-engineering": "farris",
  "dyna-flo": "dynaflo",
  est: "est",
};
