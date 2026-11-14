import * as THREE from 'three';
import {
  BODY,
  ease,
  lerp,
  type ExercisePose,
  type PropName,
  type Vec2,
} from './types';

/**
 * The stage: lighting, props and the body renderer.
 *
 * The figure is drawn as chains of overlapping spheres whose radius varies
 * along each limb, which gives tapered, muscled shapes rather than sticks.
 * Nothing is loaded from disk, so there is no model to license or ship.
 */

/**
 * Anatomical range of the middle joint, in degrees of flexion from straight.
 *
 * A knee flexes to about 140 and a human one does not go past straight; an
 * elbow is about 145 with a few degrees of carrying extension. Clamping to
 * these stops a target that is out of reach from producing a joint angle no
 * body could make.
 */
export const JOINT_RANGE = {
  knee: { min: 2, max: 142 },
  elbow: { min: 3, max: 146 },
} as const;

/**
 * Two-bone IK in the xy plane. `pole` decides which way the middle joint
 * (knee or elbow) bends, so limbs never hyperextend or snap inside out, and
 * `range` keeps the flexion inside what the joint can actually do.
 */
export function ik(
  a: Vec2,
  b: Vec2,
  l1: number,
  l2: number,
  pole: Vec2,
  range: { min: number; max: number } = JOINT_RANGE.knee,
): { joint: Vec2; end: Vec2 } {
  const dx = b[0] - a[0];
  const dy = b[1] - a[1];
  const full = Math.hypot(dx, dy) || 1e-6;
  const ux = dx / full;
  const uy = dy / full;

  // Convert the joint's flexion limits into the span the limb may cover, via
  // the cosine rule, then clamp the reach into that span. This is what keeps
  // an unreachable target from hyperextending a knee or folding an elbow
  // further than it goes.
  const spanAt = (flexDeg: number) => {
    const interior = Math.PI - flexDeg * (Math.PI / 180);
    return Math.sqrt(
      Math.max(0, l1 * l1 + l2 * l2 - 2 * l1 * l2 * Math.cos(interior)),
    );
  };

  const maxSpan = Math.min(spanAt(range.min), l1 + l2 - 0.001);
  const minSpan = Math.max(spanAt(range.max), Math.abs(l1 - l2) + 0.001);

  let d = Math.min(full, maxSpan);
  d = Math.max(d, minSpan);

  const aa = (l1 * l1 - l2 * l2 + d * d) / (2 * d);
  const h = Math.sqrt(Math.max(0, l1 * l1 - aa * aa));

  let px = -uy;
  let py = ux;
  if (px * pole[0] + py * pole[1] < 0) {
    px = -px;
    py = -py;
  }

  return {
    joint: [a[0] + ux * aa + px * h, a[1] + uy * aa + py * h],
    end: [a[0] + ux * d, a[1] + uy * d],
  };
}

/** Eased interpolation through a list of [position, value] stops. */
function interp(points: Vec2[], s: number): number {
  for (let i = 1; i < points.length; i++) {
    if (s <= points[i][0]) {
      const a = points[i - 1];
      const b = points[i];
      return lerp(a[1], b[1], ease((s - a[0]) / (b[0] - a[0])));
    }
  }
  return points[points.length - 1][1];
}

type Vec3 = [number, number, number];

export class Stage {
  readonly scene: THREE.Scene;
  readonly camera: THREE.PerspectiveCamera;
  readonly renderer: THREE.WebGLRenderer;
  readonly props: Partial<Record<PropName, THREE.Object3D>> = {};

  readonly cam = {
    az: 0.6,
    azTarget: 0.6,
    target: [0, 0.85, 0] as Vec3,
    radius: 4.3,
    elevation: 0.14,
  };

  private readonly mats: Record<string, THREE.MeshStandardMaterial>;
  private readonly sphere: THREE.SphereGeometry;
  private pool: THREE.Mesh[] = [];
  private used = 0;
  private detach: () => void;

