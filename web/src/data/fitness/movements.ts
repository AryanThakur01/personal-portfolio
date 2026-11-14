/**
 * The movement library.
 *
 * Every exercise the program names is one entry here: what it is, how it is
 * performed, and a pose sequence the figure animates. Workout rows, ladder
 * rungs and gate tests all resolve into this registry by name, so a movement
 * is defined once and explained the same way everywhere.
 *
 * Pose angles are degrees clockwise from "pointing right": 90 is straight
 * down, -90 straight up, 180 pointing left. See components/fitness-routine/
 * figure.tsx for how they are applied.
 */

/** Joint angles for one frame. Omitted joints default to 0. */
export interface Pose {
  spine?: number;
  neck?: number;
  head?: number;
  upperArm?: number;
  forearm?: number;
  upperArmFar?: number;
  forearmFar?: number;
  thigh?: number;
  shin?: number;
  foot?: number;
  /** The far-side limb, drawn faintly. */
  thighFar?: number;
  shinFar?: number;
  footFar?: number;
}

export interface PoseSequence {
  label: string;
  /** Frames, looped back to the first. */
  poses: Pose[];
  /** One full cycle, in milliseconds. */
  duration: number;
  /** Prop drawn behind the figure. */
  ground?: 'floor' | 'bar' | 'bars' | 'wall' | 'box';
}

export interface Movement {
  /** Stable key. */
  id: string;
  name: string;
  /** How the exercise is written in workout rows and ladders. */
  aliases: string[];
  /** One line on what it is and what it trains. */
  what: string;
  /** Form points, in order of what matters most. */
  cues: string[];
  sequence: PoseSequence;
}

// ---------------------------------------------------------------------------
// Lying on the back: the L ladder, bridges and dead bugs.
// ---------------------------------------------------------------------------

/** Flat on the back, arms by the head, as every supine rung starts. */
const supineBase: Pose = {
  spine: 180,
  neck: 180,
  head: 180,
  upperArm: 170,
  forearm: 170,
  thigh: 0,
  shin: 0,
  foot: -40,
  thighFar: 0,
  shinFar: 0,
  footFar: -40,
};

const supine = (over: Pose): Pose => ({ ...supineBase, ...over });

// ---------------------------------------------------------------------------
// Hanging from a bar: the H ladder, hangs and pull-ups.
// ---------------------------------------------------------------------------

/** Hanging straight, arms overhead, legs down. */
const hangBase: Pose = {
  spine: -84,
  neck: -88,
  head: -88,
  upperArm: -98,
  forearm: -96,
  thigh: 86,
  shin: 88,
  foot: 45,
  thighFar: 96,
  shinFar: 94,
  footFar: 55,
};

const hang = (over: Pose): Pose => ({ ...hangBase, ...over });

// ---------------------------------------------------------------------------
// Supported on parallel bars: the S ladder and dips.
// ---------------------------------------------------------------------------

const supportBase: Pose = {
  spine: -86,
  neck: -90,
  head: -90,
  upperArm: 78,
  forearm: 86,
  thigh: 95,
  shin: 92,
  foot: 50,
  thighFar: 104,
  shinFar: 98,
  footFar: 58,
};

const support = (over: Pose): Pose => ({ ...supportBase, ...over });

// ---------------------------------------------------------------------------
// Standing: hinges, squats and lunges.
// ---------------------------------------------------------------------------

const standBase: Pose = {
  spine: -86,
  neck: -90,
  head: -90,
  upperArm: 80,
  forearm: 72,
  thigh: 88,
  shin: 90,
  foot: 35,
  thighFar: 96,
  shinFar: 92,
  footFar: 45,
};

const stand = (over: Pose): Pose => ({ ...standBase, ...over });

// ---------------------------------------------------------------------------
// Face down: press-ups, cobra, bird dog, plank, push-ups.
// ---------------------------------------------------------------------------

const proneBase: Pose = {
  spine: 182,
  neck: 182,
  head: 182,
  upperArm: 25,
  forearm: 100,
  thigh: 2,
  shin: 0,
  foot: 20,
  thighFar: 6,
  shinFar: 4,
  footFar: 24,
};

const prone = (over: Pose): Pose => ({ ...proneBase, ...over });

