import {
  BODY,
  DEG,
  lerp,
  type ExerciseDef,
  type ExercisePose,
  type Vec2,
} from './types';

/**
 * One entry per movement, keyed by the movement id in data/fitness/movements.
 *
 * Each `pose(d)` states where the pelvis, shoulders, hands and feet are at
 * depth `d` (0 = start, 1 = deepest or highest point). Knees and elbows come
 * from IK. The rules that keep these honest:
 *
 *  - planted contacts must not move across the rep
 *  - pelvis to shoulders always spans BODY.spine
 *  - hips travel back as well as down in squats and hinges
 *  - lowering is slower than lifting, with short holds at the ends
 */

/** Shoulders placed a spine's length from the pelvis at a given lean. */
function shouldersFrom(pelvis: Vec2, leanRad: number): Vec2 {
  return [
    pelvis[0] + BODY.spine * Math.sin(leanRad),
    pelvis[1] + BODY.spine * Math.cos(leanRad),
  ];
}

/**
 * A body held rigid between a planted contact and the shoulders, as in a
 * push-up or plank. `anchor` is the pivot (toes), `sy` the shoulder height.
 */
function rigidLine(anchor: Vec2, sy: number, reach: number) {
  const th = Math.asin(Math.max(-1, Math.min(1, (sy - anchor[1]) / reach)));
  const c = Math.cos(th);
  const s = Math.sin(th);
  return {
    th,
    at: (k: number): Vec2 => [anchor[0] + c * k, anchor[1] + s * k],
  };
}

/** Lying on the back: pelvis on the floor, head toward +x. */
const SUPINE_PELVIS: Vec2 = [0, 0.13];
const supineShoulders: Vec2 = [
  SUPINE_PELVIS[0] + BODY.spine,
  SUPINE_PELVIS[1] + 0.02,
];