  constructor(private host: HTMLElement) {
    const w = host.clientWidth || 640;
    const h = host.clientHeight || 420;

    this.renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    // If the context could not be created there is nothing to draw; the
    // caller falls back to the flat figure rather than showing an empty box.
    if (!this.renderer.getContext()) {
      throw new Error('WebGL unavailable');
    }
    this.renderer.setPixelRatio(Math.min(window.devicePixelRatio || 1, 2));
    this.renderer.setSize(w, h);
    this.renderer.shadowMap.enabled = true;
    this.renderer.shadowMap.type = THREE.PCFSoftShadowMap;
    const canvas = this.renderer.domElement;
    canvas.style.display = 'block';
    canvas.style.width = '100%';
    canvas.style.height = '100%';
    host.appendChild(canvas);

    this.scene = new THREE.Scene();
    this.camera = new THREE.PerspectiveCamera(34, w / h, 0.1, 60);

    this.scene.add(new THREE.HemisphereLight(0xffffff, 0x6a7a85, 0.95));
    const sun = new THREE.DirectionalLight(0xffffff, 1.0);
    sun.position.set(2.5, 5, 3.5);
    sun.castShadow = true;
    sun.shadow.mapSize.set(1024, 1024);
    Object.assign(sun.shadow.camera, {
      left: -3,
      right: 3,
      top: 3,
      bottom: -3,
      near: 1,
      far: 14,
    });
    sun.shadow.camera.updateProjectionMatrix();
    this.scene.add(sun);

    const floor = new THREE.Mesh(
      new THREE.PlaneGeometry(12, 12),
      new THREE.ShadowMaterial({ opacity: 0.3 }),
    );
    floor.rotation.x = -Math.PI / 2;
    floor.receiveShadow = true;
    this.scene.add(floor);

    const disc = new THREE.Mesh(
      new THREE.CircleGeometry(1.9, 64),
      new THREE.MeshBasicMaterial({
        color: 0x22d3ee,
        transparent: true,
        opacity: 0.07,
      }),
    );
    disc.rotation.x = -Math.PI / 2;
    disc.position.y = 0.002;
    this.scene.add(disc);

    const mat = (c: number, r = 0.7) =>
      new THREE.MeshStandardMaterial({ color: c, roughness: r, metalness: 0 });

    this.mats = {
      skin: mat(0xc99572, 0.6),
      shirt: mat(0x2a7d91),
      shorts: mat(0x1f2937),
      shoe: mat(0xeeeeee, 0.5),
      hair: mat(0x2b2018, 0.8),
    };

    this.buildProps();

    this.sphere = new THREE.SphereGeometry(1, 16, 12);
    this.detach = this.bindDrag();
  }

  private buildProps() {
    const metal = new THREE.MeshStandardMaterial({
      color: 0x9aa0a6,
      metalness: 0.6,
      roughness: 0.35,
    });
    const cyl = (r: number, h: number, m: THREE.Material) => {
      const x = new THREE.Mesh(new THREE.CylinderGeometry(r, r, h, 18), m);
      x.castShadow = true;
      return x;
    };

    const rig = new THREE.Group();
    const bar = cyl(0.016, 1.5, metal);
    bar.rotation.x = Math.PI / 2;
    bar.position.set(0, 2.2, 0);
    rig.add(bar);
    [-0.75, 0.75].forEach((z) => {
      const p = cyl(0.03, 2.25, metal);
      p.position.set(0, 1.125, z);
      rig.add(p);
    });
    this.props.pullupRig = rig;

    const bell = new THREE.Group();
    const rod = cyl(0.014, 1.7, metal);
    rod.rotation.x = Math.PI / 2;
    bell.add(rod);
    const plate = new THREE.MeshStandardMaterial({
      color: 0x2a2a2a,
      roughness: 0.5,
    });
    [-1, 1].forEach((sd) =>
      [0.6, 0.64].forEach((z) => {
        const pl = cyl(0.225, 0.03, plate);
        pl.rotation.x = Math.PI / 2;
        pl.position.z = sd * z;
        bell.add(pl);
      }),
    );
    this.props.barbell = bell;

    // Parallel bars for dips and support holds.
    const dip = new THREE.Group();
    [-0.3, 0.3].forEach((z) => {
      const b = cyl(0.022, 1.3, metal);
      b.rotation.z = Math.PI / 2;
      b.position.set(0, 1.0, z);
      dip.add(b);
      [-0.5, 0.5].forEach((x) => {
        const leg = cyl(0.026, 1.0, metal);
        leg.position.set(x, 0.5, z);
        dip.add(leg);
      });
    });
    this.props.dipBars = dip;

    // A knee-height box for squats and step-ups.
    const box = new THREE.Mesh(
      new THREE.BoxGeometry(0.5, 0.45, 0.6),
      new THREE.MeshStandardMaterial({ color: 0x33414d, roughness: 0.8 }),
    );
    box.position.set(-0.52, 0.225, 0);
    box.castShadow = true;
    box.receiveShadow = true;
    this.props.box = box;

    const wall = new THREE.Mesh(
      new THREE.BoxGeometry(0.12, 2.4, 2.2),
      new THREE.MeshStandardMaterial({ color: 0x2a2f36, roughness: 0.9 }),
    );
    wall.position.set(0.95, 1.2, 0);
    wall.receiveShadow = true;
    this.props.wall = wall;

    Object.values(this.props).forEach((p) => {
      p.visible = false;
      this.scene.add(p);
    });
  }

