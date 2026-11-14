/**
 * The exercise animation contract.
 *
 * An exercise says where the pelvis, shoulders, hands and feet go. Knees and
 * elbows are solved by two-bone IK, so joints never bend backwards and planted
 * contacts stay planted. Describing contact points rather than joint angles is
 * what keeps the motion honest: a hand on the floor is a position you can
 * state, not an angle you have to guess.
 *
 * Coordinates are metres: x forward (the figure faces +x), y up, z across.
 */

export type Vec2 = [number, number];

/** Limb lengths. Leg reach is 0.88 m and arm reach 0.57 m. */
export const BODY = {
  thigh: 0.45,
  shin: 0.43,
  upperArm: 0.3,
  forearm: 0.27,
  /** Pelvis to shoulders. Must stay constant across a rep. */
  spine: 0.52,
} as const;

export interface ExercisePose {
  pelvis: Vec2;
  shoulders: Vec2;
  /** Head tilt in radians, forward positive. */
  headAngle: number;

  ankle: Vec2;
  toe: Vec2;
  /** Which way the knee bends. */
  kneePole: Vec2;
  /** Half the stance width. */
  footZ: number;
  /** Extra knee travel outward, for squats. */
  kneeOut?: number;

  /** The far leg, when it differs from the near one. */
  ankleFar?: Vec2;
  toeFar?: Vec2;
  kneePoleFar?: Vec2;

  hand: Vec2;
  /** Which way the elbow bends. */
  elbowPole: Vec2;
  /** Half the hand spacing. */
  handZ: number;
  /** Extra elbow travel outward. */
  elbowFlare?: number;
  /** The far arm, when it differs from the near one. */
  handFar?: Vec2;
  elbowPoleFar?: Vec2;

  /** Set by the renderer so props can follow the hand. */
  _handPoint?: [number, number, number];
}

export type PropName = 'pullupRig' | 'barbell' | 'dipBars' | 'box' | 'wall';

export interface ExerciseDef {
  name: string;
  /**
   * Fractions of one rep: [lowering, hold at the end, returning, hold at the
   * start]. Must sum to 1. Slower lowering than lifting reads as trained.
   */
  tempo: [number, number, number, number];
  /** Label for each of those four segments. */
  phases: [string, string, string, string];
  /** Optional camera override; framing is derived from the pose by default. */
  camera?: { target: [number, number, number]; radius: number };
  props: PropName[];
  /** True when the barbell should track the hand. */
  barbell?: boolean;
  /** Seconds for one full rep. */
  repSeconds?: number;
  /** `d` runs 0 (start) to 1 (deepest or highest point). */
  pose: (d: number) => ExercisePose;
}

export const DEG = Math.PI / 180;
export const lerp = (a: number, b: number, t: number) => a + (b - a) * t;
export const ease = (x: number) => 0.5 - 0.5 * Math.cos(Math.PI * x);