export const EXERCISES: Record<string, ExerciseDef> = {
  // ---- Ported from the reference set ------------------------------------
  'box-squat': {
    name: 'Box squat to parallel',
    tempo: [0.4, 0.07, 0.31, 0.22],
    phases: ['Sitting back', 'Tap the box', 'Driving up', 'Standing tall'],
    camera: { target: [0, 0.85, 0], radius: 4.3 },
    props: ['box'],
    pose(d) {
      const pelvis: Vec2 = [-0.3 * d, lerp(0.94, 0.56, d)];
      const lean = (8 + 32 * d) * DEG;
      return {
        pelvis,
        shoulders: shouldersFrom(pelvis, lean),
        headAngle: lean * 0.35,
        ankle: [0, 0.08],
        toe: [0.2, 0.045],
        kneePole: [1, 0],
        footZ: 0.13,
        kneeOut: 0.025 * d,
        hand: [
          shouldersFrom(pelvis, lean)[0] + 0.5,
          shouldersFrom(pelvis, lean)[1] - 0.02,
        ],
        elbowPole: [0, -1],
        handZ: 0.2,
        elbowFlare: 0,
      };
    },
  },

  'push-up': {
    name: 'Push-up',
    tempo: [0.4, 0.06, 0.36, 0.18],
    phases: ['Lowering', 'Chest to the floor', 'Pressing up', 'Top of the rep'],
    camera: { target: [0.75, 0.4, 0], radius: 4.4 },
    props: [],
    pose(d) {
      const line = rigidLine([0, 0.04], lerp(0.6, 0.2, d), 1.54);
      return {
        pelvis: line.at(1.02),
        shoulders: line.at(1.54),
        headAngle: 90 * DEG - line.th - 15 * DEG,
        ankle: line.at(0.14),
        toe: [0, 0.04],
        kneePole: [0, 1],
        footZ: 0.09,
        kneeOut: 0,
        hand: [1.435, 0.04],
        elbowPole: [-1, 0.35],
        handZ: 0.21,
        elbowFlare: 0.11 * d,
      };
    },
  },

  'pull-up': {
    name: 'Pull-up',
    tempo: [0.3, 0.08, 0.44, 0.18],
    phases: ['Pulling up', 'Chin over the bar', 'Lowering slowly', 'Dead hang'],
    camera: { target: [0, 1.25, 0], radius: 5.3 },
    props: ['pullupRig'],
    pose(d) {
      const shoulders: Vec2 = [lerp(-0.04, -0.2, d), lerp(1.64, 2.08, d)];
      const lean = lerp(4, 20, d) * DEG;
      const pelvis: Vec2 = [
        shoulders[0] + BODY.spine * Math.sin(lean),
        shoulders[1] - BODY.spine * Math.cos(lean),
      ];
      const ankle: Vec2 = [pelvis[0] - 0.2 - 0.1 * d, pelvis[1] - 0.72];
      return {
        pelvis,
        shoulders,
        headAngle: -6 * DEG,
        ankle,
        toe: [ankle[0] - 0.05, ankle[1] - 0.13],
        kneePole: [1, 0],
        footZ: 0.06,
        kneeOut: 0,
        hand: [0, 2.2],
        elbowPole: [0.3, -1],
        handZ: 0.22,
        elbowFlare: 0.03,
      };
    },
  },

  rdl: {
    name: 'Romanian deadlift',
    tempo: [0.42, 0.06, 0.34, 0.18],
    phases: [
      'Hinging back',
      'Hamstring stretch',
      'Driving hips forward',
      'Lockout',
    ],
    camera: { target: [0, 0.85, 0], radius: 4.4 },
    props: [],
    pose(d) {
      const pelvis: Vec2 = [-0.35 * d, lerp(0.94, 0.83, d)];
      const lean = lerp(4, 75, d) * DEG;
      const shoulders = shouldersFrom(pelvis, lean);
      return {
        pelvis,
        shoulders,
        headAngle: lean * 0.55,
        ankle: [0, 0.08],
        toe: [0.2, 0.045],
        kneePole: [1, 0],
        footZ: 0.11,
        kneeOut: 0,
        hand: [shoulders[0] + 0.1, shoulders[1] - 0.55],
        elbowPole: [0, -1],
        handZ: 0.21,
        elbowFlare: 0,
      };
    },
  },

  // ---- Hanging ----------------------------------------------------------
  'dead-hang': {
    name: 'Dead hang',
    tempo: [0.45, 0.05, 0.45, 0.05],
    phases: ['Settling', 'Hanging', 'Shoulders down', 'Hanging'],
    repSeconds: 6,
    camera: { target: [0, 1.25, 0], radius: 5.3 },
    props: ['pullupRig'],
    pose(d) {
      // Shoulders drop slightly as the hang relaxes, then pull back down.
      const shoulders: Vec2 = [-0.02, lerp(1.7, 1.63, d)];
      const pelvis: Vec2 = [shoulders[0] + 0.015, shoulders[1] - BODY.spine];
      const ankle: Vec2 = [pelvis[0] - 0.02, pelvis[1] - 0.84];
      return {
        pelvis,
        shoulders,
        headAngle: -4 * DEG,
        ankle,
        toe: [ankle[0] + 0.02, ankle[1] - 0.14],
        kneePole: [1, 0],
        footZ: 0.07,
        kneeOut: 0,
        hand: [0, 2.2],
        elbowPole: [0.3, -1],
        handZ: 0.22,
        elbowFlare: 0.01,
      };
    },
  },

  'hanging-knee-raise': {
    name: 'Hanging knee raise',
    tempo: [0.34, 0.08, 0.4, 0.18],
    phases: ['Raising the knees', 'Top of the raise', 'Lowering', 'Dead hang'],
    camera: { target: [0.1, 1.2, 0], radius: 5.2 },
    props: ['pullupRig'],
    pose(d) {
      const shoulders: Vec2 = [-0.02, 1.66];
      const pelvis: Vec2 = [shoulders[0] + 0.02 * d, shoulders[1] - BODY.spine];
      // Knees come toward the chest, so the ankle tucks up and forward.
      const ankle: Vec2 = [
        lerp(pelvis[0] - 0.02, pelvis[0] + 0.34, d),
        lerp(pelvis[1] - 0.84, pelvis[1] - 0.06, d),
      ];
      return {
        pelvis,
        shoulders,
        headAngle: -4 * DEG,
        ankle,
        toe: [ankle[0] + 0.1 * (1 - d) + 0.05, ankle[1] - 0.12 * (1 - d)],
        kneePole: [1, -0.2],
        footZ: 0.08,
        kneeOut: 0,
        hand: [0, 2.2],
        elbowPole: [0.3, -1],
        handZ: 0.22,
        elbowFlare: 0.01,
      };
    },
  },

  'australian-row': {
    name: 'Australian row',
    tempo: [0.34, 0.09, 0.39, 0.18],
    phases: [
      'Pulling to the bar',
      'Chest to the bar',
      'Lowering',
      'Arms straight',
    ],
    camera: { target: [0.1, 0.75, 0], radius: 4.4 },
    props: ['pullupRig'],
    pose(d) {
      // Heels planted, body rigid, chest travels up to a fixed bar.
      const line = rigidLine([-0.95, 0.07], lerp(0.62, 0.9, d), 1.62);
      return {
        pelvis: line.at(1.1),
        shoulders: line.at(1.62),
        headAngle: 68 * DEG - line.th,
        ankle: line.at(0.2),
        toe: [-0.95, 0.07],
        kneePole: [0, 1],
        footZ: 0.1,
        kneeOut: 0,
        hand: [0.36, 1.08],
        elbowPole: [0, -1],
        handZ: 0.24,
        elbowFlare: 0.06 * d,
      };
    },
  },

  // ---- Parallel bars ----------------------------------------------------
  dip: {
    name: 'Dip',
    tempo: [0.4, 0.06, 0.36, 0.18],
    phases: ['Lowering', 'Upper arms parallel', 'Pressing up', 'Lockout'],
    camera: { target: [0, 1.2, 0], radius: 4.6 },
    props: ['dipBars'],
    pose(d) {
      const shoulders: Vec2 = [lerp(0.02, 0.1, d), lerp(1.3, 0.99, d)];
      const lean = lerp(4, 16, d) * DEG;
      const pelvis: Vec2 = [
        shoulders[0] + BODY.spine * Math.sin(lean),
        shoulders[1] - BODY.spine * Math.cos(lean),
      ];
      const ankle: Vec2 = [pelvis[0] - 0.22, pelvis[1] - 0.6];
      return {
        pelvis,
        shoulders,
        headAngle: -2 * DEG,
        ankle,
        toe: [ankle[0] - 0.04, ankle[1] - 0.13],
        kneePole: [1, 0],
        footZ: 0.08,
        kneeOut: 0,
        hand: [0, 1.0],
        elbowPole: [-1, 0],
        handZ: 0.3,
        elbowFlare: 0.04 + 0.06 * d,
      };
    },
  },

  'support-hold': {
    name: 'Support hold',
    tempo: [0.45, 0.05, 0.45, 0.05],
    phases: ['Settling', 'Holding', 'Shoulders down', 'Holding'],
    repSeconds: 6,
    camera: { target: [0, 1.2, 0], radius: 4.6 },
    props: ['dipBars'],
    pose(d) {
      const shoulders: Vec2 = [0.02, lerp(1.32, 1.28, d)];
      const pelvis: Vec2 = [shoulders[0] + 0.02, shoulders[1] - BODY.spine];
      const ankle: Vec2 = [pelvis[0] - 0.2, pelvis[1] - 0.62];
      return {
        pelvis,
        shoulders,
        headAngle: -2 * DEG,
        ankle,
        toe: [ankle[0] - 0.04, ankle[1] - 0.13],
        kneePole: [1, 0],
        footZ: 0.08,
        kneeOut: 0,
        hand: [0, 1.0],
        elbowPole: [-1, 0],
        handZ: 0.3,
        elbowFlare: 0.03,
      };
    },
  },

  'tuck-l-sit': {
    name: 'Tuck L-sit',
    tempo: [0.36, 0.14, 0.34, 0.16],
    phases: [
      'Lifting the knees',
      'Holding the tuck',
      'Lowering',
      'Support hold',
    ],
    camera: { target: [0.1, 1.15, 0], radius: 4.6 },
    props: ['dipBars'],
    pose(d) {
      const shoulders: Vec2 = [0.02, 1.3];
      const pelvis: Vec2 = [shoulders[0] + 0.02, shoulders[1] - BODY.spine];
      const ankle: Vec2 = [
        lerp(pelvis[0] - 0.2, pelvis[0] + 0.3, d),
        lerp(pelvis[1] - 0.62, pelvis[1] - 0.02, d),
      ];
      return {
        pelvis,
        shoulders,
        headAngle: -2 * DEG,
        ankle,
        toe: [ankle[0] + 0.1, ankle[1] - 0.08],
        kneePole: [1, -0.2],
        footZ: 0.09,
        kneeOut: 0,
        hand: [0, 1.0],
        elbowPole: [-1, 0],
        handZ: 0.3,
        elbowFlare: 0.03,
      };
    },
  },

  // ---- On the floor, face down -----------------------------------------
  plank: {
    name: 'Plank',
    tempo: [0.45, 0.05, 0.45, 0.05],
    phases: ['Bracing', 'Holding', 'Bracing', 'Holding'],
    repSeconds: 6,
    camera: { target: [0.7, 0.35, 0], radius: 4.2 },
    props: [],
    pose(d) {
      // On the forearms: the shoulder sits just above the planted elbow.
      const line = rigidLine([0, 0.04], lerp(0.43, 0.45, d), 1.54);
      return {
        pelvis: line.at(1.02),
        shoulders: line.at(1.54),
        headAngle: 90 * DEG - line.th - 12 * DEG,
        ankle: line.at(0.14),
        toe: [0, 0.04],
        kneePole: [0, 1],
        footZ: 0.09,
        kneeOut: 0,
        hand: [1.44, 0.05],
        elbowPole: [-1, 0.2],
        handZ: 0.17,
        elbowFlare: 0.02,
      };
    },
  },

  'prone-press-up': {
    name: 'Prone press-up',
    tempo: [0.3, 0.16, 0.36, 0.18],
    phases: [
      'Pressing the chest up',
      'Top, hips down',
      'Lowering',
      'Face down',
    ],
    camera: { target: [0.75, 0.3, 0], radius: 4.0 },
    props: [],
    pose(d) {
      // Hips stay on the floor throughout; only the chest rises.
      const pelvis: Vec2 = [0.52, 0.12];
      const lean = lerp(88, 42, d) * DEG;
      const shoulders: Vec2 = [
        pelvis[0] + BODY.spine * Math.sin(lean),
        pelvis[1] + BODY.spine * Math.cos(lean),
      ];
      return {
        pelvis,
        shoulders,
        headAngle: lerp(84, 28, d) * DEG,
        ankle: [pelvis[0] - 0.84, 0.07],
        toe: [pelvis[0] - 0.95, 0.05],
        kneePole: [0, 1],
        footZ: 0.1,
        kneeOut: 0,
        hand: [shoulders[0] + 0.1, 0.05],
        elbowPole: [1, 0.2],
        handZ: 0.22,
        elbowFlare: 0.03,
      };
    },
  },

  'bird-dog': {
    name: 'Bird dog',
    tempo: [0.34, 0.16, 0.34, 0.16],
    phases: ['Reaching out', 'Holding', 'Returning', 'On all fours'],
    camera: { target: [0.35, 0.5, 0], radius: 4.2 },
    props: [],
    pose(d) {
      // Back flat like a table; opposite arm and leg reach long, not high.
      const pelvis: Vec2 = [0, 0.62];
      const shoulders: Vec2 = [pelvis[0] + BODY.spine, pelvis[1] + 0.02];
      const ankle: Vec2 = [
        lerp(pelvis[0] - 0.08, pelvis[0] - 0.84, d),
        lerp(0.1, 0.66, d),
      ];
      return {
        pelvis,
        shoulders,
        headAngle: 78 * DEG,
        ankle,
        toe: [ankle[0] - 0.08, ankle[1] - 0.06 * (1 - d) + 0.02 * d],
        kneePole: [0, -1],
        footZ: 0.11,
        kneeOut: 0,
        // The supporting knee and hand stay planted on the floor.
        ankleFar: [pelvis[0] - 0.08, 0.1],
        toeFar: [pelvis[0] - 0.16, 0.05],
        kneePoleFar: [0, -1],
        hand: [
          lerp(shoulders[0] + 0.06, shoulders[0] + 0.5, d),
          lerp(0.06, 0.66, d),
        ],
        elbowPole: [1, -0.4],
        handZ: 0.19,
        elbowFlare: 0.02,
        handFar: [shoulders[0] + 0.06, 0.06],
        elbowPoleFar: [1, -0.4],
      };
    },
  },

  // ---- On the floor, face up -------------------------------------------
  'glute-bridge': {
    name: 'Glute bridge',
    tempo: [0.32, 0.16, 0.34, 0.18],
    phases: [
      'Driving the hips up',
      'Top, glutes squeezed',
      'Lowering',
      'Hips down',
    ],
    camera: { target: [0.3, 0.35, 0], radius: 3.9 },
    props: [],
    pose(d) {
      const pelvis: Vec2 = [lerp(0, -0.02, d), lerp(0.14, 0.44, d)];
      // Shoulders stay planted while the hips rise, so the body forms a line.
      const shoulders: Vec2 = [pelvis[0] + 0.5, lerp(0.16, 0.2, d)];
      return {
        pelvis,
        shoulders,
        headAngle: 96 * DEG,
        ankle: [pelvis[0] - 0.5, 0.08],
        toe: [pelvis[0] - 0.62, 0.05],
        kneePole: [1, 0.2],
        footZ: 0.13,
        kneeOut: 0,
        hand: [shoulders[0] + 0.1, 0.06],
        elbowPole: [0, -1],
        handZ: 0.26,
        elbowFlare: 0,
      };
    },
  },

  'dead-bug-heel-taps': {
    name: 'Dead bug, heel taps',
    tempo: [0.34, 0.08, 0.36, 0.22],
    phases: ['Lowering the heel', 'Tap', 'Returning', 'Knees over the hips'],
    camera: { target: [0.3, 0.35, 0], radius: 3.9 },
    props: [],
    pose(d) {
      const pelvis = SUPINE_PELVIS;
      // Knee stays bent and over the hip; only the heel drops toward the floor.
      const ankle: Vec2 = [
        lerp(pelvis[0] - 0.42, pelvis[0] - 0.5, d),
        lerp(0.57, 0.14, d),
      ];
      return {
        pelvis,
        shoulders: supineShoulders,
        headAngle: 92 * DEG,
        ankle,
        toe: [ankle[0] - 0.1, ankle[1] - 0.03],
        kneePole: [1, 0.6],
        footZ: 0.12,
        kneeOut: 0,
        // The other knee holds its position over the hip.
        ankleFar: [pelvis[0] - 0.42, 0.57],
        toeFar: [pelvis[0] - 0.52, 0.54],
        kneePoleFar: [1, 0.6],
        hand: [supineShoulders[0] + 0.08, 0.52],
        elbowPole: [0, -1],
        handZ: 0.2,
        elbowFlare: 0,
      };
    },
  },

  'single-straight-leg-lowering': {
    name: 'Single straight-leg lowering',
    tempo: [0.44, 0.06, 0.32, 0.18],
    phases: [
      'Lowering the leg',
      'Just above the floor',
      'Raising',
      'At 30 degrees',
    ],
    camera: { target: [0.25, 0.3, 0], radius: 3.9 },
    props: [],
    pose(d) {
      const pelvis = SUPINE_PELVIS;
      // Working leg stays straight: the ankle swings on a fixed radius.
      const angle = lerp(58, 4, d) * DEG;
      const reach = 0.86;
      const ankle: Vec2 = [
        pelvis[0] - reach * Math.cos(angle),
        pelvis[1] + reach * Math.sin(angle),
      ];
      return {
        pelvis,
        shoulders: supineShoulders,
        headAngle: 92 * DEG,
        ankle,
        toe: [ankle[0] - 0.09, ankle[1] + 0.04],
        kneePole: [1, 0.3],
        footZ: 0.11,
        kneeOut: 0,
        // The other knee stays bent with the foot planted, which is what
        // protects the back on this rung.
        ankleFar: [pelvis[0] - 0.46, 0.08],
        toeFar: [pelvis[0] - 0.58, 0.05],
        kneePoleFar: [1, 0.4],
        hand: [supineShoulders[0] + 0.08, 0.52],
        elbowPole: [0, -1],
        handZ: 0.2,
        elbowFlare: 0,
      };
    },
  },

  'lying-straight-leg-raise': {
    name: 'Lying straight leg raise',
    tempo: [0.42, 0.06, 0.34, 0.18],
    phases: ['Lowering', 'Heels near the floor', 'Raising', 'Legs vertical'],
    camera: { target: [0.25, 0.4, 0], radius: 4.1 },
    props: [],
    pose(d) {
      const pelvis = SUPINE_PELVIS;
      const angle = lerp(86, 5, d) * DEG;
      const reach = 0.86;
      const ankle: Vec2 = [
        pelvis[0] - reach * Math.cos(angle),
        pelvis[1] + reach * Math.sin(angle),
      ];
      return {
        pelvis,
        shoulders: supineShoulders,
        headAngle: 92 * DEG,
        ankle,
        toe: [ankle[0] - 0.09, ankle[1] + 0.04],
        kneePole: [1, 0.3],
        footZ: 0.1,
        kneeOut: 0,
        hand: [supineShoulders[0] + 0.08, 0.52],
        elbowPole: [0, -1],
        handZ: 0.2,
        elbowFlare: 0,
      };
    },
  },

  // ---- Standing ---------------------------------------------------------
  'wall-hinge': {
    name: 'Wall hinge',
    tempo: [0.4, 0.07, 0.33, 0.2],
    phases: [
      'Hips travelling back',
      'Touching the wall',
      'Standing up',
      'Tall',
    ],
    camera: { target: [-0.1, 0.85, 0], radius: 4.3 },
    props: [],
    pose(d) {
      const pelvis: Vec2 = [-0.42 * d, lerp(0.94, 0.86, d)];
      const lean = lerp(4, 48, d) * DEG;
      const shoulders = shouldersFrom(pelvis, lean);
      return {
        pelvis,
        shoulders,
        headAngle: lean * 0.5,
        ankle: [0, 0.08],
        toe: [0.2, 0.045],
        kneePole: [1, 0],
        footZ: 0.12,
        kneeOut: 0,
        hand: [shoulders[0] + 0.26, shoulders[1] - 0.3],
        elbowPole: [0, -1],
        handZ: 0.2,
        elbowFlare: 0,
      };
    },
  },

  'split-squat': {
    name: 'Split squat',
    tempo: [0.4, 0.06, 0.34, 0.2],
    phases: ['Lowering straight down', 'Bottom', 'Driving up', 'Tall'],
    camera: { target: [0, 0.8, 0], radius: 4.3 },
    props: [],
    pose(d) {
      const pelvis: Vec2 = [-0.08 * d, lerp(0.94, 0.62, d)];
      const lean = (6 + 10 * d) * DEG;
      const shoulders = shouldersFrom(pelvis, lean);
      return {
        pelvis,
        shoulders,
        headAngle: lean * 0.4,
        ankle: [0.24, 0.08],
        toe: [0.42, 0.045],
        kneePole: [1, 0],
        footZ: 0.14,
        kneeOut: 0,
        // Rear leg trails behind, heel lifted.
        ankleFar: [-0.46, lerp(0.14, 0.1, d)],
        toeFar: [-0.3, 0.045],
        kneePoleFar: [1, 0],
        hand: [shoulders[0] + 0.16, shoulders[1] - 0.42],
        elbowPole: [0, -1],
        handZ: 0.2,
        elbowFlare: 0,
      };
    },
  },

  'calf-raise': {
    name: 'Calf raise',
    tempo: [0.3, 0.12, 0.38, 0.2],
    phases: ['Rising onto the toes', 'Top', 'Lowering', 'Heels down'],
    camera: { target: [0, 0.8, 0], radius: 4.0 },
    props: [],
    pose(d) {
      const pelvis: Vec2 = [0, lerp(0.94, 1.02, d)];
      const lean = 4 * DEG;
      const shoulders = shouldersFrom(pelvis, lean);
      return {
        pelvis,
        shoulders,
        headAngle: 2 * DEG,
        ankle: [0, lerp(0.08, 0.17, d)],
        toe: [0.2, 0.045],
        kneePole: [1, 0],
        footZ: 0.11,
        kneeOut: 0,
        hand: [shoulders[0] + 0.1, shoulders[1] - 0.5],
        elbowPole: [0, -1],
        handZ: 0.21,
        elbowFlare: 0,
      };
    },
  },
};

/** Fallback pose when something asks for depth outside a definition. */
export function safePose(def: ExerciseDef, d: number): ExercisePose {
  return def.pose(Math.min(1, Math.max(0, d)));
}

export function exerciseFor(movementId: string): ExerciseDef | null {
  return EXERCISES[movementId] ?? null;
}
