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

/** Arms down by the sides, palms on the floor. */
const SUPINE_HAND: Vec2 = [supineShoulders[0] - 0.48, 0.07];

export const EXERCISES: Record<string, ExerciseDef> = {
  // ---- Ported from the reference set ------------------------------------
  'box-squat': {
    name: 'Box squat to parallel',
    tempo: [0.4, 0.07, 0.31, 0.22],
    phases: ['Sitting back', 'Tap the box', 'Driving up', 'Standing tall'],
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
        hand: SUPINE_HAND,
        elbowPole: [0, 1],
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
        hand: SUPINE_HAND,
        elbowPole: [0, 1],
        handZ: 0.2,
        elbowFlare: 0,
      };
    },
  },

  'lying-straight-leg-raise': {
    name: 'Lying straight leg raise',
    tempo: [0.42, 0.06, 0.34, 0.18],
    phases: ['Lowering', 'Heels near the floor', 'Raising', 'Legs vertical'],
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
        hand: SUPINE_HAND,
        elbowPole: [0, 1],
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

  // ---- Ladder L: the rest of the lying progressions ---------------------
  'dead-bug-heel-slide': {
    name: 'Dead bug, heel slide',
    tempo: [0.4, 0.06, 0.34, 0.2],
    phases: [
      'Sliding the leg out',
      'Just above the floor',
      'Returning',
      'Knee over the hip',
    ],
    props: [],
    pose(d) {
      const pelvis = SUPINE_PELVIS;
      // The leg straightens as it lowers, so the lever grows through the rep.
      const reach = lerp(0.52, 0.86, d);
      const angle = lerp(72, 6, d) * DEG;
      const ankle: Vec2 = [
        pelvis[0] - reach * Math.cos(angle),
        pelvis[1] + reach * Math.sin(angle),
      ];
      return {
        pelvis,
        shoulders: supineShoulders,
        headAngle: 92 * DEG,
        ankle,
        toe: [ankle[0] - 0.1, ankle[1] + 0.02],
        kneePole: [1, 0.5],
        footZ: 0.12,
        ankleFar: [pelvis[0] - 0.42, 0.57],
        toeFar: [pelvis[0] - 0.52, 0.54],
        kneePoleFar: [1, 0.6],
        hand: SUPINE_HAND,
        elbowPole: [0, 1],
        handZ: 0.2,
      };
    },
  },

  'lying-knee-march': {
    name: 'Lying knee march',
    tempo: [0.34, 0.08, 0.36, 0.22],
    phases: ['Knee to the chest', 'Top', 'Foot back down', 'Both feet planted'],
    props: [],
    pose(d) {
      const pelvis = SUPINE_PELVIS;
      const ankle: Vec2 = [
        lerp(pelvis[0] - 0.46, pelvis[0] - 0.3, d),
        lerp(0.08, 0.46, d),
      ];
      return {
        pelvis,
        shoulders: supineShoulders,
        headAngle: 92 * DEG,
        ankle,
        toe: [ankle[0] - 0.11, ankle[1] - 0.02],
        kneePole: [1, 0.5],
        footZ: 0.12,
        ankleFar: [pelvis[0] - 0.46, 0.08],
        toeFar: [pelvis[0] - 0.58, 0.05],
        kneePoleFar: [1, 0.4],
        hand: SUPINE_HAND,
        elbowPole: [0, 1],
        handZ: 0.2,
      };
    },
  },

  'double-knee-raise': {
    name: 'Double knee raise to table-top',
    tempo: [0.3, 0.08, 0.42, 0.2],
    phases: ['Knees up', 'Table-top', 'Lowering slowly', 'Feet down'],
    props: [],
    pose(d) {
      const pelvis = SUPINE_PELVIS;
      const ankle: Vec2 = [
        lerp(pelvis[0] - 0.5, pelvis[0] - 0.42, d),
        lerp(0.12, 0.57, d),
      ];
      return {
        pelvis,
        shoulders: supineShoulders,
        headAngle: 92 * DEG,
        ankle,
        toe: [ankle[0] - 0.11, ankle[1] - 0.02],
        kneePole: [1, 0.6],
        footZ: 0.12,
        hand: SUPINE_HAND,
        elbowPole: [0, 1],
        handZ: 0.2,
      };
    },
  },

  'double-leg-lowering': {
    name: 'Double leg lowering',
    tempo: [0.44, 0.06, 0.32, 0.18],
    phases: ['Lowering both legs', 'Low point', 'Raising', 'At 60 degrees'],
    props: [],
    pose(d) {
      const pelvis = SUPINE_PELVIS;
      const angle = lerp(62, 10, d) * DEG;
      const reach = 0.84;
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
        kneePole: [1, 0.35],
        footZ: 0.11,
        hand: SUPINE_HAND,
        elbowPole: [0, 1],
        handZ: 0.2,
      };
    },
  },

  'single-leg-hip-thrust': {
    name: 'Single-leg hip thrust',
    tempo: [0.32, 0.16, 0.34, 0.18],
    phases: ['Driving the hips up', 'Top', 'Lowering', 'Hips down'],
    props: ['box'],
    pose(d) {
      const pelvis: Vec2 = [0, lerp(0.3, 0.56, d)];
      const shoulders: Vec2 = [pelvis[0] + 0.5, 0.5];
      return {
        pelvis,
        shoulders,
        headAngle: 92 * DEG,
        ankle: [pelvis[0] - 0.5, 0.08],
        toe: [pelvis[0] - 0.62, 0.05],
        kneePole: [1, 0.2],
        footZ: 0.12,
        // The free leg stays lifted and straight.
        ankleFar: [pelvis[0] - 0.56, lerp(0.5, 0.74, d)],
        toeFar: [pelvis[0] - 0.66, lerp(0.56, 0.8, d)],
        kneePoleFar: [1, 0.3],
        hand: [shoulders[0] + 0.1, 0.42],
        elbowPole: [0, -1],
        handZ: 0.26,
      };
    },
  },

  'slider-hamstring-curl': {
    name: 'Slider hamstring curl',
    tempo: [0.4, 0.06, 0.36, 0.18],
    phases: [
      'Heels sliding out',
      'Legs long',
      'Pulling the heels in',
      'Hips up',
    ],
    props: [],
    pose(d) {
      const pelvis: Vec2 = [0, lerp(0.42, 0.3, d)];
      const shoulders: Vec2 = [pelvis[0] + 0.5, 0.18];
      return {
        pelvis,
        shoulders,
        headAngle: 94 * DEG,
        ankle: [lerp(pelvis[0] - 0.46, pelvis[0] - 0.84, d), 0.07],
        toe: [lerp(pelvis[0] - 0.58, pelvis[0] - 0.96, d), 0.05],
        kneePole: [1, 0.3],
        footZ: 0.12,
        hand: [shoulders[0] + 0.1, 0.06],
        elbowPole: [0, -1],
        handZ: 0.26,
      };
    },
  },

  // ---- Hanging ----------------------------------------------------------
  'scapular-pulls': {
    name: 'Scapular pulls',
    tempo: [0.3, 0.12, 0.38, 0.2],
    phases: ['Shoulders down', 'Top of the pull', 'Letting go', 'Relaxed hang'],
    props: ['pullupRig'],
    pose(d) {
      // Arms stay straight: only the shoulder girdle travels.
      const shoulders: Vec2 = [-0.02, lerp(1.63, 1.74, d)];
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
        hand: [0, 2.2],
        elbowPole: [0.3, -1],
        handZ: 0.22,
      };
    },
  },

  'hang-knees-lifted': {
    name: 'Hang, knees lifted slightly',
    tempo: [0.3, 0.2, 0.3, 0.2],
    phases: ['Lifting the knees', 'Holding', 'Lowering', 'Dead hang'],
    props: ['pullupRig'],
    pose(d) {
      const shoulders: Vec2 = [-0.02, 1.66];
      const pelvis: Vec2 = [shoulders[0], shoulders[1] - BODY.spine];
      const ankle: Vec2 = [
        lerp(pelvis[0] - 0.02, pelvis[0] + 0.1, d),
        lerp(pelvis[1] - 0.84, pelvis[1] - 0.52, d),
      ];
      return {
        pelvis,
        shoulders,
        headAngle: -4 * DEG,
        ankle,
        toe: [ankle[0] + 0.08, ankle[1] - 0.1],
        kneePole: [1, -0.2],
        footZ: 0.08,
        hand: [0, 2.2],
        elbowPole: [0.3, -1],
        handZ: 0.22,
      };
    },
  },

  'hanging-straight-leg-raise': {
    name: 'Hanging straight leg raise',
    tempo: [0.32, 0.08, 0.4, 0.2],
    phases: ['Raising to 90', 'Horizontal', 'Lowering', 'Dead hang'],
    props: ['pullupRig'],
    pose(d) {
      const shoulders: Vec2 = [-0.02, 1.66];
      const pelvis: Vec2 = [shoulders[0], shoulders[1] - BODY.spine];
      const angle = lerp(-88, 0, d) * DEG;
      const reach = 0.86;
      const ankle: Vec2 = [
        pelvis[0] + reach * Math.cos(angle),
        pelvis[1] + reach * Math.sin(angle),
      ];
      return {
        pelvis,
        shoulders,
        headAngle: -4 * DEG,
        ankle,
        toe: [ankle[0] + 0.1, ankle[1] - 0.02],
        kneePole: [1, -0.2],
        footZ: 0.08,
        hand: [0, 2.2],
        elbowPole: [0.3, -1],
        handZ: 0.22,
      };
    },
  },

  'hanging-one-leg-raise': {
    name: 'Hanging raise, one leg straight',
    tempo: [0.34, 0.08, 0.38, 0.2],
    phases: ['Raising', 'Top', 'Lowering', 'Dead hang'],
    props: ['pullupRig'],
    pose(d) {
      const shoulders: Vec2 = [-0.02, 1.66];
      const pelvis: Vec2 = [shoulders[0], shoulders[1] - BODY.spine];
      const angle = lerp(-88, -6, d) * DEG;
      const ankle: Vec2 = [
        pelvis[0] + 0.86 * Math.cos(angle),
        pelvis[1] + 0.86 * Math.sin(angle),
      ];
      return {
        pelvis,
        shoulders,
        headAngle: -4 * DEG,
        ankle,
        toe: [ankle[0] + 0.1, ankle[1] - 0.02],
        kneePole: [1, -0.2],
        footZ: 0.08,
        // The other leg stays bent and hanging.
        ankleFar: [pelvis[0] + 0.14, pelvis[1] - 0.56],
        toeFar: [pelvis[0] + 0.24, pelvis[1] - 0.64],
        kneePoleFar: [1, -0.2],
        hand: [0, 2.2],
        elbowPole: [0.3, -1],
        handZ: 0.22,
      };
    },
  },

  'toes-to-bar': {
    name: 'Toes to bar',
    tempo: [0.32, 0.06, 0.42, 0.2],
    phases: ['Driving the toes up', 'Toes to the bar', 'Lowering', 'Dead hang'],
    props: ['pullupRig'],
    pose(d) {
      const shoulders: Vec2 = [lerp(-0.02, -0.16, d), 1.66];
      const pelvis: Vec2 = [shoulders[0] + 0.04 * d, shoulders[1] - BODY.spine];
      const angle = lerp(-88, 56, d) * DEG;
      const ankle: Vec2 = [
        pelvis[0] + 0.86 * Math.cos(angle),
        pelvis[1] + 0.86 * Math.sin(angle),
      ];
      return {
        pelvis,
        shoulders,
        headAngle: -8 * DEG,
        ankle,
        toe: [ankle[0] + 0.06, ankle[1] + 0.08 * d],
        kneePole: [1, -0.2],
        footZ: 0.08,
        hand: [0, 2.2],
        elbowPole: [0.3, -1],
        handZ: 0.22,
      };
    },
  },

  'chest-to-bar-pull-up': {
    name: 'Chest-to-bar pull-up',
    tempo: [0.26, 0.07, 0.47, 0.2],
    phases: ['Pulling hard', 'Chest to the bar', 'Lowering', 'Dead hang'],
    props: ['pullupRig'],
    pose(d) {
      const shoulders: Vec2 = [lerp(-0.04, -0.26, d), lerp(1.64, 2.12, d)];
      const lean = lerp(4, 28, d) * DEG;
      const pelvis: Vec2 = [
        shoulders[0] + BODY.spine * Math.sin(lean),
        shoulders[1] - BODY.spine * Math.cos(lean),
      ];
      const ankle: Vec2 = [pelvis[0] - 0.2 - 0.14 * d, pelvis[1] - 0.72];
      return {
        pelvis,
        shoulders,
        headAngle: -8 * DEG,
        ankle,
        toe: [ankle[0] - 0.05, ankle[1] - 0.13],
        kneePole: [1, 0],
        footZ: 0.06,
        hand: [0, 2.2],
        elbowPole: [0.3, -1],
        handZ: 0.24,
        elbowFlare: 0.05,
      };
    },
  },

  'muscle-up': {
    name: 'Muscle-up',
    tempo: [0.34, 0.1, 0.36, 0.2],
    phases: [
      'Explosive pull',
      'Transition over the bar',
      'Lowering',
      'Dead hang',
    ],
    props: ['pullupRig'],
    pose(d) {
      // Shoulders rise past the bar and the body leans over it.
      const shoulders: Vec2 = [lerp(-0.04, 0.2, d), lerp(1.64, 2.34, d)];
      const lean = lerp(4, -26, d) * DEG;
      const pelvis: Vec2 = [
        shoulders[0] + BODY.spine * Math.sin(lean),
        shoulders[1] - BODY.spine * Math.cos(lean),
      ];
      const ankle: Vec2 = [pelvis[0] - 0.18, pelvis[1] - 0.76];
      return {
        pelvis,
        shoulders,
        headAngle: lerp(-8, 10, d) * DEG,
        ankle,
        toe: [ankle[0] - 0.05, ankle[1] - 0.13],
        kneePole: [1, 0],
        footZ: 0.07,
        hand: [0, 2.2],
        elbowPole: [lerp(0.3, -1, d), -1],
        handZ: 0.23,
        elbowFlare: 0.06 * d,
      };
    },
  },

  'tuck-front-lever': {
    name: 'Tuck front lever',
    tempo: [0.34, 0.18, 0.3, 0.18],
    phases: ['Pulling to horizontal', 'Holding', 'Lowering', 'Dead hang'],
    props: ['pullupRig'],
    pose(d) {
      // Body rotates up to horizontal under the bar; arms stay straight.
      const lean = lerp(-90, -4, d) * DEG;
      const shoulders: Vec2 = [lerp(-0.02, -0.26, d), lerp(1.66, 1.82, d)];
      const pelvis: Vec2 = [
        shoulders[0] - BODY.spine * Math.cos(lean + Math.PI / 2),
        shoulders[1] - BODY.spine * Math.sin(lean + Math.PI / 2),
      ];
      return {
        pelvis,
        shoulders,
        headAngle: lerp(-4, -70, d) * DEG,
        ankle: [pelvis[0] - 0.28, pelvis[1] + lerp(-0.76, 0.1, d)],
        toe: [pelvis[0] - 0.4, pelvis[1] + lerp(-0.86, 0.12, d)],
        kneePole: [-1, 0.2],
        footZ: 0.09,
        hand: [0, 2.2],
        elbowPole: [0.3, -1],
        handZ: 0.24,
      };
    },
  },

  'back-lever': {
    name: 'Back lever',
    tempo: [0.36, 0.18, 0.28, 0.18],
    phases: ['Rotating down', 'Holding horizontal', 'Returning', 'German hang'],
    props: ['pullupRig'],
    pose(d) {
      const shoulders: Vec2 = [lerp(0.04, 0.3, d), lerp(1.74, 1.9, d)];
      const lean = lerp(100, 184, d) * DEG;
      const pelvis: Vec2 = [
        shoulders[0] + BODY.spine * Math.sin(lean),
        shoulders[1] + BODY.spine * Math.cos(lean),
      ];
      return {
        pelvis,
        shoulders,
        headAngle: lerp(60, 150, d) * DEG,
        ankle: [
          pelvis[0] + lerp(0.1, 0.84, d),
          pelvis[1] + lerp(-0.8, 0.04, d),
        ],
        toe: [pelvis[0] + lerp(0.16, 0.96, d), pelvis[1] + lerp(-0.9, 0.06, d)],
        kneePole: [1, 0.2],
        footZ: 0.09,
        hand: [0, 2.2],
        elbowPole: [-0.3, -1],
        handZ: 0.24,
      };
    },
  },

  // ---- Parallel bars ----------------------------------------------------
  'one-leg-tuck-l-sit': {
    name: 'Tuck L-sit, one leg extended',
    tempo: [0.3, 0.22, 0.28, 0.2],
    phases: ['Extending the leg', 'Holding', 'Tucking back', 'Tuck L-sit'],
    props: ['dipBars'],
    pose(d) {
      const shoulders: Vec2 = [0.02, 1.3];
      const pelvis: Vec2 = [shoulders[0] + 0.02, shoulders[1] - BODY.spine];
      return {
        pelvis,
        shoulders,
        headAngle: -2 * DEG,
        ankle: [
          lerp(pelvis[0] + 0.3, pelvis[0] + 0.84, d),
          lerp(pelvis[1] - 0.02, pelvis[1], d),
        ],
        toe: [lerp(pelvis[0] + 0.4, pelvis[0] + 0.94, d), pelvis[1] - 0.04],
        kneePole: [1, -0.3],
        footZ: 0.09,
        ankleFar: [pelvis[0] + 0.3, pelvis[1] - 0.02],
        toeFar: [pelvis[0] + 0.4, pelvis[1] - 0.08],
        kneePoleFar: [1, -0.2],
        hand: [0, 1.0],
        elbowPole: [-1, 0],
        handZ: 0.3,
      };
    },
  },

  'l-sit': {
    name: 'Full L-sit',
    tempo: [0.3, 0.22, 0.28, 0.2],
    phases: ['Legs out straight', 'Holding the L', 'Lowering', 'Tuck'],
    props: ['dipBars'],
    pose(d) {
      const shoulders: Vec2 = [0.02, 1.3];
      const pelvis: Vec2 = [shoulders[0] + 0.02, shoulders[1] - BODY.spine];
      return {
        pelvis,
        shoulders,
        headAngle: -2 * DEG,
        ankle: [
          lerp(pelvis[0] + 0.3, pelvis[0] + 0.86, d),
          lerp(pelvis[1] - 0.04, pelvis[1] + 0.02, d),
        ],
        toe: [lerp(pelvis[0] + 0.4, pelvis[0] + 0.96, d), pelvis[1] - 0.02],
        kneePole: [1, -0.3],
        footZ: 0.09,
        hand: [0, 1.0],
        elbowPole: [-1, 0],
        handZ: 0.3,
      };
    },
  },

  'v-sit': {
    name: 'V-sit',
    tempo: [0.32, 0.2, 0.28, 0.2],
    phases: ['Lifting into the V', 'Holding', 'Lowering', 'L-sit'],
    props: ['dipBars'],
    pose(d) {
      const shoulders: Vec2 = [lerp(0.02, -0.1, d), 1.3];
      const pelvis: Vec2 = [shoulders[0] + 0.02, shoulders[1] - BODY.spine];
      const angle = lerp(2, 38, d) * DEG;
      return {
        pelvis,
        shoulders,
        headAngle: -2 * DEG,
        ankle: [
          pelvis[0] + 0.86 * Math.cos(angle),
          pelvis[1] + 0.86 * Math.sin(angle),
        ],
        toe: [
          pelvis[0] + 0.96 * Math.cos(angle),
          pelvis[1] + 0.96 * Math.sin(angle),
        ],
        kneePole: [1, -0.3],
        footZ: 0.09,
        hand: [0, 1.0],
        elbowPole: [-1, 0],
        handZ: 0.3,
      };
    },
  },

  // ---- Floor, face down --------------------------------------------------
  'prone-on-elbows': {
    name: 'Prone on elbows',
    tempo: [0.3, 0.2, 0.3, 0.2],
    phases: ['Propping up', 'Hips heavy', 'Lowering', 'Face down'],
    repSeconds: 6,
    props: [],
    pose(d) {
      const pelvis: Vec2 = [0.52, 0.12];
      const lean = lerp(88, 62, d) * DEG;
      const shoulders: Vec2 = [
        pelvis[0] + BODY.spine * Math.sin(lean),
        pelvis[1] + BODY.spine * Math.cos(lean),
      ];
      return {
        pelvis,
        shoulders,
        headAngle: lerp(84, 50, d) * DEG,
        ankle: [pelvis[0] - 0.84, 0.07],
        toe: [pelvis[0] - 0.95, 0.05],
        kneePole: [0, 1],
        footZ: 0.1,
        hand: [shoulders[0] + 0.3, 0.06],
        elbowPole: [1, 0.3],
        handZ: 0.18,
      };
    },
  },

  'cobra-hold': {
    name: 'Cobra hold',
    tempo: [0.28, 0.24, 0.28, 0.2],
    phases: ['Lifting', 'Holding', 'Lowering', 'Flat'],
    repSeconds: 6,
    props: [],
    pose(d) {
      const pelvis: Vec2 = [0.52, 0.11];
      const lean = lerp(90, 66, d) * DEG;
      const shoulders: Vec2 = [
        pelvis[0] + BODY.spine * Math.sin(lean),
        pelvis[1] + BODY.spine * Math.cos(lean),
      ];
      return {
        pelvis,
        shoulders,
        headAngle: lerp(86, 54, d) * DEG,
        // Legs lift clear of the floor as the chest comes up.
        ankle: [pelvis[0] - 0.84, lerp(0.07, 0.2, d)],
        toe: [pelvis[0] - 0.95, lerp(0.05, 0.22, d)],
        kneePole: [0, 1],
        footZ: 0.11,
        // Arms stay back along the body, off the floor.
        hand: [shoulders[0] - 0.5, lerp(0.07, 0.22, d)],
        elbowPole: [0, -1],
        handZ: 0.22,
      };
    },
  },

  'prone-y-t-raise': {
    name: 'Prone Y and T raises',
    tempo: [0.3, 0.18, 0.32, 0.2],
    phases: ['Lifting the arms', 'Top', 'Lowering', 'Arms down'],
    props: [],
    pose(d) {
      const pelvis: Vec2 = [0.52, 0.11];
      const shoulders: Vec2 = [pelvis[0] + 0.5, 0.15];
      return {
        pelvis,
        shoulders,
        headAngle: 80 * DEG,
        ankle: [pelvis[0] - 0.84, 0.07],
        toe: [pelvis[0] - 0.95, 0.05],
        kneePole: [0, 1],
        footZ: 0.11,
        hand: [shoulders[0] + 0.44, lerp(0.06, 0.34, d)],
        elbowPole: [0, 1],
        handZ: 0.3,
        elbowFlare: 0.06,
      };
    },
  },

  'side-plank': {
    name: 'Side plank',
    tempo: [0.3, 0.2, 0.3, 0.2],
    phases: ['Hips up', 'Holding', 'Settling', 'Holding'],
    repSeconds: 6,
    props: [],
    pose(d) {
      // Seen from the side, the body is a straight line on one forearm.
      const line = rigidLine([0, 0.05], lerp(0.46, 0.5, d), 1.5);
      return {
        pelvis: line.at(1.0),
        shoulders: line.at(1.5),
        headAngle: 90 * DEG - line.th - 10 * DEG,
        ankle: line.at(0.16),
        toe: [0, 0.05],
        kneePole: [0, 1],
        footZ: 0.05,
        hand: [1.42, 0.06],
        elbowPole: [-1, 0.2],
        handZ: 0.06,
      };
    },
  },

  'scapular-push-up': {
    name: 'Scapular push-up',
    tempo: [0.3, 0.12, 0.36, 0.22],
    phases: ['Pushing away', 'Top', 'Letting the chest sink', 'Neutral'],
    props: [],
    pose(d) {
      // Arms locked: only the shoulder girdle moves, so the body shifts a little.
      const line = rigidLine([0, 0.04], lerp(0.58, 0.63, d), 1.54);
      return {
        pelvis: line.at(1.02),
        shoulders: line.at(1.54),
        headAngle: 90 * DEG - line.th - 14 * DEG,
        ankle: line.at(0.14),
        toe: [0, 0.04],
        kneePole: [0, 1],
        footZ: 0.09,
        hand: [1.44, 0.04],
        elbowPole: [-1, 0.35],
        handZ: 0.21,
      };
    },
  },

  'planche-lean': {
    name: 'Planche lean',
    tempo: [0.34, 0.2, 0.26, 0.2],
    phases: ['Leaning forward', 'Holding the lean', 'Returning', 'Plank'],
    repSeconds: 6,
    props: [],
    pose(d) {
      // Hands stay planted while the shoulders travel well past them.
      const hand: Vec2 = [1.44, 0.04];
      const shoulders: Vec2 = [lerp(1.44, 1.72, d), lerp(0.6, 0.56, d)];
      const th = Math.atan2(shoulders[1] - 0.04, shoulders[0]);
      const pelvis: Vec2 = [
        shoulders[0] - BODY.spine * Math.cos(th),
        shoulders[1] - BODY.spine * Math.sin(th),
      ];
      return {
        pelvis,
        shoulders,
        headAngle: 90 * DEG - th - 14 * DEG,
        ankle: [pelvis[0] - 0.84, 0.06],
        toe: [pelvis[0] - 0.96, 0.04],
        kneePole: [0, 1],
        footZ: 0.09,
        hand,
        elbowPole: [-1, 0.3],
        handZ: 0.22,
      };
    },
  },

  'tuck-planche': {
    name: 'Tuck planche',
    tempo: [0.34, 0.22, 0.24, 0.2],
    phases: ['Leaning and lifting', 'Holding', 'Lowering', 'Feet down'],
    props: [],
    pose(d) {
      const hand: Vec2 = [0, 0.04];
      const shoulders: Vec2 = [lerp(0.04, 0.26, d), lerp(0.56, 0.62, d)];
      const pelvis: Vec2 = [shoulders[0] - 0.5, lerp(0.42, 0.6, d)];
      return {
        pelvis,
        shoulders,
        headAngle: 46 * DEG,
        // Knees tuck to the chest and the feet leave the floor.
        ankle: [pelvis[0] + 0.12, lerp(0.08, 0.5, d)],
        toe: [pelvis[0] + 0.22, lerp(0.05, 0.46, d)],
        kneePole: [-1, -0.4],
        footZ: 0.1,
        hand,
        elbowPole: [-1, 0.2],
        handZ: 0.22,
      };
    },
  },

  'crow-pose': {
    name: 'Crow pose',
    tempo: [0.32, 0.24, 0.24, 0.2],
    phases: ['Leaning in', 'Balancing', 'Coming down', 'Feet on the floor'],
    props: [],
    pose(d) {
      const hand: Vec2 = [0, 0.04];
      const shoulders: Vec2 = [lerp(0.1, 0.24, d), lerp(0.66, 0.74, d)];
      const pelvis: Vec2 = [shoulders[0] - 0.46, lerp(0.5, 0.78, d)];
      return {
        pelvis,
        shoulders,
        headAngle: 54 * DEG,
        // Shins come to rest on the backs of the upper arms.
        ankle: [pelvis[0] - 0.3, lerp(0.1, 0.56, d)],
        toe: [pelvis[0] - 0.42, lerp(0.05, 0.6, d)],
        kneePole: [-1, -0.5],
        footZ: 0.12,
        hand,
        elbowPole: [-1, 0.1],
        handZ: 0.2,
        elbowFlare: 0.05,
      };
    },
  },

  'wall-handstand': {
    name: 'Chest-to-wall handstand',
    tempo: [0.3, 0.2, 0.3, 0.2],
    phases: ['Settling', 'Holding the line', 'Adjusting', 'Holding'],
    repSeconds: 6,
    props: [],
    pose(d) {
      // Inverted: hands on the floor, hips stacked above the shoulders.
      const hand: Vec2 = [0, 0.05];
      const shoulders: Vec2 = [lerp(0.02, 0.0, d), 0.62];
      const pelvis: Vec2 = [shoulders[0] + 0.02, shoulders[1] + BODY.spine];
      return {
        pelvis,
        shoulders,
        headAngle: 176 * DEG,
        ankle: [pelvis[0] + 0.02, pelvis[1] + 0.84],
        toe: [pelvis[0] + 0.04, pelvis[1] + 0.96],
        kneePole: [1, 0],
        footZ: 0.09,
        hand,
        elbowPole: [1, 0],
        handZ: 0.22,
      };
    },
  },

  'wall-hspu': {
    name: 'Wall handstand push-up',
    tempo: [0.42, 0.06, 0.34, 0.18],
    phases: [
      'Lowering the head',
      'Head near the floor',
      'Pressing up',
      'Lockout',
    ],
    props: [],
    pose(d) {
      const hand: Vec2 = [0, 0.05];
      const shoulders: Vec2 = [lerp(0.02, 0.1, d), lerp(0.62, 0.3, d)];
      const pelvis: Vec2 = [shoulders[0] + 0.02, shoulders[1] + BODY.spine];
      return {
        pelvis,
        shoulders,
        headAngle: 176 * DEG,
        ankle: [pelvis[0] + 0.02, pelvis[1] + 0.84],
        toe: [pelvis[0] + 0.04, pelvis[1] + 0.96],
        kneePole: [1, 0],
        footZ: 0.09,
        hand,
        elbowPole: [1, 0],
        handZ: 0.24,
        elbowFlare: 0.08 * d,
      };
    },
  },

  // ---- Standing legs -----------------------------------------------------
  'step-up': {
    name: 'Step-up',
    tempo: [0.36, 0.08, 0.36, 0.2],
    phases: [
      'Driving up',
      'Standing on the box',
      'Lowering',
      'Foot on the box',
    ],
    props: ['box'],
    pose(d) {
      const pelvis: Vec2 = [lerp(-0.1, -0.3, d), lerp(0.84, 1.16, d)];
      const lean = lerp(14, 6, d) * DEG;
      return {
        pelvis,
        shoulders: shouldersFrom(pelvis, lean),
        headAngle: lean * 0.4,
        // The working foot stays planted on the box.
        ankle: [-0.42, 0.5],
        toe: [-0.24, 0.47],
        kneePole: [1, 0],
        footZ: 0.13,
        ankleFar: [lerp(0.1, -0.2, d), lerp(0.08, 0.42, d)],
        toeFar: [lerp(0.28, -0.04, d), lerp(0.045, 0.4, d)],
        kneePoleFar: [1, 0],
        hand: [pelvis[0] + 0.18, pelvis[1] + 0.04],
        elbowPole: [0, -1],
        handZ: 0.2,
      };
    },
  },

  'pistol-squat': {
    name: 'Pistol squat',
    tempo: [0.4, 0.07, 0.33, 0.2],
    phases: ['Lowering on one leg', 'Bottom', 'Driving up', 'Standing'],
    props: [],
    pose(d) {
      const pelvis: Vec2 = [-0.34 * d, lerp(0.94, 0.4, d)];
      const lean = (8 + 40 * d) * DEG;
      const shoulders = shouldersFrom(pelvis, lean);
      return {
        pelvis,
        shoulders,
        headAngle: lean * 0.35,
        ankle: [0, 0.08],
        toe: [0.2, 0.045],
        kneePole: [1, 0],
        footZ: 0.08,
        // The free leg reaches straight out in front.
        ankleFar: [lerp(0.36, 0.82, d), lerp(0.1, 0.44, d)],
        toeFar: [lerp(0.5, 0.94, d), lerp(0.06, 0.48, d)],
        kneePoleFar: [0, -1],
        hand: [shoulders[0] + 0.42, shoulders[1] - 0.06],
        elbowPole: [0, -1],
        handZ: 0.2,
      };
    },
  },

  'shrimp-squat': {
    name: 'Shrimp squat',
    tempo: [0.4, 0.07, 0.33, 0.2],
    phases: ['Lowering', 'Knee near the floor', 'Driving up', 'Standing'],
    props: [],
    pose(d) {
      const pelvis: Vec2 = [-0.2 * d, lerp(0.94, 0.52, d)];
      const lean = (8 + 16 * d) * DEG;
      const shoulders = shouldersFrom(pelvis, lean);
      return {
        pelvis,
        shoulders,
        headAngle: lean * 0.4,
        ankle: [0.04, 0.08],
        toe: [0.24, 0.045],
        kneePole: [1, 0],
        footZ: 0.1,
        // Rear leg held bent behind, knee tracking toward the floor.
        ankleFar: [lerp(-0.4, -0.46, d), lerp(0.42, 0.3, d)],
        toeFar: [lerp(-0.52, -0.58, d), lerp(0.46, 0.32, d)],
        kneePoleFar: [-1, 0],
        hand: [shoulders[0] + 0.36, shoulders[1] - 0.1],
        elbowPole: [0, -1],
        handZ: 0.2,
      };
    },
  },

  'cossack-squat': {
    name: 'Cossack squat',
    tempo: [0.4, 0.08, 0.32, 0.2],
    phases: ['Sitting to one side', 'Bottom', 'Standing up', 'Wide stance'],
    props: [],
    pose(d) {
      const pelvis: Vec2 = [-0.1 * d, lerp(0.9, 0.42, d)];
      const lean = (10 + 24 * d) * DEG;
      const shoulders = shouldersFrom(pelvis, lean);
      return {
        pelvis,
        shoulders,
        headAngle: lean * 0.4,
        ankle: [0.3, 0.08],
        toe: [0.48, 0.045],
        kneePole: [1, 0],
        footZ: 0.3,
        // The far leg stays straight as the near one bends.
        ankleFar: [-0.6, 0.08],
        toeFar: [-0.74, 0.07],
        kneePoleFar: [1, 0],
        hand: [shoulders[0] + 0.4, shoulders[1] - 0.08],
        elbowPole: [0, -1],
        handZ: 0.22,
      };
    },
  },

  'box-jump': {
    name: 'Box jump',
    tempo: [0.3, 0.06, 0.44, 0.2],
    phases: ['Loading', 'Jumping', 'Landing on the box', 'Standing'],
    props: ['box'],
    pose(d) {
      const pelvis: Vec2 = [-0.2 * d, lerp(0.94, 0.66, d)];
      const lean = (8 + 30 * d) * DEG;
      const shoulders = shouldersFrom(pelvis, lean);
      return {
        pelvis,
        shoulders,
        headAngle: lean * 0.35,
        ankle: [0, 0.08],
        toe: [0.2, 0.045],
        kneePole: [1, 0],
        footZ: 0.14,
        // Arms swing back as the hips load.
        hand: [shoulders[0] - 0.42 * d + 0.3, shoulders[1] - 0.3 - 0.1 * d],
        elbowPole: [0, -1],
        handZ: 0.2,
      };
    },
  },

  'wall-sit': {
    name: 'Wall sit',
    tempo: [0.3, 0.2, 0.3, 0.2],
    phases: ['Settling', 'Holding', 'Bracing', 'Holding'],
    repSeconds: 6,
    props: [],
    pose(d) {
      const pelvis: Vec2 = [-0.42, lerp(0.53, 0.51, d)];
      const shoulders: Vec2 = [pelvis[0] - 0.02, pelvis[1] + BODY.spine];
      return {
        pelvis,
        shoulders,
        headAngle: -2 * DEG,
        ankle: [0.02, 0.08],
        toe: [0.22, 0.045],
        kneePole: [1, 0],
        footZ: 0.14,
        hand: [pelvis[0] + 0.3, pelvis[1] + 0.02],
        elbowPole: [0, -1],
        handZ: 0.22,
      };
    },
  },

  'nordic-curl': {
    name: 'Nordic curl',
    tempo: [0.46, 0.05, 0.31, 0.18],
    phases: [
      'Lowering under control',
      'Low point',
      'Pulling back up',
      'Upright',
    ],
    props: [],
    pose(d) {
      // Ankles anchored; the whole body rotates forward about the knees.
      const knee: Vec2 = [0, 0.1];
      const lean = lerp(4, 70, d) * DEG;
      const pelvis: Vec2 = [
        knee[0] + BODY.thigh * Math.sin(lean),
        knee[1] + BODY.thigh * Math.cos(lean),
      ];
      const shoulders = shouldersFrom(pelvis, lean);
      return {
        pelvis,
        shoulders,
        headAngle: lean * 0.9,
        ankle: [-0.38, 0.07],
        toe: [-0.5, 0.05],
        kneePole: [1, 0.2],
        footZ: 0.11,
        hand: [shoulders[0] + 0.34, shoulders[1] - 0.26],
        elbowPole: [0, -1],
        handZ: 0.22,
      };
    },
  },

  // ---- Warm-up, mobility and stretches ----------------------------------
  'march-on-the-spot': {
    name: 'Easy march on the spot',
    tempo: [0.25, 0.02, 0.25, 0.48],
    phases: ['Knee up', 'Top', 'Foot down', 'Marching'],
    repSeconds: 2.2,
    props: [],
    pose(d) {
      const pelvis: Vec2 = [0, 0.94 + 0.01 * d];
      return {
        pelvis,
        shoulders: shouldersFrom(pelvis, 4 * DEG),
        headAngle: 2 * DEG,
        ankle: [lerp(0, 0.18, d), lerp(0.08, 0.44, d)],
        toe: [lerp(0.2, 0.34, d), lerp(0.045, 0.4, d)],
        kneePole: [1, 0],
        footZ: 0.11,
        ankleFar: [0, 0.08],
        toeFar: [0.2, 0.045],
        kneePoleFar: [1, 0],
        hand: [lerp(0.2, 0.08, d), 0.72],
        elbowPole: [0, -1],
        handZ: 0.22,
        handFar: [lerp(0.08, 0.2, d), 0.72],
        elbowPoleFar: [0, -1],
      };
    },
  },

  'arm-circles': {
    name: 'Arm circles and shoulder dislocates',
    tempo: [0.45, 0.05, 0.45, 0.05],
    phases: ['Arms forward', 'Overhead', 'Arms back', 'Round again'],
    repSeconds: 4,
    props: [],
    pose(d) {
      const pelvis: Vec2 = [0, 0.94];
      const shoulders = shouldersFrom(pelvis, 4 * DEG);
      // The hand travels a full circle about the shoulder.
      const a = lerp(-100, 180, d) * DEG;
      return {
        pelvis,
        shoulders,
        headAngle: 2 * DEG,
        ankle: [0, 0.08],
        toe: [0.2, 0.045],
        kneePole: [1, 0],
        footZ: 0.12,
        hand: [
          shoulders[0] + 0.56 * Math.cos(a),
          shoulders[1] - 0.56 * Math.sin(a),
        ],
        elbowPole: [1, 0],
        handZ: 0.26,
      };
    },
  },

  'band-pull-apart': {
    name: 'Band pull-aparts',
    tempo: [0.34, 0.12, 0.34, 0.2],
    phases: ['Pulling apart', 'Squeeze', 'Returning', 'Arms forward'],
    props: [],
    pose(d) {
      const pelvis: Vec2 = [0, 0.94];
      const shoulders = shouldersFrom(pelvis, 4 * DEG);
      return {
        pelvis,
        shoulders,
        headAngle: 2 * DEG,
        ankle: [0, 0.08],
        toe: [0.2, 0.045],
        kneePole: [1, 0],
        footZ: 0.12,
        // Arms stay straight; the hands sweep outward in depth.
        hand: [shoulders[0] + lerp(0.56, 0.46, d), shoulders[1] - 0.02],
        elbowPole: [0, -1],
        handZ: lerp(0.18, 0.46, d),
      };
    },
  },

  'wrist-prep': {
    name: 'Wrist prep',
    tempo: [0.35, 0.08, 0.35, 0.22],
    phases: ['Rocking forward', 'Loaded', 'Rocking back', 'Neutral'],
    props: [],
    pose(d) {
      // On all fours, rocking weight over planted hands.
      const pelvis: Vec2 = [0, 0.6];
      const shoulders: Vec2 = [pelvis[0] + 0.5, pelvis[1] + 0.04];
      return {
        pelvis,
        shoulders,
        headAngle: 74 * DEG,
        ankle: [pelvis[0] - 0.1, 0.1],
        toe: [pelvis[0] - 0.22, 0.05],
        kneePole: [0, -1],
        footZ: 0.12,
        hand: [shoulders[0] + lerp(0.08, -0.08, d), 0.05],
        elbowPole: [1, 0.2],
        handZ: 0.2,
      };
    },
  },

  'ankle-rocks': {
    name: 'Ankle rocks',
    tempo: [0.34, 0.1, 0.34, 0.22],
    phases: ['Knee forward', 'End range', 'Back', 'Neutral'],
    props: [],
    pose(d) {
      const pelvis: Vec2 = [lerp(-0.02, 0.14, d), lerp(0.9, 0.82, d)];
      const shoulders = shouldersFrom(pelvis, lerp(6, 14, d) * DEG);
      return {
        pelvis,
        shoulders,
        headAngle: 6 * DEG,
        // Heel stays down; the knee travels over the toes.
        ankle: [0.1, 0.08],
        toe: [0.3, 0.045],
        kneePole: [1, 0],
        footZ: 0.12,
        ankleFar: [-0.34, 0.08],
        toeFar: [-0.18, 0.045],
        kneePoleFar: [1, 0],
        hand: [shoulders[0] + 0.46, shoulders[1] + 0.06],
        elbowPole: [0, -1],
        handZ: 0.24,
      };
    },
  },

  'side-bend': {
    name: 'Side bend',
    tempo: [0.34, 0.16, 0.3, 0.2],
    phases: ['Leaning over', 'Holding', 'Coming up', 'Tall'],
    props: [],
    pose(d) {
      const pelvis: Vec2 = [0, 0.94];
      const shoulders = shouldersFrom(pelvis, 4 * DEG);
      return {
        pelvis,
        shoulders,
        headAngle: 2 * DEG,
        ankle: [0, 0.08],
        toe: [0.2, 0.045],
        kneePole: [1, 0],
        footZ: 0.14,
        // Seen side on, one arm sweeps overhead as the trunk leans across.
        hand: [shoulders[0] + 0.1, shoulders[1] + lerp(-0.5, 0.44, d)],
        elbowPole: [1, 0],
        handZ: lerp(0.2, 0.34, d),
        handFar: [shoulders[0] + 0.04, shoulders[1] - 0.5],
        elbowPoleFar: [0, -1],
      };
    },
  },

  'doorway-chest-stretch': {
    name: 'Doorway chest stretch',
    tempo: [0.3, 0.26, 0.26, 0.18],
    phases: ['Turning away', 'Holding the stretch', 'Returning', 'Neutral'],
    repSeconds: 6,
    props: ['wall'],
    pose(d) {
      const pelvis: Vec2 = [lerp(0.2, 0.04, d), 0.94];
      const shoulders = shouldersFrom(pelvis, 4 * DEG);
      return {
        pelvis,
        shoulders,
        headAngle: 2 * DEG,
        ankle: [pelvis[0] + 0.04, 0.08],
        toe: [pelvis[0] + 0.24, 0.045],
        kneePole: [1, 0],
        footZ: 0.13,
        // The hand stays fixed on the frame while the body turns away.
        hand: [0.86, 1.38],
        elbowPole: [0, -1],
        handZ: 0.3,
      };
    },
  },

  'calf-stretch': {
    name: 'Calf stretch against a wall',
    tempo: [0.3, 0.26, 0.26, 0.18],
    phases: ['Pressing the heel down', 'Holding', 'Releasing', 'Neutral'],
    repSeconds: 6,
    props: ['wall'],
    pose(d) {
      const pelvis: Vec2 = [lerp(0.1, 0.22, d), lerp(0.92, 0.88, d)];
      const shoulders = shouldersFrom(pelvis, lerp(8, 18, d) * DEG);
      return {
        pelvis,
        shoulders,
        headAngle: 8 * DEG,
        // Front foot forward, back leg straight with the heel pinned down.
        ankle: [pelvis[0] + 0.22, 0.08],
        toe: [pelvis[0] + 0.42, 0.045],
        kneePole: [1, 0],
        footZ: 0.12,
        ankleFar: [-0.56, 0.08],
        toeFar: [-0.4, 0.045],
        kneePoleFar: [1, 0],
        hand: [0.84, 1.24],
        elbowPole: [0, -1],
        handZ: 0.24,
      };
    },
  },

  'quad-stretch': {
    name: 'Standing quad stretch',
    tempo: [0.3, 0.26, 0.26, 0.18],
    phases: ['Drawing the heel in', 'Holding', 'Releasing', 'Standing'],
    repSeconds: 6,
    props: [],
    pose(d) {
      const pelvis: Vec2 = [0, 0.94];
      const shoulders = shouldersFrom(pelvis, 4 * DEG);
      return {
        pelvis,
        shoulders,
        headAngle: 2 * DEG,
        ankle: [0, 0.08],
        toe: [0.2, 0.045],
        kneePole: [1, 0],
        footZ: 0.1,
        // Heel drawn toward the backside with the knee pointing down.
        ankleFar: [lerp(-0.2, -0.36, d), lerp(0.2, 0.78, d)],
        toeFar: [lerp(-0.34, -0.5, d), lerp(0.16, 0.82, d)],
        kneePoleFar: [-1, 0],
        hand: [shoulders[0] + 0.1, shoulders[1] - 0.5],
        elbowPole: [0, -1],
        handZ: 0.22,
        handFar: [-0.34, 0.78],
        elbowPoleFar: [-1, 0],
      };
    },
  },

  'seated-forward-fold': {
    name: 'Seated forward fold',
    tempo: [0.36, 0.24, 0.24, 0.16],
    phases: ['Folding forward', 'Holding', 'Coming up', 'Sitting tall'],
    repSeconds: 7,
    props: [],
    pose(d) {
      // Sitting with the knees bent over a bolster.
      const pelvis: Vec2 = [0, 0.14];
      const lean = lerp(6, 62, d) * DEG;
      const shoulders = shouldersFrom(pelvis, lean);
      return {
        pelvis,
        shoulders,
        headAngle: lean * 0.9,
        ankle: [pelvis[0] + 0.72, 0.08],
        toe: [pelvis[0] + 0.84, 0.14],
        kneePole: [0, 1],
        footZ: 0.13,
        hand: [shoulders[0] + 0.42, lerp(0.3, 0.14, d)],
        elbowPole: [0, -1],
        handZ: 0.22,
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
