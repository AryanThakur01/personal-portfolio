import { useEffect, useMemo, useRef, useState } from 'react';
import type { Pose, PoseSequence } from '../../data/fitness';

/**
 * A side-view figure animated through a sequence of poses.
 *
 * Joint positions are solved in JavaScript each frame (forward kinematics),
 * which buys two things a declarative SVG animation could not: limbs drawn
 * with real thickness, and a frame fitted to the movement rather than guessed.
 * Props (floor, bar, bench) are placed from the figure's own geometry, so the
 * bar always sits where the hands actually are.
 *
 * Angles are degrees clockwise from "pointing right", matching SVG screen
 * space: 90 is straight down, -90 straight up, 180 pointing left.
 */

/** Segment lengths, proportioned to a human side view. */
const LEN = {
  spine: 32,
  neck: 8,
  upperArm: 17,
  forearm: 16,
  thigh: 22,
  shin: 21,
  foot: 8,
};

/** Stroke widths, thicker nearer the body's core. */
const W = {
  torso: 15,
  upperArm: 7,
  forearm: 5.5,
  thigh: 10.5,
  shin: 7.5,
  foot: 5,
  head: 7.5,
};

type Vec = { x: number; y: number };

const rad = (deg: number) => (deg * Math.PI) / 180;

function step(from: Vec, angle: number, length: number): Vec {
  return {
    x: from.x + Math.cos(rad(angle)) * length,
    y: from.y + Math.sin(rad(angle)) * length,
  };
}

interface Joints {
  hip: Vec;
  shoulder: Vec;
  head: Vec;
  elbow: Vec;
  hand: Vec;
  knee: Vec;
  ankle: Vec;
  toe: Vec;
  elbowFar: Vec;
  handFar: Vec;
  kneeFar: Vec;
  ankleFar: Vec;
  toeFar: Vec;
}

/** Solves every joint position for one pose, with the hip at the origin. */
function solve(pose: Pose): Joints {
  const hip: Vec = { x: 0, y: 0 };

  const spine = pose.spine ?? -90;
  const shoulder = step(hip, spine, LEN.spine);
  const head = step(shoulder, pose.neck ?? spine, LEN.neck);

  const upperArm = pose.upperArm ?? 90;
  const elbow = step(shoulder, upperArm, LEN.upperArm);
  const hand = step(elbow, pose.forearm ?? upperArm, LEN.forearm);

  // The far arm mirrors the near one unless a pose says otherwise.
  const upperArmFar = pose.upperArmFar ?? upperArm;
  const elbowFar = step(shoulder, upperArmFar, LEN.upperArm);
  const handFar = step(
    elbowFar,
    pose.forearmFar ?? pose.forearm ?? upperArmFar,
    LEN.forearm,
  );

  const thigh = pose.thigh ?? 90;
  const knee = step(hip, thigh, LEN.thigh);
  const ankle = step(knee, pose.shin ?? thigh, LEN.shin);
  const toe = step(ankle, pose.foot ?? 0, LEN.foot);

  const thighFar = pose.thighFar ?? thigh;
  const kneeFar = step(hip, thighFar, LEN.thigh);
  const ankleFar = step(kneeFar, pose.shinFar ?? thighFar, LEN.shin);
  const toeFar = step(ankleFar, pose.footFar ?? pose.foot ?? 0, LEN.foot);

  return {
    hip,
    shoulder,
    head,
    elbow,
    hand,
    knee,
    ankle,
    toe,
    elbowFar,
    handFar,
    kneeFar,
    ankleFar,
    toeFar,
  };
}

const ANGLE_KEYS: (keyof Pose)[] = [
  'spine',
  'neck',
  'head',
  'upperArm',
  'forearm',
  'upperArmFar',
  'forearmFar',
  'thigh',
  'shin',
  'foot',
  'thighFar',
  'shinFar',
  'footFar',
];

/** Ease in and out, so reps start and finish softly rather than ticking. */
const ease = (u: number) => u * u * (3 - 2 * u);

