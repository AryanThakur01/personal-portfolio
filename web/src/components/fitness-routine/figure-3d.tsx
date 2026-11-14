import { useEffect, useRef } from 'react';
import * as THREE from 'three';
import { OrbitControls } from 'three/examples/jsm/controls/OrbitControls.js';
import type { Pose, PoseSequence } from '../../data/fitness';
import { measure } from './figure';

/**
 * A 3D figure driven by the same joint angles as the flat drawing.
 *
 * The body is built from capsules at runtime, so there is no model to license
 * or ship. Each limb hangs off its parent in a bone hierarchy, which means a
 * pose is applied by setting rotations rather than solving positions.
 *
 * Angle convention matches the 2D figure: degrees clockwise from "pointing
 * right" in the side view. That maps to a rotation about Z, with `*Twist`
 * angles rotating a limb out of that plane (about Y) for movements like side
 * plank, bird dog and Cossack squats.
 *
 * Loaded lazily by the modal: three.js is far too heavy to sit in the page's
 * initial chunk.
 */

const DEG = Math.PI / 180;

/** Segment lengths, matching the 2D figure's proportions. */
const LEN = {
  spine: 0.32,
  neck: 0.09,
  upperArm: 0.17,
  forearm: 0.16,
  thigh: 0.22,
  shin: 0.21,
  foot: 0.09,
};

const RAD = {
  torsoTop: 0.085,
  torsoBottom: 0.07,
  upperArm: 0.036,
  forearm: 0.029,
  thigh: 0.055,
  shin: 0.04,
  foot: 0.03,
  head: 0.082,
};

/**
 * A bone: a group rotated by the pose, holding a capsule that runs along its
 * local +X so the angle convention carries straight over from the 2D figure.
 */
function makeBone(
  length: number,
  radius: number,
  material: THREE.Material,
): { group: THREE.Group; tip: THREE.Group } {
  const group = new THREE.Group();

  const geometry = new THREE.CapsuleGeometry(radius, length, 6, 14);
  const mesh = new THREE.Mesh(geometry, material);
  // Capsules are built along Y, so lay it along X and push it half a length
  // out, leaving the group's origin at the joint.
  mesh.rotation.z = -Math.PI / 2;
  mesh.position.x = length / 2;
  mesh.castShadow = true;
  group.add(mesh);

  const tip = new THREE.Group();
  tip.position.x = length;
  group.add(tip);

  return { group, tip };
}

interface Rig {
  root: THREE.Group;
  bones: Record<string, THREE.Group>;
}

function buildRig(
  near: THREE.Material,
  far: THREE.Material,
  skin: THREE.Material,
): Rig {
  const root = new THREE.Group();
  const bones: Record<string, THREE.Group> = {};

  const spine = makeBone(LEN.spine, RAD.torsoTop, skin);
  bones.spine = spine.group;
  root.add(spine.group);

  const neck = makeBone(LEN.neck, RAD.torsoBottom * 0.5, skin);
  bones.neck = neck.group;
  spine.tip.add(neck.group);

  const head = new THREE.Mesh(new THREE.SphereGeometry(RAD.head, 20, 16), skin);
  head.castShadow = true;
  neck.tip.add(head);

  // Arms and legs, near side then far side.
  for (const side of ['', 'Far'] as const) {
    const material = side === '' ? near : far;

    const upperArm = makeBone(LEN.upperArm, RAD.upperArm, material);
    bones[`upperArm${side}`] = upperArm.group;
    spine.tip.add(upperArm.group);

    const forearm = makeBone(LEN.forearm, RAD.forearm, material);
    bones[`forearm${side}`] = forearm.group;
    upperArm.tip.add(forearm.group);

    const hand = new THREE.Mesh(
      new THREE.SphereGeometry(RAD.forearm * 1.3, 12, 10),
      material,
    );
    forearm.tip.add(hand);

    const thigh = makeBone(LEN.thigh, RAD.thigh, material);
    bones[`thigh${side}`] = thigh.group;
    root.add(thigh.group);

    const shin = makeBone(LEN.shin, RAD.shin, material);
    bones[`shin${side}`] = shin.group;
    thigh.tip.add(shin.group);

    const foot = makeBone(LEN.foot, RAD.foot, material);
    bones[`foot${side}`] = foot.group;
    shin.tip.add(foot.group);
  }

  // Offset the two sides in depth so they read as separate limbs.
  for (const key of ['upperArm', 'thigh']) {
    bones[key].position.z = 0.075;
    bones[`${key}Far`].position.z = -0.075;
  }

  return { root, bones };
}

/** Child bones rotate relative to their parent, as in the 2D figure. */
const PARENT: Record<string, keyof Pose | null> = {
  spine: null,
  neck: 'spine',
  upperArm: 'spine',
  forearm: 'upperArm',
  upperArmFar: 'spine',
  forearmFar: 'upperArmFar',
  thigh: null,
  shin: 'thigh',
  foot: 'shin',
  thighFar: null,
  shinFar: 'thighFar',
  footFar: 'shinFar',
};

const TWIST: Record<string, keyof Pose> = {
  upperArm: 'upperArmTwist',
  upperArmFar: 'upperArmFarTwist',
  thigh: 'thighTwist',
  thighFar: 'thighFarTwist',
  spine: 'spineTwist',
};