  private bindDrag(): () => void {
    let dragging = false;
    let lastX = 0;
    const h = this.host;

    const down = (e: PointerEvent) => {
      dragging = true;
      lastX = e.clientX;
      h.style.cursor = 'grabbing';
      h.setPointerCapture(e.pointerId);
    };
    const move = (e: PointerEvent) => {
      if (!dragging) return;
      this.cam.az += (e.clientX - lastX) * 0.01;
      this.cam.azTarget = this.cam.az;
      lastX = e.clientX;
    };
    const up = () => {
      dragging = false;
      h.style.cursor = 'grab';
    };

    h.style.cursor = 'grab';
    h.addEventListener('pointerdown', down);
    h.addEventListener('pointermove', move);
    h.addEventListener('pointerup', up);
    h.addEventListener('pointercancel', up);

    return () => {
      h.removeEventListener('pointerdown', down);
      h.removeEventListener('pointermove', move);
      h.removeEventListener('pointerup', up);
      h.removeEventListener('pointercancel', up);
    };
  }

  /** One sphere from the pool, so a frame allocates nothing. */
  private blob(
    x: number,
    y: number,
    z: number,
    rx: number,
    ry: number,
    rz: number,
    rot: number,
    material: THREE.Material,
  ) {
    let o = this.pool[this.used];
    if (!o) {
      o = new THREE.Mesh(this.sphere, material);
      o.castShadow = true;
      this.scene.add(o);
      this.pool[this.used] = o;
    }
    this.used++;
    o.material = material;
    o.position.set(x, y, z);
    o.scale.set(rx, ry, rz);
    o.rotation.set(0, 0, rot);
    o.visible = true;
  }

  /** A tapered limb built from overlapping spheres between two points. */
  private limb(
    a: Vec3,
    b: Vec3,
    radiusAt: (s: number) => number,
    m1: THREE.Material,
    m2: THREE.Material,
    split: number,
  ) {
    const dx = b[0] - a[0];
    const dy = b[1] - a[1];
    const dz = b[2] - a[2];
    const n = Math.max(4, Math.ceil(Math.hypot(dx, dy, dz) / 0.035));
    for (let i = 0; i <= n; i++) {
      const s = i / n;
      const r = radiusAt(s);
      this.blob(
        a[0] + dx * s,
        a[1] + dy * s,
        a[2] + dz * s,
        r,
        r,
        r,
        0,
        s < split ? m1 : m2,
      );
    }
  }

  private torso(p: Vec2, s: Vec2, breath: number) {
    const { shirt, shorts } = this.mats;
    const WIDTH: Vec2[] = [
      [0, 0.145],
      [0.3, 0.125],
      [0.7, 0.183],
      [0.88, 0.18],
      [1, 0.14],
    ];
    const DEPTH: Vec2[] = [
      [0, 0.1],
      [0.3, 0.085],
      [0.7, 0.115],
      [1, 0.085],
    ];

    const dx = s[0] - p[0];
    const dy = s[1] - p[1];
    const rot = Math.atan2(-dx, dy);
    const n = 10;

    for (let i = 0; i < n; i++) {
      const t = i / (n - 1);
      let w = interp(WIDTH, t);
      let d = interp(DEPTH, t);
      if (t > 0.5) {
        w *= breath;
        d *= 1 + (breath - 1) * 1.6;
      }
      this.blob(
        p[0] + dx * t,
        p[1] + dy * t,
        0,
        d,
        0.075,
        w,
        rot,
        t < 0.2 ? shorts : shirt,
      );
    }
  }