/** The pose at normalised time `t`, looping back to the first frame. */
function poseAt(poses: Pose[], t: number): Pose {
  const loop = [...poses, poses[0]];
  const spans = loop.length - 1;
  const scaled = Math.min(Math.max(t, 0), 0.999999) * spans;
  const i = Math.floor(scaled);
  const u = ease(scaled - i);

  const a = loop[i];
  const b = loop[i + 1];
  const out: Pose = {};

  for (const key of ANGLE_KEYS) {
    const from = a[key];
    const to = b[key];
    if (from === undefined && to === undefined) continue;
    // A joint given on only one frame holds that value rather than snapping.
    const f = from ?? to ?? 0;
    const g = to ?? from ?? 0;
    out[key] = f + (g - f) * u;
  }

  return out;
}

/** A bone, drawn as a rounded stroke. */
function Bone({
  from,
  to,
  width,
  className,
}: {
  from: Vec;
  to: Vec;
  width: number;
  className: string;
}) {
  return (
    <line
      x1={from.x}
      y1={from.y}
      x2={to.x}
      y2={to.y}
      strokeWidth={width}
      strokeLinecap="round"
      className={className}
    />
  );
}

/** The torso, drawn as a filled shape so the body reads as a body. */
function Torso({ joints }: { joints: Joints }) {
  const { hip, shoulder } = joints;
  const dx = shoulder.x - hip.x;
  const dy = shoulder.y - hip.y;
  const len = Math.hypot(dx, dy) || 1;
  // Unit normal, giving the torso width along its length.
  const nx = -dy / len;
  const ny = dx / len;

  const hipW = W.torso * 0.42;
  const chestW = W.torso * 0.54;

  const p = (v: Vec, n: number) => `${v.x + nx * n},${v.y + ny * n}`;

  return (
    <path
      d={`M ${p(hip, hipW)} L ${p(shoulder, chestW)} L ${p(shoulder, -chestW)} L ${p(hip, -hipW)} Z`}
      className="fig-torso"
      strokeLinejoin="round"
    />
  );
}

function Body({ joints }: { joints: Joints }) {
  return (
    <>
      {/* Far side first, so the near limbs read as being in front. */}
      <Bone
        from={joints.hip}
        to={joints.kneeFar}
        width={W.thigh}
        className="fig-far"
      />
      <Bone
        from={joints.kneeFar}
        to={joints.ankleFar}
        width={W.shin}
        className="fig-far"
      />
      <Bone
        from={joints.ankleFar}
        to={joints.toeFar}
        width={W.foot}
        className="fig-far"
      />
      <Bone
        from={joints.shoulder}
        to={joints.elbowFar}
        width={W.upperArm}
        className="fig-far"
      />
      <Bone
        from={joints.elbowFar}
        to={joints.handFar}
        width={W.forearm}
        className="fig-far"
      />

      <Torso joints={joints} />

      <circle
        cx={joints.head.x}
        cy={joints.head.y}
        r={W.head}
        className="fig-head"
      />

      <Bone
        from={joints.hip}
        to={joints.knee}
        width={W.thigh}
        className="fig-near"
      />
      <Bone
        from={joints.knee}
        to={joints.ankle}
        width={W.shin}
        className="fig-near"
      />
      <Bone
        from={joints.ankle}
        to={joints.toe}
        width={W.foot}
        className="fig-near"
      />
      <Bone
        from={joints.shoulder}
        to={joints.elbow}
        width={W.upperArm}
        className="fig-near"
      />
      <Bone
        from={joints.elbow}
        to={joints.hand}
        width={W.forearm}
        className="fig-near"
      />

      {/* Hands, so the ends of the arms are legible against the props. */}
      <circle
        cx={joints.handFar.x}
        cy={joints.handFar.y}
        r={3}
        className="fig-end-far"
      />
      <circle
        cx={joints.hand.x}
        cy={joints.hand.y}
        r={3.4}
        className="fig-end"
      />
    </>
  );
}

/** Everything needed to frame the movement and place its props. */
function measure(poses: Pose[]) {
  const all = poses.map(solve);
  const points = all.flatMap((j) => Object.values(j) as Vec[]);

  const xs = points.map((p) => p.x);
  const ys = points.map((p) => p.y);

  return {
    minX: Math.min(...xs),
    maxX: Math.max(...xs),
    minY: Math.min(...ys),
    maxY: Math.max(...ys),
    /** Highest the hands reach, used to hang a bar from them. */
    handY: Math.min(...all.map((j) => j.hand.y)),
    handX: all[0].hand.x,
  };
}