function applyPose(rig: Rig, pose: Pose) {
  for (const [name, bone] of Object.entries(rig.bones)) {
    const key = name as keyof Pose;
    const parentKey = PARENT[name];

    const absolute = pose[key];
    if (absolute === undefined) continue;

    const parent = parentKey ? (pose[parentKey] ?? 0) : 0;
    bone.rotation.z = (absolute - parent) * DEG;

    const twistKey = TWIST[name];
    bone.rotation.y = twistKey ? (pose[twistKey] ?? 0) * DEG : 0;
  }
}

const ease = (u: number) => u * u * (3 - 2 * u);

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
  'spineTwist',
  'upperArmTwist',
  'upperArmFarTwist',
  'thighTwist',
  'thighFarTwist',
];

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
    const f = from ?? to ?? 0;
    const g = to ?? from ?? 0;
    out[key] = f + (g - f) * u;
  }

  return out;
}

export function Figure3D({
  sequence,
  className,
}: {
  sequence: PoseSequence;
  className?: string;
}) {
  const host = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const mount = host.current;
    if (!mount) return;

    const scene = new THREE.Scene();

    // The flat view's measurement, converted to scene units. SVG y grows
    // downward and three.js y grows upward, hence the sign flip.
    const b = measure(sequence.poses);
    const S = 0.01;
    const lowest = -b.maxY * S;
    const highest = -b.minY * S;
    const centreY = (lowest + highest) / 2;
    const centreX = ((b.minX + b.maxX) / 2) * S;
    const span = Math.max(b.maxX - b.minX, b.maxY - b.minY) * S;

    const camera = new THREE.PerspectiveCamera(38, 1, 0.1, 50);
    // Far enough back to hold the whole movement, with a little headroom.
    const distance = Math.max(span * 1.45, 1.0);
    const view = sequence.camera;
    if (view) {
      camera.position.set(view[0], view[1], view[2]);
    } else {
      // Mostly side-on with a slight three-quarter turn, near eye level, so
      // the movement reads rather than being looked down on.
      camera.position.set(distance * 0.42, centreY + span * 0.14, distance);
    }

    const renderer = new THREE.WebGLRenderer({
      antialias: true,
      alpha: true,
    });
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.shadowMap.enabled = true;
    renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    mount.appendChild(renderer.domElement);

    const controls = new OrbitControls(camera, renderer.domElement);
    controls.enableDamping = true;
    controls.enablePan = false;
    controls.minDistance = Math.max(span * 1.1, 0.9);
    controls.maxDistance = Math.max(span * 4, 4);
    controls.target.set(0, centreY, 0);

    // Lighting: a key light casting shadow, plus fill so the far side is read-
    // able rather than black.
    const key = new THREE.DirectionalLight(0xffffff, 2.2);
    key.position.set(2.5, 4, 3);
    key.castShadow = true;
    key.shadow.mapSize.set(1024, 1024);
    key.shadow.camera.near = 0.5;
    key.shadow.camera.far = 12;
    scene.add(key);
    scene.add(new THREE.AmbientLight(0x6fd8ec, 0.5));
    const rim = new THREE.DirectionalLight(0x22d3ee, 0.9);
    rim.position.set(-3, 1.5, -2);
    scene.add(rim);

    const skin = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      roughness: 0.45,
      metalness: 0.05,
    });
    const near = new THREE.MeshStandardMaterial({
      color: 0x22d3ee,
      roughness: 0.45,
      metalness: 0.05,
    });
    const far = new THREE.MeshStandardMaterial({
      color: 0x1193ad,
      roughness: 0.55,
      metalness: 0.05,
    });

    const rig = buildRig(near, far, skin);
    // The rig is built at the hip; shift it so the movement sits over the grid.
    rig.root.position.x = -centreX;
    scene.add(rig.root);

    // Ground sits under the movement's lowest point, so nothing floats.
    const groundY = sequence.groundY ?? lowest - 0.02;
    const ground = new THREE.Mesh(
      new THREE.PlaneGeometry(6, 6),
      new THREE.ShadowMaterial({ opacity: 0.35 }),
    );
    ground.rotation.x = -Math.PI / 2;
    ground.position.y = groundY;
    ground.receiveShadow = true;
    scene.add(ground);

    const grid = new THREE.GridHelper(4, 16, 0x1f1f1f, 0x161616);
    grid.position.y = groundY + 0.001;
    scene.add(grid);

    const resize = () => {
      const { clientWidth: w, clientHeight: h } = mount;
      if (!w || !h) return;
      renderer.setSize(w, h, false);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    resize();
    const observer = new ResizeObserver(resize);
    observer.observe(mount);

    const reduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;

    let raf = 0;
    const start = performance.now();

    const tick = (now: number) => {
      const t = reduced
        ? 0.5
        : ((now - start) % sequence.duration) / sequence.duration;
      applyPose(rig, poseAt(sequence.poses, t));
      controls.update();
      renderer.render(scene, camera);
      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      controls.dispose();
      renderer.dispose();
      scene.traverse((obj) => {
        if (obj instanceof THREE.Mesh) {
          obj.geometry.dispose();
        }
      });
      [skin, near, far].forEach((m) => m.dispose());
      mount.removeChild(renderer.domElement);
    };
  }, [sequence]);

  return <div ref={host} className={className} aria-label={sequence.label} />;
}