  /** Draws one frame of the figure from a pose. */
  drawFigure(p: ExercisePose, breath: number) {
    this.used = 0;
    const { skin, shirt, shorts, shoe, hair } = this.mats;

    const thigh = (s: number) =>
      lerp(0.092, 0.056, s) + 0.012 * Math.sin(Math.PI * s);
    const calf = (s: number) =>
      lerp(0.055, 0.036, s) + 0.016 * Math.sin(Math.PI * Math.min(1, s * 1.5));
    const upper = (s: number) =>
      lerp(0.052, 0.04, s) + 0.012 * Math.sin(Math.PI * s);
    const fore = (s: number) =>
      lerp(0.043, 0.028, s) + 0.008 * Math.sin(Math.PI * Math.min(1, s * 1.4));
    const foot = (s: number) => lerp(0.048, 0.03, s);

    this.torso(p.pelvis, p.shoulders, breath);

    for (const sd of [1, -1]) {
      // The far side can carry its own targets, for asymmetric movements.
      const near = sd === 1;
      const ankleT = near ? p.ankle : (p.ankleFar ?? p.ankle);
      const toeT = near ? p.toe : (p.toeFar ?? p.toe);
      const kneeP = near ? p.kneePole : (p.kneePoleFar ?? p.kneePole);
      const handT = near ? p.hand : (p.handFar ?? p.hand);
      const elbowP = near ? p.elbowPole : (p.elbowPoleFar ?? p.elbowPole);

      const leg = ik(
        p.pelvis,
        ankleT,
        BODY.thigh,
        BODY.shin,
        kneeP,
        JOINT_RANGE.knee,
      );
      const hip: Vec3 = [p.pelvis[0], p.pelvis[1], sd * 0.09];
      const knee: Vec3 = [
        leg.joint[0],
        leg.joint[1],
        sd * (0.09 + (p.footZ - 0.09) * 0.5 + (p.kneeOut ?? 0)),
      ];
      const ankle: Vec3 = [leg.end[0], leg.end[1], sd * p.footZ];
      const toe: Vec3 = [toeT[0], toeT[1], sd * (p.footZ + 0.01)];

      this.limb(hip, knee, thigh, shorts, skin, 0.38);
      this.limb(knee, ankle, calf, skin, skin, 1);
      this.limb(ankle, toe, foot, shoe, shoe, 1);
      this.blob(ankle[0], ankle[1], ankle[2], 0.052, 0.052, 0.05, 0, shoe);

      const sh: Vec3 = [p.shoulders[0], p.shoulders[1], sd * 0.19];
      const arm = ik(p.shoulders, handT, BODY.upperArm, BODY.forearm, elbowP);
      const elbow: Vec3 = [
        arm.joint[0],
        arm.joint[1],
        sd * (0.2 + (p.elbowFlare ?? 0)),
      ];
      const hand: Vec3 = [arm.end[0], arm.end[1], sd * p.handZ];

      this.blob(sh[0], sh[1], sh[2], 0.068, 0.068, 0.068, 0, shirt);
      this.limb(sh, elbow, upper, shirt, skin, 0.3);
      this.limb(elbow, hand, fore, skin, skin, 1);
      this.blob(hand[0], hand[1], hand[2], 0.036, 0.046, 0.03, 0, skin);

      if (sd === 1) p._handPoint = hand;
    }

    // Head: neck chain, skull, hair and a nose to show which way it faces.
    const a = p.headAngle;
    const H: Vec2 = [
      p.shoulders[0] + 0.24 * Math.sin(a),
      p.shoulders[1] + 0.24 * Math.cos(a),
    ];
    const rt = -a;
    const cr = Math.cos(rt);
    const sr = Math.sin(rt);
    const local = (x: number, y: number): Vec2 => [
      H[0] + x * cr - y * sr,
      H[1] + x * sr + y * cr,
    ];

    for (let i = 1; i <= 3; i++) {
      const s = i / 4;
      this.blob(
        lerp(p.shoulders[0], H[0], s),
        lerp(p.shoulders[1], H[1], s),
        0,
        0.05,
        0.05,
        0.05,
        0,
        skin,
      );
    }
    this.blob(H[0], H[1], 0, 0.095, 0.115, 0.088, rt, skin);
    const hp = local(-0.018, 0.028);
    this.blob(hp[0], hp[1], 0, 0.1, 0.113, 0.092, rt, hair);
    const ns = local(0.098, -0.012);
    this.blob(ns[0], ns[1], 0, 0.016, 0.022, 0.02, rt, skin);

    for (let j = this.used; j < this.pool.length; j++) {
      this.pool[j].visible = false;
    }
  }

  showProps(names: PropName[]) {
    (Object.keys(this.props) as PropName[]).forEach((name) => {
      const obj = this.props[name];
      if (obj) obj.visible = names.includes(name);
    });
  }

  updateCamera(focus: { target: Vec3; radius: number }) {
    const c = this.cam;
    c.az += (c.azTarget - c.az) * 0.06;
    for (let i = 0; i < 3; i++) {
      c.target[i] += (focus.target[i] - c.target[i]) * 0.06;
    }
    c.radius += (focus.radius - c.radius) * 0.06;

    const ce = Math.cos(c.elevation);
    this.camera.position.set(
      c.target[0] + Math.sin(c.az) * ce * c.radius,
      c.target[1] + Math.sin(c.elevation) * c.radius,
      c.target[2] + Math.cos(c.az) * ce * c.radius,
    );
    this.camera.lookAt(c.target[0], c.target[1], c.target[2]);
  }