export function Figure({
  sequence,
  className,
}: {
  sequence: PoseSequence;
  className?: string;
}) {
  const { poses, duration, ground } = sequence;

  const bounds = useMemo(() => measure(poses), [poses]);

  const reduced =
    typeof window !== 'undefined' &&
    typeof window.matchMedia === 'function' &&
    window.matchMedia('(prefers-reduced-motion: reduce)').matches;

  const [t, setT] = useState(reduced ? 0.5 : 0);
  const frame = useRef(0);

  useEffect(() => {
    // Reduced motion holds a representative frame rather than looping.
    if (reduced) return;

    const start = performance.now();
    const loop = (now: number) => {
      setT(((now - start) % duration) / duration);
      frame.current = requestAnimationFrame(loop);
    };
    frame.current = requestAnimationFrame(loop);

    return () => cancelAnimationFrame(frame.current);
  }, [duration, reduced]);

  const joints = solve(poseAt(poses, t));

  // Padded generously, so limb thickness never clips at the edges.
  const pad = 18;
  const x = bounds.minX - pad;
  const y = bounds.minY - pad;
  const w = bounds.maxX - bounds.minX + pad * 2;
  const h = bounds.maxY - bounds.minY + pad * 2;

  const floorY = bounds.maxY + 5;
  const barY = bounds.handY;

  return (
    <svg
      viewBox={`${x} ${y} ${w} ${h}`}
      className={className}
      role="img"
      preserveAspectRatio="xMidYMid meet"
      aria-label={sequence.label}>
      <style>{`
        .fig-near    { stroke: var(--color-accent); fill: none; }
        .fig-far     { stroke: #15657d; fill: none; }
        .fig-torso   { fill: rgba(6,182,212,0.20); stroke: var(--color-accent); stroke-width: 2.5; }
        .fig-head    { fill: rgba(6,182,212,0.20); stroke: var(--color-accent); stroke-width: 2.5; }
        .fig-end     { fill: var(--color-accent); }
        .fig-end-far { fill: #15657d; }
        .fig-prop    { stroke: var(--color-border-hover); stroke-width: 2.5; stroke-linecap: round; fill: none; }
        .fig-prop-fill { fill: rgba(255,255,255,0.03); stroke: var(--color-border-hover); stroke-width: 2.5; }
      `}</style>

      {ground === 'floor' && (
        <line
          x1={x + 5}
          y1={floorY}
          x2={x + w - 5}
          y2={floorY}
          className="fig-prop"
        />
      )}

      {ground === 'bar' && (
        <line
          x1={x + 5}
          y1={barY}
          x2={x + w - 5}
          y2={barY}
          className="fig-prop"
        />
      )}

      {ground === 'bars' && (
        <>
          <line
            x1={bounds.handX - 30}
            y1={barY}
            x2={bounds.handX - 7}
            y2={barY}
            className="fig-prop"
          />
          <line
            x1={bounds.handX + 7}
            y1={barY}
            x2={bounds.handX + 30}
            y2={barY}
            className="fig-prop"
          />
          <line
            x1={x + 5}
            y1={floorY}
            x2={x + w - 5}
            y2={floorY}
            className="fig-prop"
          />
        </>
      )}

      {ground === 'wall' && (
        <>
          <line
            x1={x + 9}
            y1={y + 5}
            x2={x + 9}
            y2={floorY}
            className="fig-prop"
          />
          <line
            x1={x + 9}
            y1={floorY}
            x2={x + w - 5}
            y2={floorY}
            className="fig-prop"
          />
        </>
      )}

      {ground === 'box' && (
        <>
          <rect
            x={bounds.maxX - 32}
            y={floorY - 21}
            width={36}
            height={21}
            className="fig-prop-fill"
          />
          <line
            x1={x + 5}
            y1={floorY}
            x2={x + w - 5}
            y2={floorY}
            className="fig-prop"
          />
        </>
      )}

      <Body joints={joints} />
    </svg>
  );
}