export const MOVEMENTS: Movement[] = [
  // ---- Ladder L: lying leg raises -----------------------------------------
  {
    id: 'dead-bug-heel-taps',
    name: 'Dead bug, heel taps (L0)',
    aliases: [
      'Dead bug, heel taps, knees bent at 90 degrees',
      'Dead bug, heel taps, knees bent',
      'Dead bug with heel taps, knees bent',
    ],
    what: 'Flat on your back, knees bent over the hips, tapping one heel to the floor at a time. Teaches the trunk to stay still while a leg moves.',
    cues: [
      'Lower back stays flat on the floor the whole time.',
      'Only the leg moves. Ribs stay down.',
      'Tap the heel lightly, do not drop the leg.',
    ],
    sequence: {
      label: 'Dead bug heel taps',
      duration: 2600,
      ground: 'floor',
      poses: [
        supine({ thigh: -80, shin: -5, thighFar: -80, shinFar: -5 }),
        supine({ thigh: -40, shin: -5, thighFar: -80, shinFar: -5 }),
        supine({ thigh: -80, shin: -5, thighFar: -80, shinFar: -5 }),
        supine({ thigh: -80, shin: -5, thighFar: -40, shinFar: -5 }),
      ],
    },
  },
  {
    id: 'dead-bug-heel-slide',
    name: 'Dead bug, heel slide (L1)',
    aliases: ['Dead bug, slow heel slide to straight, leg just above floor'],
    what: 'The same as L0, but the leg slides out fully straight and stops just above the floor. A longer lever, so the trunk works harder.',
    cues: [
      'Slide slowly, do not let the back arch as the leg straightens.',
      'Stop just above the floor, not on it.',
      'If the back lifts, shorten the range.',
    ],
    sequence: {
      label: 'Dead bug heel slide',
      duration: 3200,
      ground: 'floor',
      poses: [
        supine({ thigh: -80, shin: -5, thighFar: -80, shinFar: -5 }),
        supine({ thigh: -30, shin: 0, thighFar: -80, shinFar: -5 }),
        supine({ thigh: -5, shin: 0, thighFar: -80, shinFar: -5 }),
        supine({ thigh: -80, shin: -5, thighFar: -80, shinFar: -5 }),
      ],
    },
  },
  {
    id: 'lying-knee-march',
    name: 'Lying knee march (L2)',
    aliases: [
      'Lying knee march, one foot at a time, knee stays bent',
      'Lying core ladder (dead bug to knee march)',
    ],
    what: 'Feet on the floor, knees bent. One knee lifts toward the chest at a time while the other foot stays planted.',
    cues: [
      'Knee stays bent throughout.',
      'Back stays neutral, no rocking through the hips.',
      'Slow up, slow down.',
    ],
    sequence: {
      label: 'Lying knee march',
      duration: 2600,
      ground: 'floor',
      poses: [
        supine({ thigh: -45, shin: 60, thighFar: -45, shinFar: 60 }),
        supine({ thigh: -85, shin: -10, thighFar: -45, shinFar: 60 }),
        supine({ thigh: -45, shin: 60, thighFar: -45, shinFar: 60 }),
        supine({ thigh: -45, shin: 60, thighFar: -85, shinFar: -10 }),
      ],
    },
  },
  {
    id: 'single-straight-leg-lowering',
    name: 'Single straight-leg lowering (L3)',
    aliases: ['Single straight-leg lowering from 30 degrees, other knee bent'],
    what: 'One leg held straight at about 30 degrees, lowered slowly to the floor while the other knee stays bent and planted.',
    cues: [
      'The working leg stays straight the whole way down.',
      'Lower only as far as the back stays flat.',
      'Other knee stays bent with the foot planted, which protects the back.',
    ],
    sequence: {
      label: 'Single straight-leg lowering',
      duration: 3400,
      ground: 'floor',
      poses: [
        supine({ thigh: -30, shin: 0, thighFar: -45, shinFar: 60 }),
        supine({ thigh: -15, shin: 0, thighFar: -45, shinFar: 60 }),
        supine({ thigh: -2, shin: 0, thighFar: -45, shinFar: 60 }),
        supine({ thigh: -30, shin: 0, thighFar: -45, shinFar: 60 }),
      ],
    },
  },
  {
    id: 'double-knee-raise',
    name: 'Double knee raise to table-top (L4)',
    aliases: ['Double knee raise to table-top, slow lower, knees bent'],
    what: 'Both knees lift to table-top together, then lower slowly with the knees still bent. Both legs at once, so twice the load of L2.',
    cues: [
      'Both knees move together, knees stay bent.',
      'Lower slowly. The lowering is the hard part.',
      'Back flat throughout.',
    ],
    sequence: {
      label: 'Double knee raise',
      duration: 3000,
      ground: 'floor',
      poses: [
        supine({ thigh: -20, shin: 40, thighFar: -20, shinFar: 40 }),
        supine({ thigh: -85, shin: -5, thighFar: -85, shinFar: -5 }),
        supine({ thigh: -50, shin: 20, thighFar: -50, shinFar: 20 }),
        supine({ thigh: -20, shin: 40, thighFar: -20, shinFar: 40 }),
      ],
    },
  },
  {
    id: 'double-leg-lowering',
    name: 'Double leg lowering from 60° (L5)',
    aliases: ['Double leg lowering with soft knees from 60 degrees'],
    what: 'Both legs held at about 60 degrees with soft knees, lowered together under control.',
    cues: [
      'Knees stay soft, not locked.',
      'Stop the moment the lower back starts to lift.',
      'Both legs move as one.',
    ],
    sequence: {
      label: 'Double leg lowering',
      duration: 3400,
      ground: 'floor',
      poses: [
        supine({ thigh: -60, shin: 8, thighFar: -60, shinFar: 8 }),
        supine({ thigh: -35, shin: 8, thighFar: -35, shinFar: 8 }),
        supine({ thigh: -12, shin: 8, thighFar: -12, shinFar: 8 }),
        supine({ thigh: -60, shin: 8, thighFar: -60, shinFar: 8 }),
      ],
    },
  },
  {
    id: 'lying-straight-leg-raise',
    name: 'Lying straight leg raise (L6)',
    aliases: [
      'Lying straight leg raise, both legs, slow lowering',
      'Lying leg raises',
      'Lying leg raise (L6)',
    ],
    what: 'The full movement: both legs straight, raised to vertical and lowered slowly to the floor.',
    cues: [
      'Legs straight, moving together.',
      'Lower all the way without the back arching.',
      'Slow on the way down.',
    ],
    sequence: {
      label: 'Lying straight leg raise',
      duration: 3600,
      ground: 'floor',
      poses: [
        supine({ thigh: 0, shin: 0, thighFar: 0, shinFar: 0 }),
        supine({ thigh: -45, shin: 0, thighFar: -45, shinFar: 0 }),
        supine({ thigh: -88, shin: 0, thighFar: -88, shinFar: 0 }),
        supine({ thigh: -45, shin: 0, thighFar: -45, shinFar: 0 }),
      ],
    },
  },

  // ---- Ladder H: hanging --------------------------------------------------
  {
    id: 'dead-hang',
    name: 'Dead hang (H0)',
    aliases: [
      'Dead hang, shoulders pulled down',
      'Dead hang (H0)',
      'Dead hang',
      'Active hang',
    ],
    what: 'Hanging from the bar with straight arms and the shoulders pulled down away from the ears. Builds grip and shoulder control.',
    cues: [
      'Shoulders pulled down, not shrugged up.',
      'Ribs down, body still, no swinging.',
      'Arms stay straight.',
    ],
    sequence: {
      label: 'Dead hang',
      duration: 3000,
      ground: 'bar',
      poses: [hang({ spine: -90 }), hang({ spine: -92 }), hang({ spine: -88 })],
    },
  },
  {
    id: 'hang-knees-lifted',
    name: 'Hang, knees lifted slightly (H1)',
    aliases: ['Hang with knees lifted slightly, held'],
    what: 'A dead hang with the knees lifted a little and held there. The first step of loading the trunk while hanging.',
    cues: [
      'Lift the knees just a few inches and hold.',
      'No swinging. Shoulders stay pulled down.',
      'Breathe normally through the hold.',
    ],
    sequence: {
      label: 'Hang with knees lifted',
      duration: 3000,
      ground: 'bar',
      poses: [
        hang({ thigh: 90, shin: 90, thighFar: 90, shinFar: 90 }),
        hang({ thigh: 65, shin: 100, thighFar: 65, shinFar: 100 }),
        hang({ thigh: 65, shin: 100, thighFar: 65, shinFar: 100 }),
      ],
    },
  },
  {
    id: 'hanging-knee-raise',
    name: 'Hanging knee raise (H2 to H4)',
    aliases: [
      'Hanging knee raise, small range, to waist level',
      'Hanging knee raise to hip height, no swing',
      'Hanging knee raise to chest',
      'Hanging raise ladder',
    ],
    what: 'Hanging from the bar, knees drawn up with control. The height you raise to is what separates H2, H3 and H4.',
    cues: [
      'No swing. Start from a still hang each rep.',
      'Knees come up, hips stay under you.',
      'Lower with control rather than dropping.',
    ],
    sequence: {
      label: 'Hanging knee raise',
      duration: 3000,
      ground: 'bar',
      poses: [
        hang({}),
        hang({ thigh: 30, shin: 110, thighFar: 30, shinFar: 110 }),
        hang({ thigh: 0, shin: 120, thighFar: 0, shinFar: 120 }),
        hang({ thigh: 30, shin: 110, thighFar: 30, shinFar: 110 }),
      ],
    },
  },
  {
    id: 'hanging-straight-leg-raise',
    name: 'Hanging straight leg raise (H6)',
    aliases: [
      'Hanging straight leg raise, to 90 degrees',
      'Hanging straight leg raises (H6)',
    ],
    what: 'Hanging with straight legs, raised to 90 degrees and lowered under control.',
    cues: [
      'Legs stay straight, toes together.',
      'Raise to horizontal, no higher at first.',
      'Absolutely no swing or kipping.',
    ],
    sequence: {
      label: 'Hanging straight leg raise',
      duration: 3400,
      ground: 'bar',
      poses: [
        hang({}),
        hang({ thigh: 45, shin: 45, thighFar: 45, shinFar: 45 }),
        hang({ thigh: 0, shin: 0, thighFar: 0, shinFar: 0 }),
        hang({ thigh: 45, shin: 45, thighFar: 45, shinFar: 45 }),
      ],
    },
  },
  {
    id: 'pull-up',
    name: 'Pull-up',
    aliases: [
      'Pull-ups',
      'Pull-ups, 3 s lowering',
      'Pull-up negatives',
      'Band-assisted pull-ups',
      'Pull-ups or band-assisted',
      'Chin-ups',
      'Chin-up negatives',
      'Max pull-up attempt (from Wk 5)',
    ],
    what: 'From a dead hang, pull until the chin clears the bar, then lower to a full hang. Negatives are the lowering half only.',
    cues: [
      'Start from a full dead hang, arms straight.',
      'Pull the elbows down and back, chest toward the bar.',
      'Lower all the way. On negatives, take 5 seconds.',
    ],
    sequence: {
      label: 'Pull-up',
      duration: 3000,
      ground: 'bar',
      poses: [
        hang({ upperArm: -90, forearm: -90, spine: -90 }),
        { ...hangBase, upperArm: -60, forearm: -120, spine: -88 },
        { ...hangBase, upperArm: -40, forearm: -150, spine: -86 },
        { ...hangBase, upperArm: -60, forearm: -120, spine: -88 },
      ],
    },
  },
  {
    id: 'scapular-pulls',
    name: 'Scapular pulls',
    aliases: ['Scapular pulls on the bar', 'Scapular pulls'],
    what: 'Hanging with straight arms, pulling the shoulder blades down to raise the body an inch or two. No elbow bend.',
    cues: [
      'Arms stay completely straight.',
      'Only the shoulder blades move.',
      'Pause at the top of each small pull.',
    ],
    sequence: {
      label: 'Scapular pulls',
      duration: 2400,
      ground: 'bar',
      poses: [
        hang({ upperArm: -90, forearm: -90 }),
        hang({ upperArm: -88, forearm: -88, spine: -88 }),
        hang({ upperArm: -90, forearm: -90 }),
      ],
    },
  },
  {
    id: 'australian-row',
    name: 'Australian row',
    aliases: [
      'Australian rows, 1 s pause at top',
      'Australian rows, 2 s pause at top',
      'Australian rows',
      'Feet-elevated Australian rows',
      'Feet-elevated rows',
      'Archer Australian rows',
    ],
    what: 'Body straight under a low bar, heels on the floor, pulling the chest to the bar.',
    cues: [
      'Body in one straight line from head to heels.',
      'Chest touches the bar, pause there.',
      'Squeeze the shoulder blades together at the top.',
    ],
    sequence: {
      label: 'Australian row',
      duration: 2800,
      ground: 'bar',
      poses: [
        {
          spine: 10,
          neck: 10,
          head: 10,
          upperArm: -75,
          forearm: -75,
          thigh: 185,
          shin: 185,
          foot: 150,
          thighFar: 185,
          shinFar: 185,
          footFar: 150,
        },
        {
          spine: 10,
          neck: 10,
          head: 10,
          upperArm: -55,
          forearm: -110,
          thigh: 185,
          shin: 185,
          foot: 150,
          thighFar: 185,
          shinFar: 185,
          footFar: 150,
        },
        {
          spine: 10,
          neck: 10,
          head: 10,
          upperArm: -75,
          forearm: -75,
          thigh: 185,
          shin: 185,
          foot: 150,
          thighFar: 185,
          shinFar: 185,
          footFar: 150,
        },
      ],
    },
  },

  // ---- Ladder S: support and L-sit ----------------------------------------
  {
    id: 'support-hold',
    name: 'Support hold (S0)',
    aliases: [
      'Support hold on bars, legs relaxed',
      'Support hold (S0)',
      'Support hold, knees bent',
    ],
    what: 'Holding yourself upright on parallel bars with locked arms and the shoulders pushed down.',
    cues: [
      'Arms locked straight.',
      'Push the shoulders down away from the ears.',
      'Ribs down, body still.',
    ],
    sequence: {
      label: 'Support hold',
      duration: 3000,
      ground: 'bars',
      poses: [support({}), support({ spine: -92 }), support({ spine: -88 })],
    },
  },
  {
    id: 'tuck-l-sit',
    name: 'Tuck L-sit (S2)',
    aliases: [
      'Tuck L-sit on parallettes or bars',
      'L-sit ladder (support hold to tuck L-sit)',
      'L-sit ladder (tuck L-sit)',
      'Support hold, feet just off the floor, knees bent',
    ],
    what: 'A support hold with the knees drawn up to the chest and the feet off the floor.',
    cues: [
      'Arms stay locked, shoulders pushed down.',
      'Knees come up toward the chest.',
      'Do not let the shoulders creep up to the ears.',
    ],
    sequence: {
      label: 'Tuck L-sit',
      duration: 3200,
      ground: 'bars',
      poses: [
        support({}),
        support({ thigh: 20, shin: 120, thighFar: 20, shinFar: 120 }),
        support({ thigh: 20, shin: 120, thighFar: 20, shinFar: 120 }),
      ],
    },
  },
  {
    id: 'l-sit',
    name: 'Full L-sit (S4)',
    aliases: ['Full L-sit', 'L-sit'],
    what: 'Supported on the bars with both legs straight out in front, making an L shape.',
    cues: [
      'Legs dead straight and together.',
      'Arms locked, shoulders down.',
      'Hips stay under you, chest up.',
    ],
    sequence: {
      label: 'Full L-sit',
      duration: 3200,
      ground: 'bars',
      poses: [
        support({ thigh: 0, shin: 0, thighFar: 2, shinFar: 1 }),
        support({ thigh: 2, shin: 1, thighFar: 0, shinFar: 0 }),
        support({ thigh: 0, shin: 0, thighFar: 2, shinFar: 1 }),
      ],
    },
  },
  {
    id: 'dip',
    name: 'Dip',
    aliases: [
      'Strict dips',
      'Dips',
      'Dip negatives',
      'Dips (add backpack at 12 clean)',
      'Dips (weighted at 20+ reps)',
      'Straight bar dips',
      'Weighted dips (optional)',
    ],
    what: 'On parallel bars, lowering until the upper arms are parallel to the floor, then pressing back to a full lockout.',
    cues: [
      'Lower until the upper arms are parallel to the floor.',
      'Press all the way to straight arms.',
      'No swinging. Keep the body upright and still.',
    ],
    sequence: {
      label: 'Dip',
      duration: 2800,
      ground: 'bars',
      poses: [
        support({ upperArm: 90, forearm: 90 }),
        support({ upperArm: 120, forearm: 60, spine: -80 }),
        support({ upperArm: 90, forearm: 90 }),
      ],
    },
  },

  // ---- Ladder R: hinges ---------------------------------------------------
  {
    id: 'glute-bridge',
    name: 'Glute bridge (R0)',
    aliases: [
      'Glute bridge',
      'Glute bridge, then single-leg glute bridge',
      'Single-leg glute bridge (R0)',
      'Single-leg glute bridge',
      'Single-leg glute bridge, feet elevated',
      'Glute bridge march',
    ],
    what: 'On your back with the feet planted, driving the hips up by squeezing the glutes.',
    cues: [
      'Squeeze the glutes to lift, do not arch the lower back.',
      'Ribs stay down.',
      'Pause 2 seconds at the top.',
    ],
    sequence: {
      label: 'Glute bridge',
      duration: 2800,
      ground: 'floor',
      poses: [
        supine({ thigh: -35, shin: 70, thighFar: -35, shinFar: 70 }),
        supine({
          spine: 196,
          neck: 180,
          head: 180,
          thigh: -8,
          shin: 60,
          thighFar: -8,
          shinFar: 60,
        }),
        supine({ thigh: -35, shin: 70, thighFar: -35, shinFar: 70 }),
      ],
    },
  },
  {
    id: 'wall-hinge',
    name: 'Wall hinge (R1)',
    aliases: [
      'Wall hinge: bottom back to a wall, knees soft, back neutral',
      'Wall hinge (once R1 is unlocked)',
      'Wall hinge',
    ],
    what: 'Standing a short step from a wall, pushing the hips back to touch it with a neutral back and soft knees. Teaches hinging without rounding.',
    cues: [
      'Hips go back, not down. The knees barely bend.',
      'Back stays flat like a table.',
      'Touch the wall with the bottom, then stand up.',
    ],
    sequence: {
      label: 'Wall hinge',
      duration: 3000,
      ground: 'wall',
      poses: [
        stand({}),
        stand({ spine: -55, neck: -60, head: -60, thigh: 100, shin: 92 }),
        stand({ spine: -35, neck: -40, head: -40, thigh: 110, shin: 94 }),
        stand({ spine: -55, neck: -60, head: -60, thigh: 100, shin: 92 }),
      ],
    },
  },
  {
    id: 'rdl',
    name: 'Romanian deadlift (R2 to R4)',
    aliases: [
      'Kickstand RDL, short range to knee height',
      'Bodyweight RDL to mid-shin',
      'Single-leg RDL to mid-shin',
      'Single-leg RDL',
      'Hinge ladder (wall hinge to RDL)',
      'Hinge and hamstring ladder',
    ],
    what: 'Hinging at the hips with a flat back and soft knees, reaching down the front of the shins. How far you reach separates R2, R3 and R4.',
    cues: [
      'Back stays flat the whole way. Stop before it rounds.',
      'Knees soft but still, hips travel back.',
      'Feel it in the hamstrings, not the lower back.',
    ],
    sequence: {
      label: 'Romanian deadlift',
      duration: 3400,
      ground: 'floor',
      poses: [
        stand({}),
        stand({ spine: -40, neck: -45, head: -45, thigh: 105, shin: 93 }),
        stand({ spine: -10, neck: -15, head: -15, thigh: 115, shin: 95 }),
        stand({ spine: -40, neck: -45, head: -45, thigh: 105, shin: 93 }),
      ],
    },
  },

  // ---- Prone and trunk ----------------------------------------------------
  {
    id: 'prone-press-up',
    name: 'Prone press-up',
    aliases: ['Prone press-ups', 'Prone on elbows', 'Lie face down, relax'],
    what: 'Face down, pressing the chest up with the arms while the hips stay on the floor. An extension movement, the opposite of bending forward.',
    cues: [
      'Hips stay on the floor throughout.',
      'Press up only as far as feels easing.',
      'Hold 2 seconds at the top, then lower.',
    ],
    sequence: {
      label: 'Prone press-up',
      duration: 3000,
      ground: 'floor',
      poses: [
        // Flat on the floor, hands by the chest, elbows bent.
        prone({ spine: 182, neck: 182, head: 182, upperArm: 25, forearm: 100 }),
        prone({ spine: 196, neck: 192, head: 192, upperArm: 60, forearm: 95 }),
        // Chest pressed up on straight arms, hips still down.
        prone({ spine: 212, neck: 202, head: 202, upperArm: 92, forearm: 90 }),
        prone({ spine: 196, neck: 192, head: 192, upperArm: 60, forearm: 95 }),
      ],
    },
  },
  {
    id: 'cobra-hold',
    name: 'Cobra hold',
    aliases: ['Prone cobra hold', 'Cobra hold'],
    what: 'Face down, lifting the chest, arms and legs slightly off the floor and holding. Works the whole back line.',
    cues: [
      'Squeeze the glutes.',
      'Lift the chest, do not crank the neck back.',
      'Hold steady and breathe.',
    ],
    sequence: {
      label: 'Cobra hold',
      duration: 3000,
      ground: 'floor',
      poses: [
        // Flat, arms resting back along the body.
        prone({ spine: 184, upperArm: 8, forearm: 4 }),
        // Chest, arms and legs all lifted clear of the floor and held.
        prone({
          spine: 214,
          neck: 204,
          head: 204,
          upperArm: -14,
          forearm: -18,
          thigh: -16,
          thighFar: -11,
        }),
        prone({
          spine: 214,
          neck: 204,
          head: 204,
          upperArm: -14,
          forearm: -18,
          thigh: -16,
          thighFar: -11,
        }),
      ],
    },
  },
  {
    id: 'bird-dog',
    name: 'Bird dog',
    aliases: ['Bird dog', 'Bird dog, 5 s holds'],
    what: 'On hands and knees, reaching the opposite arm and leg out straight while the back stays flat.',
    cues: [
      'Back flat like a table. A glass of water should balance on it.',
      'Reach long rather than high.',
      'Hips stay level, no twisting.',
    ],
    sequence: {
      label: 'Bird dog',
      duration: 3200,
      ground: 'floor',
      poses: [
        {
          spine: 175,
          neck: 175,
          head: 175,
          upperArm: 90,
          forearm: 90,
          thigh: 0,
          shin: 90,
          foot: 50,
          thighFar: 0,
          shinFar: 90,
          footFar: 50,
        },
        {
          spine: 175,
          neck: 175,
          head: 175,
          upperArm: 170,
          forearm: 172,
          thigh: -8,
          shin: -8,
          foot: 20,
          thighFar: 0,
          shinFar: 90,
          footFar: 50,
        },
        {
          spine: 175,
          neck: 175,
          head: 175,
          upperArm: 170,
          forearm: 172,
          thigh: -8,
          shin: -8,
          foot: 20,
          thighFar: 0,
          shinFar: 90,
          footFar: 50,
        },
      ],
    },
  },
  {
    id: 'plank',
    name: 'Plank',
    aliases: ['Plank', 'High-tension plank', 'Long-lever plank'],
    what: 'Held face down on the forearms and toes, body in one straight line.',
    cues: [
      'Squeeze glutes, fists and legs. Short and hard beats long and loose.',
      'Hips neither sag nor pike up.',
      'Ribs down, neck long.',
    ],
    sequence: {
      label: 'Plank',
      duration: 3000,
      ground: 'floor',
      poses: [
        {
          spine: 172,
          neck: 172,
          head: 172,
          upperArm: 110,
          forearm: 170,
          thigh: -8,
          shin: -8,
          foot: 40,
          thighFar: -8,
          shinFar: -8,
          footFar: 40,
        },
        {
          spine: 174,
          neck: 174,
          head: 174,
          upperArm: 110,
          forearm: 170,
          thigh: -6,
          shin: -6,
          foot: 40,
          thighFar: -6,
          shinFar: -6,
          footFar: 40,
        },
      ],
    },
  },
  {
    id: 'side-plank',
    name: 'Side plank',
    aliases: [
      'Side plank',
      'Side plank (knees bent ok)',
      'Side plank with top leg lift',
    ],
    what: 'On one forearm and the side of the foot, hips lifted, body in a straight line seen from the front.',
    cues: [
      'Elbow directly under the shoulder.',
      'Hips high and stacked.',
      'Straight line from head to feet.',
    ],
    sequence: {
      label: 'Side plank',
      duration: 3000,
      ground: 'floor',
      poses: [
        {
          spine: 170,
          neck: 170,
          head: 170,
          upperArm: 95,
          forearm: 175,
          thigh: -10,
          shin: -10,
          foot: 30,
          thighFar: -10,
          shinFar: -10,
          footFar: 30,
        },
        {
          spine: 172,
          neck: 172,
          head: 172,
          upperArm: 95,
          forearm: 175,
          thigh: -8,
          shin: -8,
          foot: 30,
          thighFar: -8,
          shinFar: -8,
          footFar: 30,
        },
      ],
    },
  },
  {
    id: 'push-up',
    name: 'Push-up',
    aliases: [
      'Push-ups',
      'Push-ups, 3 s lowering',
      'Feet-elevated push-ups',
      'Diamond push-ups',
      'Diamond to archer push-ups',
      'Pike push-ups',
      'Pike push-ups, knees soft',
      'Feet-elevated pike push-ups',
      'Feet-elevated pike push-ups, knees soft',
      'Pseudo-planche push-ups',
    ],
    what: 'Body straight, lowering the chest to about a fist above the floor and pressing back to a full lockout.',
    cues: [
      'Body in one line, ribs tucked, glutes on.',
      'Chest to a fist above the floor.',
      'Full lockout at the top.',
    ],
    sequence: {
      label: 'Push-up',
      duration: 2600,
      ground: 'floor',
      poses: [
        {
          spine: 172,
          neck: 172,
          head: 172,
          upperArm: 95,
          forearm: 95,
          thigh: -8,
          shin: -8,
          foot: 40,
          thighFar: -8,
          shinFar: -8,
          footFar: 40,
        },
        {
          spine: 172,
          neck: 172,
          head: 172,
          upperArm: 130,
          forearm: 60,
          thigh: -8,
          shin: -8,
          foot: 40,
          thighFar: -8,
          shinFar: -8,
          footFar: 40,
        },
        {
          spine: 172,
          neck: 172,
          head: 172,
          upperArm: 95,
          forearm: 95,
          thigh: -8,
          shin: -8,
          foot: 40,
          thighFar: -8,
          shinFar: -8,
          footFar: 40,
        },
      ],
    },
  },

  // ---- Legs ---------------------------------------------------------------
  {
    id: 'box-squat',
    name: 'Box squat to parallel',
    aliases: [
      'Box squat to parallel, 3 s down',
      'Box squats to parallel',
      'Tempo box squat, 4 s down, 1 s pause',
      'Box squat',
    ],
    what: 'Sitting back to a box at knee height, tapping it, then standing. The box fixes the depth at parallel.',
    cues: [
      'Sit back to the box, tap it, do not flop onto it.',
      'Hip crease level with the knees, no deeper.',
      'Heels stay down.',
    ],
    sequence: {
      label: 'Box squat',
      duration: 3200,
      ground: 'box',
      poses: [
        stand({}),
        stand({
          spine: -65,
          neck: -70,
          head: -70,
          thigh: 135,
          shin: 75,
          thighFar: 135,
          shinFar: 75,
          upperArm: 10,
          forearm: 10,
        }),
        stand({
          spine: -60,
          neck: -65,
          head: -65,
          thigh: 150,
          shin: 70,
          thighFar: 150,
          shinFar: 70,
          upperArm: 5,
          forearm: 5,
        }),
        stand({
          spine: -65,
          neck: -70,
          head: -70,
          thigh: 135,
          shin: 75,
          thighFar: 135,
          shinFar: 75,
          upperArm: 10,
          forearm: 10,
        }),
      ],
    },
  },
  {
    id: 'step-up',
    name: 'Step-up',
    aliases: ['Step-ups, knee-height box', 'Box step-ups, slow', 'Step-ups'],
    what: 'Stepping up onto a knee-height box, driving through the heel of the top foot.',
    cues: [
      'Drive through the heel of the top foot.',
      'Little or no push from the back foot.',
      'Stand all the way up, then lower under control.',
    ],
    sequence: {
      label: 'Step-up',
      duration: 3000,
      ground: 'box',
      poses: [
        stand({ thigh: 90, shin: 90, thighFar: 90, shinFar: 90 }),
        stand({ thigh: 40, shin: 115, thighFar: 90, shinFar: 90 }),
        stand({ thigh: 70, shin: 95, thighFar: 110, shinFar: 95 }),
        stand({ thigh: 40, shin: 115, thighFar: 90, shinFar: 90 }),
      ],
    },
  },
  {
    id: 'split-squat',
    name: 'Split squat',
    aliases: [
      'Short-range split squat (from Wk 6)',
      'Bulgarian split squat',
      'Bulgarian split squat (from Wk 17)',
      'Reverse lunges, short range',
    ],
    what: 'One foot forward, one back, lowering straight down and pressing back up.',
    cues: [
      'Lower straight down, not forward.',
      'Front shin stays close to vertical.',
      'Stop at a comfortable depth.',
    ],
    sequence: {
      label: 'Split squat',
      duration: 3000,
      ground: 'floor',
      poses: [
        stand({ thigh: 80, shin: 95, thighFar: 100, shinFar: 85 }),
        stand({
          spine: -80,
          thigh: 55,
          shin: 110,
          thighFar: 120,
          shinFar: 60,
        }),
        stand({ thigh: 80, shin: 95, thighFar: 100, shinFar: 85 }),
      ],
    },
  },
  {
    id: 'pistol-squat',
    name: 'Pistol squat',
    aliases: [
      'Box pistol (knee height, then lower)',
      'Counterbalanced pistols',
      'Pistol squats',
      'Box pistol',
      'Pistol squat',
    ],
    what: 'A full squat on one leg with the other leg held out straight in front.',
    cues: [
      'Free leg stays straight out in front.',
      'Sit back and down, heel stays planted.',
      'A light counterweight held in front makes balance easier.',
    ],
    sequence: {
      label: 'Pistol squat',
      duration: 3400,
      ground: 'floor',
      poses: [
        stand({ thighFar: 50, shinFar: 40, upperArm: 10, forearm: 10 }),
        stand({
          spine: -62,
          neck: -66,
          head: -66,
          thigh: 130,
          shin: 72,
          thighFar: 5,
          shinFar: 2,
          upperArm: 5,
          forearm: 5,
        }),
        stand({
          spine: -58,
          neck: -62,
          head: -62,
          thigh: 152,
          shin: 64,
          thighFar: 0,
          shinFar: 0,
          upperArm: 0,
          forearm: 0,
        }),
        stand({
          spine: -62,
          neck: -66,
          head: -66,
          thigh: 130,
          shin: 72,
          thighFar: 5,
          shinFar: 2,
          upperArm: 5,
          forearm: 5,
        }),
      ],
    },
  },
  {
    id: 'wall-sit',
    name: 'Wall sit',
    aliases: ['Wall sit'],
    what: 'Back flat to a wall, thighs parallel to the floor, held still.',
    cues: [
      'Thighs parallel to the floor.',
      'Whole back flat against the wall.',
      'Weight through the heels.',
    ],
    sequence: {
      label: 'Wall sit',
      duration: 3000,
      ground: 'wall',
      poses: [
        stand({
          spine: -90,
          thigh: 180,
          shin: 90,
          thighFar: 180,
          shinFar: 90,
          upperArm: 170,
          forearm: 170,
        }),
        stand({
          spine: -90,
          thigh: 178,
          shin: 92,
          thighFar: 178,
          shinFar: 92,
          upperArm: 170,
          forearm: 170,
        }),
      ],
    },
  },
  {
    id: 'calf-raise',
    name: 'Calf raise',
    aliases: [
      'Calf raises, two legs then one',
      'Calf raises',
      'Single-leg calf raise',
    ],
    what: 'Rising onto the toes through a full range, ideally off the edge of a step.',
    cues: [
      'Full range: all the way down, all the way up.',
      'Slow and controlled.',
      'Pause at the top.',
    ],
    sequence: {
      label: 'Calf raise',
      duration: 2400,
      ground: 'floor',
      poses: [
        stand({ foot: 40, footFar: 40 }),
        stand({ spine: -92, foot: 5, footFar: 5, thigh: 86, thighFar: 86 }),
        stand({ foot: 40, footFar: 40 }),
      ],
    },
  },

  // ---- Skills -------------------------------------------------------------
  {
    id: 'crow-pose',
    name: 'Crow pose',
    aliases: ['Crow pose'],
    what: 'Balancing on the hands with the knees resting on the backs of the upper arms.',
    cues: [
      'Knees rest on the backs of the arms.',
      'Look slightly forward, not down.',
      'Put a pillow in front until the balance is reliable.',
    ],
    sequence: {
      label: 'Crow pose',
      duration: 3200,
      ground: 'floor',
      poses: [
        {
          spine: 140,
          neck: 128,
          head: 128,
          upperArm: 95,
          forearm: 95,
          thigh: 20,
          shin: -40,
          foot: -70,
          thighFar: 26,
          shinFar: -34,
          footFar: -64,
        },
        {
          spine: 132,
          neck: 118,
          head: 118,
          upperArm: 95,
          forearm: 95,
          thigh: 10,
          shin: -55,
          foot: -85,
          thighFar: 16,
          shinFar: -49,
          footFar: -79,
        },
        {
          spine: 136,
          neck: 123,
          head: 123,
          upperArm: 95,
          forearm: 95,
          thigh: 15,
          shin: -48,
          foot: -78,
          thighFar: 21,
          shinFar: -42,
          footFar: -72,
        },
      ],
    },
  },
  {
    id: 'wall-handstand',
    name: 'Chest-to-wall handstand',
    aliases: [
      'Chest-to-wall handstand',
      'Wall handstand (chest to wall)',
      'Handstand kick-ups at wall plus holds',
      'Freestanding handstand',
      'Freestanding handstand practice',
    ],
    what: 'Upside down on the hands with the chest toward the wall, body in one straight line.',
    cues: [
      'Ribs tucked, glutes squeezed, one straight line.',
      'Hands 10 to 20 cm from the wall.',
      'Push the floor away through the shoulders.',
    ],
    sequence: {
      label: 'Wall handstand',
      duration: 3200,
      ground: 'floor',
      poses: [
        {
          spine: 92,
          neck: 92,
          head: 92,
          upperArm: 88,
          forearm: 88,
          thigh: -88,
          shin: -88,
          foot: -62,
          thighFar: -84,
          shinFar: -84,
          footFar: -58,
        },
        {
          spine: 90,
          neck: 90,
          head: 90,
          upperArm: 90,
          forearm: 90,
          thigh: -90,
          shin: -90,
          foot: -64,
          thighFar: -86,
          shinFar: -86,
          footFar: -60,
        },
        {
          spine: 88,
          neck: 88,
          head: 88,
          upperArm: 92,
          forearm: 92,
          thigh: -92,
          shin: -92,
          foot: -66,
          thighFar: -88,
          shinFar: -88,
          footFar: -62,
        },
      ],
    },
  },

  // ---- Bar skills: levers, muscle-ups, advanced pulling -------------------
  {
    id: 'tuck-front-lever',
    name: 'Tuck front lever',
    aliases: [
      'Tuck front lever hold (needs L4)',
      'Tuck front lever holds',
      'Advanced tuck front lever (needs L5)',
      'Advanced tuck front lever',
      'Front lever pulls (tuck or advanced tuck)',
      'One-leg to straddle front lever',
    ],
    what: 'Hanging with straight arms, body pulled up to horizontal with the knees tucked to the chest. The advanced tuck opens the hips; the full lever straightens the legs.',
    cues: [
      'Arms stay locked straight the whole hold.',
      'Ribs down, hips level with the shoulders.',
      'Pull the bar toward your hips to hold position.',
    ],
    sequence: {
      label: 'Tuck front lever',
      duration: 3400,
      ground: 'bar',
      poses: [
        hang({}),
        hang({
          spine: -20,
          neck: -40,
          head: -40,
          upperArm: -120,
          forearm: -118,
          thigh: 30,
          shin: 130,
          thighFar: 34,
          shinFar: 134,
        }),
        hang({
          spine: 4,
          neck: -10,
          head: -10,
          upperArm: -140,
          forearm: -138,
          thigh: 20,
          shin: 140,
          thighFar: 24,
          shinFar: 144,
        }),
        hang({
          spine: -20,
          neck: -40,
          head: -40,
          upperArm: -120,
          forearm: -118,
          thigh: 30,
          shin: 130,
          thighFar: 34,
          shinFar: 134,
        }),
      ],
    },
  },
  {
    id: 'back-lever',
    name: 'Back lever',
    aliases: [
      'Tuck to advanced tuck back lever',
      'Straddle to full back lever',
    ],
    what: 'Hanging face down with the body held horizontal below the bar, arms straight behind you. Built up from a tuck.',
    cues: [
      'Arms locked, shoulders open.',
      'Squeeze glutes so the hips do not sag.',
      'Progress slowly: this loads the elbows hard.',
    ],
    sequence: {
      label: 'Back lever',
      duration: 3600,
      ground: 'bar',
      poses: [
        hang({ spine: -84 }),
        hang({
          spine: 140,
          neck: 150,
          head: 150,
          upperArm: -60,
          forearm: -62,
          thigh: 150,
          shin: 130,
          thighFar: 154,
          shinFar: 134,
        }),
        hang({
          spine: 176,
          neck: 182,
          head: 182,
          upperArm: -40,
          forearm: -42,
          thigh: 178,
          shin: 178,
          thighFar: 182,
          shinFar: 182,
        }),
        hang({
          spine: 140,
          neck: 150,
          head: 150,
          upperArm: -60,
          forearm: -62,
          thigh: 150,
          shin: 130,
          thighFar: 154,
          shinFar: 134,
        }),
      ],
    },
  },
  {
    id: 'muscle-up',
    name: 'Muscle-up',
    aliases: [
      'Muscle-up practice (band or low bar)',
      'Muscle-up technique (band or low bar)',
      'Muscle-ups, as strict as possible',
    ],
    what: 'A pull-up that continues into a dip: you pull high, roll the shoulders over the bar, then press to a support above it.',
    cues: [
      'Pull to the lower chest before trying to transition.',
      'Lean the shoulders forward over the bar as you rise.',
      'Finish with straight arms in a support hold.',
    ],
    sequence: {
      label: 'Muscle-up',
      duration: 3600,
      ground: 'bar',
      poses: [
        hang({}),
        hang({ upperArm: -60, forearm: -130, spine: -82 }),
        hang({
          upperArm: -20,
          forearm: -170,
          spine: -74,
          thigh: 70,
          shin: 100,
          thighFar: 78,
          shinFar: 104,
        }),
        hang({
          upperArm: 60,
          forearm: 70,
          spine: -80,
          thigh: 84,
          shin: 88,
          thighFar: 92,
          shinFar: 92,
        }),
        hang({ upperArm: -60, forearm: -130, spine: -82 }),
      ],
    },
  },
  {
    id: 'chest-to-bar-pull-up',
    name: 'Explosive chest-to-bar pull-up',
    aliases: [
      'Explosive chest-to-bar pull-ups',
      'Archer pull-ups',
      'Weighted pull-ups (optional)',
    ],
    what: 'A pull-up pulled hard enough that the bar touches the lower chest rather than stopping at the chin.',
    cues: [
      'Pull fast, elbows down and back.',
      'Bar touches the lower chest.',
      'Control the lowering, do not drop.',
    ],
    sequence: {
      label: 'Chest-to-bar pull-up',
      duration: 2600,
      ground: 'bar',
      poses: [
        hang({}),
        hang({ upperArm: -55, forearm: -135, spine: -80 }),
        hang({ upperArm: -25, forearm: -168, spine: -72 }),
        hang({ upperArm: -55, forearm: -135, spine: -80 }),
      ],
    },
  },
  {
    id: 'toes-to-bar',
    name: 'Toes to bar (H7)',
    aliases: ['Toes to bar', 'Toes to bar (H7)'],
    what: 'Hanging with straight legs, raised all the way until the toes touch the bar.',
    cues: [
      'Legs stay straight and together.',
      'No kipping or swinging.',
      'Lower under control, all the way down.',
    ],
    sequence: {
      label: 'Toes to bar',
      duration: 3200,
      ground: 'bar',
      poses: [
        hang({}),
        hang({ thigh: 20, shin: 20, thighFar: 24, shinFar: 24 }),
        hang({
          thigh: -62,
          shin: -62,
          thighFar: -58,
          shinFar: -58,
          spine: -70,
        }),
        hang({ thigh: 20, shin: 20, thighFar: 24, shinFar: 24 }),
      ],
    },
  },
  {
    id: 'hanging-one-leg-raise',
    name: 'Hanging raise, one leg straight (H5)',
    aliases: ['Hanging raise, one leg straight, one bent'],
    what: 'A hanging raise with one leg straight and the other bent, so one side takes most of the load.',
    cues: [
      'The straight leg does the work.',
      'No swing between reps.',
      'Swap sides evenly.',
    ],
    sequence: {
      label: 'Hanging one-leg raise',
      duration: 3200,
      ground: 'bar',
      poses: [
        hang({}),
        hang({ thigh: 30, shin: 30, thighFar: 40, shinFar: 120 }),
        hang({ thigh: 0, shin: 0, thighFar: 20, shinFar: 130 }),
        hang({ thigh: 30, shin: 30, thighFar: 40, shinFar: 120 }),
      ],
    },
  },

  // ---- Support work: L-sit progressions ----------------------------------
  {
    id: 'one-leg-tuck-l-sit',
    name: 'Tuck L-sit, one leg extended (S3)',
    aliases: ['Tuck L-sit with one leg extended'],
    what: 'A tuck L-sit with one leg straightened out in front while the other stays tucked.',
    cues: [
      'Arms locked, shoulders pushed down.',
      'Extend one leg fully, hold, then swap.',
      'Hips stay under you.',
    ],
    sequence: {
      label: 'Tuck L-sit, one leg extended',
      duration: 3400,
      ground: 'bars',
      poses: [
        support({ thigh: 20, shin: 120, thighFar: 20, shinFar: 120 }),
        support({ thigh: 0, shin: 0, thighFar: 20, shinFar: 120 }),
        support({ thigh: 0, shin: 0, thighFar: 20, shinFar: 120 }),
      ],
    },
  },
  {
    id: 'v-sit',
    name: 'V-sit (S5)',
    aliases: ['V-sit progressions'],
    what: 'An L-sit taken further, with the legs lifted above horizontal into a V. Year 2 work.',
    cues: [
      'Build from a solid full L-sit first.',
      'Arms locked, push the floor away.',
      'Lift the legs rather than leaning back.',
    ],
    sequence: {
      label: 'V-sit',
      duration: 3400,
      ground: 'bars',
      poses: [
        support({ thigh: 0, shin: 0, thighFar: 2, shinFar: 1 }),
        support({
          thigh: -35,
          shin: -35,
          thighFar: -32,
          shinFar: -32,
          spine: -70,
        }),
        support({
          thigh: -35,
          shin: -35,
          thighFar: -32,
          shinFar: -32,
          spine: -70,
        }),
      ],
    },
  },

  // ---- Planche and handstand press ----------------------------------------
  {
    id: 'planche-lean',
    name: 'Planche lean',
    aliases: ['Planche leans', 'Planche leans or tuck planche'],
    what: 'A plank position with the shoulders leaned forward well past the hands, loading the straight arms.',
    cues: [
      'Hands turned out, arms locked.',
      'Lean the shoulders past the hands.',
      'Protract: push the floor away, upper back rounded.',
    ],
    sequence: {
      label: 'Planche lean',
      duration: 3200,
      ground: 'floor',
      poses: [
        prone({
          spine: 186,
          upperArm: 80,
          forearm: 86,
          thigh: -6,
          thighFar: -2,
        }),
        prone({
          spine: 190,
          upperArm: 55,
          forearm: 62,
          thigh: -8,
          thighFar: -4,
        }),
        prone({
          spine: 190,
          upperArm: 55,
          forearm: 62,
          thigh: -8,
          thighFar: -4,
        }),
      ],
    },
  },
  {
    id: 'tuck-planche',
    name: 'Tuck planche',
    aliases: [
      'Tuck planche',
      'Advanced tuck planche',
      'Frog stand to tuck planche lean',
    ],
    what: 'Balanced on the hands with straight arms and the knees tucked, feet off the floor and hips at shoulder height.',
    cues: [
      'Arms stay locked. This is a straight-arm skill.',
      'Lean well forward, shoulders past the hands.',
      'Hips come up to shoulder level, back flat.',
    ],
    sequence: {
      label: 'Tuck planche',
      duration: 3400,
      ground: 'floor',
      poses: [
        prone({
          spine: 188,
          upperArm: 70,
          forearm: 78,
          thigh: -10,
          shin: 60,
          thighFar: -6,
          shinFar: 64,
        }),
        prone({
          spine: 196,
          upperArm: 50,
          forearm: 58,
          thigh: -40,
          shin: 70,
          thighFar: -36,
          shinFar: 74,
        }),
        prone({
          spine: 196,
          upperArm: 50,
          forearm: 58,
          thigh: -40,
          shin: 70,
          thighFar: -36,
          shinFar: 74,
        }),
      ],
    },
  },
  {
    id: 'wall-hspu',
    name: 'Wall handstand push-up',
    aliases: [
      'Wall handstand push-ups',
      'Wall handstand push-up negatives',
      'Partial-range wall HSPU',
      'Pike lean and press handstand drills',
    ],
    what: 'Upside down against a wall, lowering the head toward the floor and pressing back to straight arms.',
    cues: [
      'Lower the head slowly, 4 to 5 seconds on negatives.',
      'Ribs tucked, body in one line.',
      'Put a cushion under the head while learning.',
    ],
    sequence: {
      label: 'Wall handstand push-up',
      duration: 3200,
      ground: 'floor',
      poses: [
        {
          spine: -92,
          neck: -92,
          head: -92,
          upperArm: 88,
          forearm: 88,
          thigh: -88,
          shin: -88,
          foot: -60,
          thighFar: -92,
          shinFar: -92,
          footFar: -62,
        },
        {
          spine: -92,
          neck: -92,
          head: -92,
          upperArm: 120,
          forearm: 56,
          thigh: -88,
          shin: -88,
          foot: -60,
          thighFar: -92,
          shinFar: -92,
          footFar: -62,
        },
        {
          spine: -92,
          neck: -92,
          head: -92,
          upperArm: 88,
          forearm: 88,
          thigh: -88,
          shin: -88,
          foot: -60,
          thighFar: -92,
          shinFar: -92,
          footFar: -62,
        },
      ],
    },
  },
  {
    id: 'scapular-push-up',
    name: 'Scapular push-up',
    aliases: ['Scapular push-ups'],
    what: 'A plank on straight arms where only the shoulder blades move: squeeze together, then push apart.',
    cues: [
      'Arms stay completely locked.',
      'Only the shoulder blades move.',
      'Push the floor away at the top.',
    ],
    sequence: {
      label: 'Scapular push-up',
      duration: 2400,
      ground: 'floor',
      poses: [
        prone({
          spine: 184,
          upperArm: 88,
          forearm: 90,
          thigh: -6,
          thighFar: -2,
        }),
        prone({
          spine: 180,
          upperArm: 92,
          forearm: 92,
          thigh: -4,
          thighFar: 0,
        }),
        prone({
          spine: 184,
          upperArm: 88,
          forearm: 90,
          thigh: -6,
          thighFar: -2,
        }),
      ],
    },
  },

  // ---- Legs ---------------------------------------------------------------
  {
    id: 'shrimp-squat',
    name: 'Shrimp squat',
    aliases: ['Shrimp squats', 'Shrimp squat progression'],
    what: 'A single-leg squat with the rear leg bent and held behind you, knee lowering toward the floor.',
    cues: [
      'Stay upright, chest tall.',
      'Rear knee tracks down to the floor.',
      'Control the descent, do not drop onto the knee.',
    ],
    sequence: {
      label: 'Shrimp squat',
      duration: 3400,
      ground: 'floor',
      poses: [
        stand({ thighFar: 100, shinFar: 20 }),
        stand({
          spine: -74,
          thigh: 110,
          shin: 70,
          thighFar: 130,
          shinFar: -20,
        }),
        stand({
          spine: -70,
          thigh: 135,
          shin: 60,
          thighFar: 150,
          shinFar: -40,
        }),
        stand({
          spine: -74,
          thigh: 110,
          shin: 70,
          thighFar: 130,
          shinFar: -20,
        }),
      ],
    },
  },
  {
    id: 'cossack-squat',
    name: 'Cossack squat',
    aliases: ['Cossack squats, pain-free range'],
    what: 'A wide side-to-side squat: you sit down over one leg while the other stays straight.',
    cues: [
      'Keep both heels down.',
      'Chest up, sit into the bent side.',
      'Stay inside a pain-free range.',
    ],
    sequence: {
      label: 'Cossack squat',
      duration: 3600,
      ground: 'floor',
      poses: [
        stand({ thigh: 70, shin: 100, thighFar: 110, shinFar: 80 }),
        stand({
          spine: -78,
          thigh: 40,
          shin: 130,
          thighFar: 150,
          shinFar: 40,
          upperArm: 20,
          forearm: 10,
        }),
        stand({ thigh: 70, shin: 100, thighFar: 110, shinFar: 80 }),
      ],
    },
  },
  {
    id: 'box-jump',
    name: 'Box jump',
    aliases: ['Box jumps, step down', 'Box jumps or sprints'],
    what: 'An explosive jump onto a box, landing soft, then stepping back down rather than jumping down.',
    cues: [
      'Land softly with bent knees.',
      'Always step down, never jump down.',
      'Quality over height.',
    ],
    sequence: {
      label: 'Box jump',
      duration: 2600,
      ground: 'box',
      poses: [
        stand({
          spine: -70,
          thigh: 130,
          shin: 60,
          thighFar: 134,
          shinFar: 64,
          upperArm: 150,
          forearm: 150,
        }),
        stand({
          spine: -88,
          thigh: 70,
          shin: 80,
          thighFar: 74,
          shinFar: 84,
          upperArm: -60,
          forearm: -60,
        }),
        stand({
          spine: -76,
          thigh: 120,
          shin: 66,
          thighFar: 124,
          shinFar: 70,
          upperArm: 40,
          forearm: 30,
        }),
      ],
    },
  },
  {
    id: 'single-leg-hip-thrust',
    name: 'Single-leg hip thrust',
    aliases: ['Single-leg hip thrust'],
    what: 'Shoulders raised on a bench, driving the hips up on one leg.',
    cues: [
      'Squeeze the glute to lift.',
      'Ribs down, do not arch the back.',
      'Pause at the top.',
    ],
    sequence: {
      label: 'Single-leg hip thrust',
      duration: 2800,
      ground: 'floor',
      poses: [
        supine({ thigh: -30, shin: 70, thighFar: -70, shinFar: -10 }),
        supine({
          spine: 196,
          thigh: -4,
          shin: 62,
          thighFar: -40,
          shinFar: -20,
        }),
        supine({ thigh: -30, shin: 70, thighFar: -70, shinFar: -10 }),
      ],
    },
  },
  {
    id: 'slider-hamstring-curl',
    name: 'Slider hamstring curl',
    aliases: ['Slider hamstring curls'],
    what: 'On your back with the hips lifted, heels slide out and pull back in under control.',
    cues: [
      'Hips stay up the whole set.',
      'Pull the heels in slowly.',
      'Stop if the hamstrings cramp.',
    ],
    sequence: {
      label: 'Slider hamstring curl',
      duration: 3200,
      ground: 'floor',
      poses: [
        supine({
          spine: 194,
          thigh: -10,
          shin: 55,
          thighFar: -10,
          shinFar: 55,
        }),
        supine({ spine: 188, thigh: -6, shin: 10, thighFar: -6, shinFar: 10 }),
        supine({
          spine: 194,
          thigh: -10,
          shin: 55,
          thighFar: -10,
          shinFar: 55,
        }),
      ],
    },
  },
  {
    id: 'nordic-curl',
    name: 'Nordic curl',
    aliases: [
      'Nordic curls',
      'Nordic curls, partial range (from Wk 33, needs R4)',
    ],
    what: 'Kneeling with the ankles anchored, lowering the whole body forward under hamstring control.',
    cues: [
      'Body stays in one line from knees to head.',
      'Lower as slowly as you can, then push back up.',
      'Stop at any pulling behind the knee.',
    ],
    sequence: {
      label: 'Nordic curl',
      duration: 3600,
      ground: 'floor',
      poses: [
        {
          spine: -90,
          neck: -90,
          head: -90,
          upperArm: 60,
          forearm: 60,
          thigh: 90,
          shin: 0,
          foot: 0,
          thighFar: 94,
          shinFar: 4,
          footFar: 4,
        },
        {
          spine: -50,
          neck: -50,
          head: -50,
          upperArm: 30,
          forearm: 20,
          thigh: 130,
          shin: 0,
          foot: 0,
          thighFar: 134,
          shinFar: 4,
          footFar: 4,
        },
        {
          spine: -16,
          neck: -16,
          head: -16,
          upperArm: 10,
          forearm: -10,
          thigh: 164,
          shin: 0,
          foot: 0,
          thighFar: 168,
          shinFar: 4,
          footFar: 4,
        },
        {
          spine: -50,
          neck: -50,
          head: -50,
          upperArm: 30,
          forearm: 20,
          thigh: 130,
          shin: 0,
          foot: 0,
          thighFar: 134,
          shinFar: 4,
          footFar: 4,
        },
      ],
    },
  },

  // ---- Trunk and upper back ----------------------------------------------
  {
    id: 'prone-y-t-raise',
    name: 'Prone Y and T raises',
    aliases: ['Prone Y and T raises'],
    what: 'Face down, lifting straight arms off the floor in a Y shape and then a T shape.',
    cues: [
      'Thumbs up, arms straight.',
      'Lift from the upper back, not the neck.',
      'Small range, held, rather than swung.',
    ],
    sequence: {
      label: 'Prone Y and T raises',
      duration: 3000,
      ground: 'floor',
      poses: [
        prone({ spine: 182, upperArm: 160, forearm: 160 }),
        prone({
          spine: 186,
          upperArm: 186,
          forearm: 186,
          neck: 186,
          head: 186,
        }),
        prone({
          spine: 186,
          upperArm: 150,
          forearm: 150,
          neck: 186,
          head: 186,
        }),
        prone({ spine: 182, upperArm: 160, forearm: 160 }),
      ],
    },
  },
  {
    id: 'prone-on-elbows',
    name: 'Lie face down, then prone on elbows',
    aliases: [
      'Lie face down and relax, then prone on elbows',
      'Lie face down, relax',
      'Prone on elbows',
    ],
    what: 'Lying face down and relaxing, then propping up onto the forearms with the hips staying heavy on the floor.',
    cues: [
      'Let the hips sink and stay down.',
      'Shoulders relaxed, not shrugged.',
      'Breathe out and let the back settle.',
    ],
    sequence: {
      label: 'Prone on elbows',
      duration: 3600,
      ground: 'floor',
      poses: [
        prone({ spine: 182, upperArm: 25, forearm: 100 }),
        prone({ spine: 196, neck: 190, head: 190, upperArm: 55, forearm: 120 }),
        prone({ spine: 196, neck: 190, head: 190, upperArm: 55, forearm: 120 }),
      ],
    },
  },

  // ---- Warm-up and mobility ----------------------------------------------
  {
    id: 'march-on-the-spot',
    name: 'Easy march on the spot',
    aliases: ['Easy march on the spot', 'Easy walk', 'Short walk'],
    what: 'Marching gently on the spot, or an easy walk, to get blood moving without loading anything.',
    cues: [
      'Easy pace, relaxed arms.',
      'Stop if anything hurts.',
      'Breathe through the nose.',
    ],
    sequence: {
      label: 'March on the spot',
      duration: 1800,
      ground: 'floor',
      poses: [
        stand({
          thigh: 60,
          shin: 110,
          thighFar: 100,
          shinFar: 95,
          upperArm: 110,
          forearm: 60,
          upperArmFar: 55,
          forearmFar: 100,
        }),
        stand({
          thigh: 95,
          shin: 92,
          thighFar: 92,
          shinFar: 92,
          upperArm: 80,
          forearm: 72,
          upperArmFar: 80,
          forearmFar: 72,
        }),
        stand({
          thigh: 100,
          shin: 95,
          thighFar: 60,
          shinFar: 110,
          upperArm: 55,
          forearm: 100,
          upperArmFar: 110,
          forearmFar: 60,
        }),
        stand({
          thigh: 95,
          shin: 92,
          thighFar: 92,
          shinFar: 92,
          upperArm: 80,
          forearm: 72,
          upperArmFar: 80,
          forearmFar: 72,
        }),
      ],
    },
  },
  {
    id: 'arm-circles',
    name: 'Arm circles and shoulder dislocates',
    aliases: ['Arm circles and band shoulder dislocates'],
    what: 'Big slow circles of the arms, or taking a band from in front of you to behind, to open the shoulders.',
    cues: [
      'Slow, through a pain-free range only.',
      'Arms stay straight.',
      'Widen the grip on the band if it pinches.',
    ],
    sequence: {
      label: 'Arm circles',
      duration: 3000,
      ground: 'floor',
      poses: [
        stand({ upperArm: 80, forearm: 80, upperArmFar: 80, forearmFar: 80 }),
        stand({ upperArm: 0, forearm: 0, upperArmFar: 10, forearmFar: 10 }),
        stand({
          upperArm: -90,
          forearm: -90,
          upperArmFar: -80,
          forearmFar: -80,
        }),
        stand({
          upperArm: 180,
          forearm: 180,
          upperArmFar: 190,
          forearmFar: 190,
        }),
      ],
    },
  },
  {
    id: 'band-pull-apart',
    name: 'Band pull-aparts',
    aliases: ['Band pull-aparts'],
    what: 'Holding a band out in front at shoulder height and pulling it apart by squeezing the shoulder blades.',
    cues: [
      'Shoulders down and back.',
      'Arms stay straight.',
      'Squeeze, pause, return slowly.',
    ],
    sequence: {
      label: 'Band pull-aparts',
      duration: 2400,
      ground: 'floor',
      poses: [
        stand({ upperArm: 0, forearm: 0, upperArmFar: 2, forearmFar: 2 }),
        stand({
          upperArm: -8,
          forearm: -8,
          upperArmFar: 14,
          forearmFar: 14,
          spine: -88,
        }),
        stand({ upperArm: 0, forearm: 0, upperArmFar: 2, forearmFar: 2 }),
      ],
    },
  },
  {
    id: 'wrist-prep',
    name: 'Wrist prep',
    aliases: [
      'Wrist prep: circles, palms-down rocks, fingers-back rocks',
      'Forearm and wrist stretch',
      'Wrist and forearm stretch',
    ],
    what: 'On all fours, rocking weight over the hands with the palms down and then the fingers turned back, to prepare the wrists.',
    cues: [
      'Rock slowly, never force the range.',
      'Do it every session before any hand-loaded work.',
      'Spread the fingers and press through the whole palm.',
    ],
    sequence: {
      label: 'Wrist prep',
      duration: 3000,
      ground: 'floor',
      poses: [
        {
          spine: 176,
          neck: 176,
          head: 176,
          upperArm: 92,
          forearm: 92,
          thigh: 0,
          shin: 90,
          foot: 50,
          thighFar: 4,
          shinFar: 94,
          footFar: 54,
        },
        {
          spine: 172,
          neck: 172,
          head: 172,
          upperArm: 112,
          forearm: 108,
          thigh: -4,
          shin: 86,
          foot: 46,
          thighFar: 0,
          shinFar: 90,
          footFar: 50,
        },
        {
          spine: 176,
          neck: 176,
          head: 176,
          upperArm: 92,
          forearm: 92,
          thigh: 0,
          shin: 90,
          foot: 50,
          thighFar: 4,
          shinFar: 94,
          footFar: 54,
        },
      ],
    },
  },
  {
    id: 'ankle-rocks',
    name: 'Ankle rocks',
    aliases: ['Ankle rocks, hands on a wall'],
    what: 'Hands on a wall, driving the knee forward over the toes while the heel stays down.',
    cues: [
      'Heel stays down the whole time.',
      'Knee travels forward over the middle toes.',
      'Small, repeated rocks rather than one big push.',
    ],
    sequence: {
      label: 'Ankle rocks',
      duration: 2400,
      ground: 'wall',
      poses: [
        stand({
          upperArm: 10,
          forearm: 10,
          thigh: 88,
          shin: 92,
          thighFar: 100,
          shinFar: 86,
        }),
        stand({
          upperArm: 5,
          forearm: 5,
          thigh: 78,
          shin: 108,
          thighFar: 104,
          shinFar: 84,
          spine: -82,
        }),
        stand({
          upperArm: 10,
          forearm: 10,
          thigh: 88,
          shin: 92,
          thighFar: 100,
          shinFar: 86,
        }),
      ],
    },
  },
  {
    id: 'side-bend',
    name: 'Side bend',
    aliases: ['Side bends, or side-lying stretch over a pillow', 'Side bends'],
    what: 'Standing tall and leaning smoothly to one side, or lying over a pillow on your side, to open the side of the trunk.',
    cues: [
      'Lean sideways, not forward.',
      'Start toward whichever side feels better.',
      'Hold 5 seconds, come back up, swap.',
    ],
    sequence: {
      label: 'Side bend',
      duration: 3000,
      ground: 'floor',
      poses: [
        stand({ upperArm: 80, forearm: 72 }),
        stand({
          spine: -70,
          neck: -74,
          head: -74,
          upperArm: 50,
          forearm: 30,
          upperArmFar: 95,
          forearmFar: 95,
        }),
        stand({ upperArm: 80, forearm: 72 }),
      ],
    },
  },
  {
    id: 'doorway-chest-stretch',
    name: 'Doorway chest stretch',
    aliases: ['Doorway chest stretch', 'Cross-body shoulder stretch'],
    what: 'Forearm on a doorframe at shoulder height, turning the body away to open the chest.',
    cues: [
      'Elbow at shoulder height.',
      'Turn the body away, do not push the shoulder forward.',
      'Easy stretch, never sharp.',
    ],
    sequence: {
      label: 'Doorway chest stretch',
      duration: 3200,
      ground: 'wall',
      poses: [
        stand({ upperArm: 10, forearm: -40 }),
        stand({
          spine: -96,
          upperArm: -5,
          forearm: -55,
          neck: -100,
          head: -100,
        }),
        stand({
          spine: -96,
          upperArm: -5,
          forearm: -55,
          neck: -100,
          head: -100,
        }),
      ],
    },
  },
  {
    id: 'calf-stretch',
    name: 'Calf stretch against a wall',
    aliases: ['Calf stretch against a wall'],
    what: 'Hands on a wall, one leg back and straight, heel pressed down.',
    cues: [
      'Back heel stays flat on the floor.',
      'Back knee straight for the calf, bent for the lower calf.',
      'Hips face forward.',
    ],
    sequence: {
      label: 'Calf stretch',
      duration: 3200,
      ground: 'wall',
      poses: [
        stand({
          upperArm: 10,
          forearm: 5,
          thigh: 80,
          shin: 95,
          thighFar: 110,
          shinFar: 100,
          footFar: 30,
        }),
        stand({
          spine: -80,
          upperArm: 5,
          forearm: 0,
          thigh: 70,
          shin: 105,
          thighFar: 120,
          shinFar: 104,
          footFar: 25,
        }),
        stand({
          spine: -80,
          upperArm: 5,
          forearm: 0,
          thigh: 70,
          shin: 105,
          thighFar: 120,
          shinFar: 104,
          footFar: 25,
        }),
      ],
    },
  },
  {
    id: 'quad-stretch',
    name: 'Standing quad stretch',
    aliases: ['Standing quad stretch, pelvis neutral'],
    what: 'Standing on one leg, heel pulled toward the backside with the knee pointing down.',
    cues: [
      'Knee points at the floor, not out behind.',
      'Squeeze the glute so the back does not arch.',
      'Hold something for balance if needed.',
    ],
    sequence: {
      label: 'Standing quad stretch',
      duration: 3200,
      ground: 'floor',
      poses: [
        stand({ thighFar: 95, shinFar: 95 }),
        stand({
          thighFar: 100,
          shinFar: -10,
          upperArmFar: 120,
          forearmFar: 30,
        }),
        stand({
          thighFar: 100,
          shinFar: -10,
          upperArmFar: 120,
          forearmFar: 30,
        }),
      ],
    },
  },
  {
    id: 'seated-forward-fold',
    name: 'Seated forward fold (R6)',
    aliases: [
      'Seated forward fold, knees bent over a bolster',
      'Pike and toe touch to the floor',
    ],
    what: 'Sitting with the knees bent over a bolster, folding forward from the hips with a long back.',
    cues: [
      'Fold from the hips, keep the back long.',
      'Knees stay bent over the bolster.',
      'Stop at any pulling behind the knee.',
    ],
    sequence: {
      label: 'Seated forward fold',
      duration: 3600,
      ground: 'floor',
      poses: [
        {
          spine: -84,
          neck: -84,
          head: -84,
          upperArm: 40,
          forearm: 30,
          thigh: 2,
          shin: 30,
          foot: -20,
          thighFar: 6,
          shinFar: 34,
          footFar: -16,
        },
        {
          spine: -50,
          neck: -50,
          head: -50,
          upperArm: 20,
          forearm: 10,
          thigh: 2,
          shin: 30,
          foot: -20,
          thighFar: 6,
          shinFar: 34,
          footFar: -16,
        },
        {
          spine: -24,
          neck: -20,
          head: -20,
          upperArm: 5,
          forearm: -5,
          thigh: 2,
          shin: 25,
          foot: -20,
          thighFar: 6,
          shinFar: 29,
          footFar: -16,
        },
        {
          spine: -50,
          neck: -50,
          head: -50,
          upperArm: 20,
          forearm: 10,
          thigh: 2,
          shin: 30,
          foot: -20,
          thighFar: 6,
          shinFar: 34,
          footFar: -16,
        },
      ],
    },
  },
];

/** Normalises a name so lookups survive punctuation and casing drift. */
function normalise(name: string): string {
  return name
    .toLowerCase()
    .replace(/\(.*?\)/g, ' ')
    .replace(/[^a-z0-9]+/g, ' ')
    .trim();
}

const BY_ALIAS = new Map<string, Movement>();
for (const movement of MOVEMENTS) {
  for (const alias of [movement.name, ...movement.aliases]) {
    BY_ALIAS.set(normalise(alias), movement);
  }
}

/**
 * Finds the movement an exercise line refers to, or null when it has no entry
 * yet. Callers render the info control only when this returns something.
 */
export function findMovement(exercise: string): Movement | null {
  return BY_ALIAS.get(normalise(exercise)) ?? null;
}

export function movementById(id: string): Movement | null {
  return MOVEMENTS.find((m) => m.id === id) ?? null;
}