  resize() {
    const w = this.host.clientWidth;
    const h = this.host.clientHeight;
    if (!w || !h) return;
    this.renderer.setSize(w, h);
    this.camera.aspect = w / h;
    this.camera.updateProjectionMatrix();
  }

  render() {
    this.renderer.render(this.scene, this.camera);
  }

  dispose() {
    this.detach();
    this.sphere.dispose();
    Object.values(this.mats).forEach((m) => m.dispose());
    this.scene.traverse((o) => {
      if (o instanceof THREE.Mesh) {
        if (o.geometry !== this.sphere) o.geometry.dispose();
      }
    });
    this.renderer.dispose();
    // dispose() alone leaves the WebGL context alive. Browsers cap a page at
    // around 16, so without this every modal that opens leaks one and the
    // figure silently stops rendering once the cap is hit.
    this.renderer.forceContextLoss();
    this.renderer.domElement.remove();
  }
}

/**
 * Works out where to point the camera by sampling the whole rep.
 *
 * Hand-set targets drift out of frame as soon as a pose changes, so the frame
 * is derived from the movement: every contact point across the rep is
 * collected and the camera is pulled back far enough to hold all of them at
 * the given aspect ratio.
 */
export function frameExercise(
  pose: (d: number) => ExercisePose,
  fovDeg: number,
  aspect: number,
): { target: [number, number, number]; radius: number } {
  // A bounding sphere rather than a flat box: the camera orbits, so the
  // extent that matters changes with the angle. A sphere frames correctly
  // from every side, which a 2D box does not.
  const pts: [number, number, number][] = [];

  const see = (pt: Vec2, z = 0) => {
    pts.push([pt[0], pt[1], z]);
  };

  for (let i = 0; i <= 12; i++) {
    const p = pose(i / 12);
    // Limbs are mirrored in z, so both sides bound the figure's width.
    const fz = p.footZ + (p.kneeOut ?? 0);
    const hz = p.handZ + (p.elbowFlare ?? 0);

    for (const z of [fz, -fz]) {
      see(p.ankle, z);
      see(p.toe, z);
      if (p.ankleFar) see(p.ankleFar, z);
      if (p.toeFar) see(p.toeFar, z);
    }
    for (const z of [hz, -hz]) {
      see(p.hand, z);
      if (p.handFar) see(p.handFar, z);
    }
    for (const z of [0.19, -0.19]) see(p.shoulders, z);

    see(p.pelvis);
    see([
      p.shoulders[0] + 0.34 * Math.sin(p.headAngle),
      p.shoulders[1] + 0.34 * Math.cos(p.headAngle),
    ]);
  }

  let minX = Infinity;
  let maxX = -Infinity;
  let minY = Infinity;
  let maxY = -Infinity;
  let minZ = Infinity;
  let maxZ = -Infinity;

  for (const [x, y, z] of pts) {
    minX = Math.min(minX, x);
    maxX = Math.max(maxX, x);
    minY = Math.min(minY, y);
    maxY = Math.max(maxY, y);
    minZ = Math.min(minZ, z);
    maxZ = Math.max(maxZ, z);
  }

  const centre: [number, number, number] = [
    (minX + maxX) / 2,
    (minY + maxY) / 2,
    (minZ + maxZ) / 2,
  ];

  // Radius of the sphere enclosing every contact point, plus room for limb
  // thickness and the shoes.
  let r = 0;
  for (const [x, y, z] of pts) {
    r = Math.max(r, Math.hypot(x - centre[0], y - centre[1], z - centre[2]));
  }
  r += 0.16;

  // Fit that sphere inside whichever field of view is tighter.
  const vFov = fovDeg * (Math.PI / 180);
  const hFov = 2 * Math.atan(Math.tan(vFov / 2) * aspect);
  const fit = Math.min(vFov, hFov) / 2;

  return {
    target: centre,
    radius: Math.max(r / Math.sin(fit), 1.4),
  };
}

/** Maps rep time to pose depth `d` plus which tempo segment is running. */
export function repProgress(
  u: number,
  tempo: readonly [number, number, number, number],
): [number, number] {
  const [down, holdEnd, up] = tempo;
  const a = down;
  const b = a + holdEnd;
  const c = b + up;
  if (u < a) return [ease(u / a), 0];
  if (u < b) return [1, 1];
  if (u < c) return [1 - ease((u - b) / up), 2];
  return [0, 3];
}
