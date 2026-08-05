import { useCallback, useEffect, useMemo, useRef, useState } from 'react';
import * as THREE from 'three';

/**
 * A self-contained WebGL bouquet built for someone you care about.
 *
 * The whole thing lives on its own fixed, full-viewport layer and pulls
 * nothing from the rest of the app. A real Three.js scene renders a bouquet of
 * procedurally built flowers that grow and open on load, drift gently, and can
 * be spun by dragging. Press and hold anywhere for a little surprise.
 */

type FlowerSpec = {
  phi: number; // angle away from straight up (0 = center, larger = outer)
  theta: number; // direction around the dome
  stem: number; // stem length (taller in the middle)
  scale: number;
  palette: number;
  delay: number; // when this flower starts to bloom
};

// Warm, friendly palette. Each entry: bright petal, deeper petal edge, center.
const PALETTES: [number, number, number][] = [
  [0xff9ec4, 0xff5f9e, 0xffcf5e],
  [0xc9a7ff, 0x9b6bff, 0xffe08a],
  [0xffb27a, 0xff7e3d, 0xffd15e],
  [0x8fd3ff, 0x4ea8ff, 0xffe08a],
  [0xffe27a, 0xffb43d, 0xff9e2e],
  [0xff8f9e, 0xff5f7a, 0xffd15e],
  [0xfff3ff, 0xe0c9ff, 0xffdf7a],
];

// The arrangement, as a dome of heads. The center flower points straight up;
// the two rings fan outward around it so the heads gather into a rounded posy.
const TAU = Math.PI * 2;
const BOUQUET: FlowerSpec[] = [
  { phi: 0.0, theta: 0, stem: 1.72, scale: 1.16, palette: 0, delay: 0.0 },
  // inner ring
  { phi: 0.58, theta: 0.0 * TAU, stem: 1.62, scale: 1.0, palette: 1, delay: 0.3 },
  { phi: 0.58, theta: 0.2 * TAU, stem: 1.62, scale: 1.0, palette: 2, delay: 0.4 },
  { phi: 0.58, theta: 0.4 * TAU, stem: 1.62, scale: 1.0, palette: 3, delay: 0.5 },
  { phi: 0.58, theta: 0.6 * TAU, stem: 1.62, scale: 1.0, palette: 4, delay: 0.6 },
  { phi: 0.58, theta: 0.8 * TAU, stem: 1.62, scale: 1.0, palette: 5, delay: 0.7 },
  // outer ring, offset between the inner blooms
  { phi: 1.02, theta: 0.1 * TAU, stem: 1.5, scale: 0.88, palette: 6, delay: 0.95 },
  { phi: 1.02, theta: 0.3 * TAU, stem: 1.5, scale: 0.88, palette: 2, delay: 1.05 },
  { phi: 1.02, theta: 0.5 * TAU, stem: 1.5, scale: 0.88, palette: 1, delay: 1.15 },
  { phi: 1.02, theta: 0.7 * TAU, stem: 1.5, scale: 0.88, palette: 4, delay: 1.25 },
  { phi: 1.02, theta: 0.9 * TAU, stem: 1.5, scale: 0.88, palette: 3, delay: 1.35 },
];

const HOLD_MS = 1200;

/** Soft round sprite used for pollen and the surprise burst. */
function makeSpriteTexture(): THREE.Texture {
  const c = document.createElement('canvas');
  c.width = c.height = 64;
  const ctx = c.getContext('2d')!;
  const g = ctx.createRadialGradient(32, 32, 0, 32, 32, 32);
  g.addColorStop(0, 'rgba(255,255,255,1)');
  g.addColorStop(0.35, 'rgba(255,240,250,0.9)');
  g.addColorStop(1, 'rgba(255,255,255,0)');
  ctx.fillStyle = g;
  ctx.fillRect(0, 0, 64, 64);
  const tex = new THREE.CanvasTexture(c);
  tex.colorSpace = THREE.SRGBColorSpace;
  return tex;
}

/** A single petal outline, standing up from its base at the origin. */
function makePetalGeometry(len: number, width: number): THREE.BufferGeometry {
  const s = new THREE.Shape();
  s.moveTo(0, 0);
  s.bezierCurveTo(-width, len * 0.28, -width * 0.55, len * 0.92, 0, len);
  s.bezierCurveTo(width * 0.55, len * 0.92, width, len * 0.28, 0, 0);
  const geo = new THREE.ShapeGeometry(s, 14);
  // Cup the petal: bend the tip forward a little so it is not flat.
  const pos = geo.attributes.position as THREE.BufferAttribute;
  for (let i = 0; i < pos.count; i++) {
    const y = pos.getY(i);
    const t = Math.max(0, y) / len;
    pos.setZ(i, Math.sin(t * Math.PI * 0.5) * len * 0.16);
  }
  geo.computeVertexNormals();
  return geo;
}

type BloomPart = {
  head: THREE.Group;
  petals: { mesh: THREE.Mesh; closed: number; open: number }[];
  delay: number;
};

/** Build one flower as a group whose stem base sits at the local origin. */
function buildFlower(
  spec: FlowerSpec,
  shared: {
    petalOuter: THREE.BufferGeometry;
    petalInner: THREE.BufferGeometry;
    centerGeo: THREE.BufferGeometry;
    stemGeo: THREE.BufferGeometry;
    leafGeo: THREE.BufferGeometry;
  },
): { group: THREE.Group; bloom: BloomPart } {
  const [petalCol, edgeCol, centerCol] = PALETTES[spec.palette];
  const group = new THREE.Group();

  // Stem, standing along +Y from the origin.
  const stemMat = new THREE.MeshStandardMaterial({
    color: 0x3fa564,
    roughness: 0.8,
  });
  const stem = new THREE.Mesh(shared.stemGeo, stemMat);
  stem.scale.y = spec.stem;
  stem.position.y = spec.stem / 2;
  group.add(stem);

  // A couple of leaves partway up.
  const leafMat = new THREE.MeshStandardMaterial({
    color: 0x49b877,
    roughness: 0.7,
    side: THREE.DoubleSide,
  });
  for (const dir of [1, -1]) {
    const leaf = new THREE.Mesh(shared.leafGeo, leafMat);
    leaf.position.y = spec.stem * 0.45;
    leaf.rotation.z = dir * 0.9;
    leaf.rotation.y = dir * 0.4;
    leaf.scale.setScalar(0.9);
    group.add(leaf);
  }

  // The head sits at the top of the stem.
  const head = new THREE.Group();
  head.position.y = spec.stem;
  head.scale.setScalar(0.001);
  group.add(head);

  const petals: BloomPart['petals'] = [];
  const addRing = (
    geo: THREE.BufferGeometry,
    count: number,
    color: number,
    baseTilt: number,
    offset: number,
  ) => {
    const mat = new THREE.MeshStandardMaterial({
      color,
      roughness: 0.55,
      metalness: 0.0,
      side: THREE.DoubleSide,
      emissive: new THREE.Color(color).multiplyScalar(0.06),
    });
    for (let i = 0; i < count; i++) {
      const pivot = new THREE.Object3D();
      pivot.rotation.y = (i / count) * Math.PI * 2 + offset;
      const mesh = new THREE.Mesh(geo, mat);
      const closed = -0.08;
      const open = -baseTilt;
      mesh.rotation.x = closed;
      pivot.add(mesh);
      head.add(pivot);
      petals.push({ mesh, closed, open });
    }
  };
  addRing(shared.petalOuter, 8, edgeCol, 1.05, Math.PI / 8);
  addRing(shared.petalInner, 8, petalCol, 0.72, 0);

  // Flower center with a warm glow and a little highlight bump.
  const centerMat = new THREE.MeshStandardMaterial({
    color: centerCol,
    roughness: 0.5,
    emissive: new THREE.Color(centerCol).multiplyScalar(0.25),
  });
  const center = new THREE.Mesh(shared.centerGeo, centerMat);
  head.add(center);

  group.scale.setScalar(spec.scale);
  // Point the flower along its dome direction so the stem base stays at the
  // knot (origin) while the head fans outward into the posy.
  const dir = new THREE.Vector3(
    Math.sin(spec.phi) * Math.sin(spec.theta),
    Math.cos(spec.phi),
    Math.sin(spec.phi) * Math.cos(spec.theta),
  ).normalize();
  group.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), dir);

  return { group, bloom: { head, petals, delay: spec.delay } };
}

export function Flowers() {
  // Optional personalization via ?to=&from=&note= (kept fully client side).
  const { to, from, note } = useMemo(() => {
    if (typeof window === 'undefined') return { to: '', from: '', note: '' };
    const params = new URLSearchParams(window.location.search);
    return {
      to: (params.get('to') || '').slice(0, 40),
      from: (params.get('from') || '').slice(0, 40),
      note: (params.get('note') || '').slice(0, 220),
    };
  }, []);

  const secretNote =
    note ||
    (to
      ? `${to}, I built this whole thing from scratch just for you. Real flowers wilt in a week. These ones won't. No big reason behind it, I just figured you deserved something a little out of the ordinary today. Hope it made you smile.`
      : "I built this whole thing from scratch just for you. Real flowers wilt in a week. These ones won't. No big reason behind it, I just figured you deserved something a little out of the ordinary today. Hope it made you smile.");

  const mountRef = useRef<HTMLDivElement>(null);
  const apiRef = useRef<{
    spin: (dx: number) => void;
    burst: () => void;
    setBright: (on: boolean) => void;
  } | null>(null);
  const holdTimer = useRef<ReturnType<typeof setTimeout> | null>(null);
  const drag = useRef({ down: false, moved: false, lastX: 0 });

  const [messageVisible, setMessageVisible] = useState(false);
  const [charging, setCharging] = useState(false);
  const [revealed, setRevealed] = useState(false);
  const [webglFailed, setWebglFailed] = useState(false);

  useEffect(() => {
    const mount = mountRef.current;
    if (!mount) return;

    let renderer: THREE.WebGLRenderer;
    try {
      renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true });
    } catch {
      queueMicrotask(() => setWebglFailed(true));
      return;
    }
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.setSize(mount.clientWidth, mount.clientHeight);
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.1;
    renderer.outputColorSpace = THREE.SRGBColorSpace;
    mount.appendChild(renderer.domElement);

    const scene = new THREE.Scene();
    const camera = new THREE.PerspectiveCamera(
      42,
      mount.clientWidth / mount.clientHeight,
      0.1,
      100,
    );
    camera.position.set(0, 0.85, 6.9);
    camera.lookAt(0, 0.85, 0);

    // Lighting: soft sky fill, a warm key, and a cool rim for depth.
    const hemi = new THREE.HemisphereLight(0xffdff0, 0x7a4a63, 0.9);
    scene.add(hemi);
    const key = new THREE.DirectionalLight(0xfff1d6, 1.25);
    key.position.set(3.5, 5, 4);
    scene.add(key);
    const rim = new THREE.DirectionalLight(0xbcdcff, 0.55);
    rim.position.set(-4, 2.5, -3.5);
    scene.add(rim);
    // Soft fill from the front so the paper wrap does not fall into shadow.
    const fill = new THREE.DirectionalLight(0xfff0f6, 0.75);
    fill.position.set(0, -1.5, 6);
    scene.add(fill);
    const glow = new THREE.PointLight(0xffdca8, 0.0, 12);
    glow.position.set(0, 1.7, 1.5);
    scene.add(glow);

    // Shared geometry so all flowers are cheap to build.
    const shared = {
      petalOuter: makePetalGeometry(0.62, 0.24),
      petalInner: makePetalGeometry(0.46, 0.2),
      centerGeo: new THREE.IcosahedronGeometry(0.16, 1),
      stemGeo: new THREE.CylinderGeometry(0.035, 0.05, 1, 8),
      leafGeo: makePetalGeometry(0.5, 0.16),
    };

    const bouquet = new THREE.Group();
    bouquet.position.y = -0.05;
    scene.add(bouquet);

    const blooms: BloomPart[] = [];
    for (const spec of BOUQUET) {
      const { group, bloom } = buildFlower(spec, shared);
      bouquet.add(group);
      blooms.push(bloom);
    }

    // Wrapping paper: two open cones below the knot, apex pointing down, that
    // gather the stems like a real hand-tied bouquet.
    const paperMatOuter = new THREE.MeshStandardMaterial({
      color: 0xfff0f7,
      roughness: 0.95,
      side: THREE.DoubleSide,
    });
    const paperMatInner = new THREE.MeshStandardMaterial({
      color: 0xf9c2dd,
      roughness: 0.95,
      side: THREE.DoubleSide,
    });
    const coneA = new THREE.Mesh(
      new THREE.ConeGeometry(0.58, 1.25, 30, 1, true),
      paperMatOuter,
    );
    coneA.rotation.x = Math.PI; // apex down
    coneA.position.y = -0.45;
    bouquet.add(coneA);
    const coneB = new THREE.Mesh(
      new THREE.ConeGeometry(0.44, 1.12, 28, 1, true),
      paperMatInner,
    );
    coneB.rotation.x = Math.PI;
    coneB.position.y = -0.4;
    bouquet.add(coneB);

    // Ribbon around the neck, just above the wrap opening.
    const ribbon = new THREE.Mesh(
      new THREE.TorusGeometry(0.3, 0.06, 12, 30),
      new THREE.MeshStandardMaterial({ color: 0xe2568f, roughness: 0.5 }),
    );
    ribbon.rotation.x = Math.PI / 2;
    ribbon.position.y = 0.24;
    bouquet.add(ribbon);

    // Ambient drifting pollen.
    const sprite = makeSpriteTexture();
    const POLLEN = 220;
    const pollenGeo = new THREE.BufferGeometry();
    const pPos = new Float32Array(POLLEN * 3);
    const pSpeed = new Float32Array(POLLEN);
    for (let i = 0; i < POLLEN; i++) {
      pPos[i * 3] = (Math.random() - 0.5) * 10;
      pPos[i * 3 + 1] = Math.random() * 7 - 1;
      pPos[i * 3 + 2] = (Math.random() - 0.5) * 6 - 1;
      pSpeed[i] = 0.15 + Math.random() * 0.3;
    }
    pollenGeo.setAttribute('position', new THREE.BufferAttribute(pPos, 3));
    const pollenMat = new THREE.PointsMaterial({
      size: 0.09,
      map: sprite,
      transparent: true,
      depthWrite: false,
      opacity: 0.7,
      blending: THREE.AdditiveBlending,
      color: 0xffd6ec,
    });
    const pollen = new THREE.Points(pollenGeo, pollenMat);
    scene.add(pollen);

    // Surprise burst system (inactive until triggered).
    const BURST = 220;
    const burstGeo = new THREE.BufferGeometry();
    const bPos = new Float32Array(BURST * 3);
    const bVel = new Float32Array(BURST * 3);
    const bCol = new Float32Array(BURST * 3);
    burstGeo.setAttribute('position', new THREE.BufferAttribute(bPos, 3));
    burstGeo.setAttribute('color', new THREE.BufferAttribute(bCol, 3));
    const burstMat = new THREE.PointsMaterial({
      size: 0.16,
      map: sprite,
      transparent: true,
      depthWrite: false,
      opacity: 0,
      vertexColors: true,
      blending: THREE.AdditiveBlending,
    });
    const burst = new THREE.Points(burstGeo, burstMat);
    scene.add(burst);
    let burstTime = -1;

    const fireBurst = () => {
      const posAttr = burstGeo.attributes.position as THREE.BufferAttribute;
      const colAttr = burstGeo.attributes.color as THREE.BufferAttribute;
      const warm = [
        new THREE.Color(0xff8fbf),
        new THREE.Color(0xffd76b),
        new THREE.Color(0xffffff),
        new THREE.Color(0xc9a7ff),
      ];
      for (let i = 0; i < BURST; i++) {
        posAttr.setXYZ(i, 0, 1.5, 0.2);
        const dir = new THREE.Vector3(
          Math.random() - 0.5,
          Math.random() * 0.9 + 0.1,
          Math.random() - 0.5,
        ).normalize();
        const speed = 1.6 + Math.random() * 2.4;
        bVel[i * 3] = dir.x * speed;
        bVel[i * 3 + 1] = dir.y * speed;
        bVel[i * 3 + 2] = dir.z * speed;
        const col = warm[(Math.random() * warm.length) | 0];
        colAttr.setXYZ(i, col.r, col.g, col.b);
      }
      posAttr.needsUpdate = true;
      colAttr.needsUpdate = true;
      burstTime = 0;
      burstMat.opacity = 1;
    };

    // Interaction and reveal state exposed to React.
    let brightTarget = 0;
    let bright = 0;
    apiRef.current = {
      spin: (dx: number) => {
        bouquet.rotation.y += dx * 0.006;
      },
      burst: fireBurst,
      setBright: (on: boolean) => {
        brightTarget = on ? 1 : 0;
      },
    };

    const clock = new THREE.Clock();
    let raf = 0;
    let running = true;

    const animate = () => {
      if (!running) return;
      raf = requestAnimationFrame(animate);
      const dt = Math.min(clock.getDelta(), 0.05);
      const t = clock.elapsedTime;

      // Auto spin plus a gentle breathing tilt.
      bouquet.rotation.y += dt * 0.12;
      bouquet.rotation.z = Math.sin(t * 0.6) * 0.03;

      // Bloom: each flower opens on its own schedule.
      for (const b of blooms) {
        const local = (t - 0.4 - b.delay) / 1.1;
        const e = Math.max(0, Math.min(1, local));
        const ease = 1 - Math.pow(1 - e, 3);
        b.head.scale.setScalar(Math.max(0.001, ease));
        for (const p of b.petals) {
          p.mesh.rotation.x = p.closed + (p.open - p.closed) * ease;
        }
      }

      // Pollen drifts up and wraps around.
      const pa = pollenGeo.attributes.position as THREE.BufferAttribute;
      for (let i = 0; i < POLLEN; i++) {
        let y = pa.getY(i) + pSpeed[i] * dt;
        let x = pa.getX(i) + Math.sin(t * 0.5 + i) * dt * 0.05;
        if (y > 6) {
          y = -1;
          x = (Math.random() - 0.5) * 10;
        }
        pa.setX(i, x);
        pa.setY(i, y);
      }
      pa.needsUpdate = true;

      // Brighten on reveal.
      bright += (brightTarget - bright) * Math.min(1, dt * 3);
      glow.intensity = bright * 1.8;
      key.intensity = 1.25 + bright * 0.5;
      renderer.toneMappingExposure = 1.1 + bright * 0.25;

      // Advance the burst if it is active.
      if (burstTime >= 0) {
        burstTime += dt;
        const pos = burstGeo.attributes.position as THREE.BufferAttribute;
        for (let i = 0; i < BURST; i++) {
          bVel[i * 3 + 1] -= dt * 1.4; // a little gravity
          pos.setXYZ(
            i,
            pos.getX(i) + bVel[i * 3] * dt,
            pos.getY(i) + bVel[i * 3 + 1] * dt,
            pos.getZ(i) + bVel[i * 3 + 2] * dt,
          );
        }
        pos.needsUpdate = true;
        burstMat.opacity = Math.max(0, 1 - burstTime / 2.6);
        if (burstTime > 2.6) burstTime = -1;
      }

      renderer.render(scene, camera);
    };
    animate();

    const onResize = () => {
      if (!mount) return;
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      renderer.setSize(w, h);
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
    };
    window.addEventListener('resize', onResize);

    return () => {
      running = false;
      cancelAnimationFrame(raf);
      window.removeEventListener('resize', onResize);
      apiRef.current = null;
      renderer.dispose();
      scene.traverse((o) => {
        const m = o as THREE.Mesh;
        if (m.geometry) m.geometry.dispose();
        const mat = (m as THREE.Mesh).material;
        if (Array.isArray(mat)) mat.forEach((x) => x.dispose());
        else if (mat) (mat as THREE.Material).dispose();
      });
      sprite.dispose();
      if (renderer.domElement.parentNode === mount)
        mount.removeChild(renderer.domElement);
    };
  }, []);

  useEffect(() => {
    const t = setTimeout(() => setMessageVisible(true), 600);
    return () => clearTimeout(t);
  }, []);

  useEffect(() => {
    const prev = document.body.style.overflow;
    document.body.style.overflow = 'hidden';
    return () => {
      document.body.style.overflow = prev;
    };
  }, []);

  useEffect(() => {
    return () => {
      if (holdTimer.current) clearTimeout(holdTimer.current);
    };
  }, []);

  const triggerSurprise = useCallback(() => {
    setCharging(false);
    setRevealed(true);
    apiRef.current?.burst();
    apiRef.current?.setBright(true);
  }, []);

  const onPointerDown = useCallback(
    (e: React.PointerEvent<HTMLDivElement>) => {
      if ((e.target as HTMLElement).closest('.secret-card')) return;
      drag.current = { down: true, moved: false, lastX: e.clientX };
      setCharging(true);
      if (holdTimer.current) clearTimeout(holdTimer.current);
      holdTimer.current = setTimeout(triggerSurprise, HOLD_MS);
    },
    [triggerSurprise],
  );

  const onPointerMove = useCallback((e: React.PointerEvent<HTMLDivElement>) => {
    if (!drag.current.down) return;
    const dx = e.clientX - drag.current.lastX;
    drag.current.lastX = e.clientX;
    if (Math.abs(dx) > 2) {
      // Treat this as a look-around drag, not a hold.
      if (!drag.current.moved && Math.abs(dx) > 4) {
        drag.current.moved = true;
        setCharging(false);
        if (holdTimer.current) {
          clearTimeout(holdTimer.current);
          holdTimer.current = null;
        }
      }
      apiRef.current?.spin(dx);
    }
  }, []);

  const endHold = useCallback(() => {
    drag.current.down = false;
    setCharging(false);
    if (holdTimer.current) {
      clearTimeout(holdTimer.current);
      holdTimer.current = null;
    }
  }, []);

  return (
    <div
      className="flowers-root"
      onPointerDown={onPointerDown}
      onPointerMove={onPointerMove}
      onPointerUp={endHold}
      onPointerLeave={endHold}
      onPointerCancel={endHold}
    >
      <style>{STYLES}</style>

      <div className={`sky ${revealed ? 'is-bright' : ''}`} />
      <div className="scene" ref={mountRef} />

      {webglFailed && (
        <div className="fallback">
          <p>{secretNote}</p>
          {from ? <p className="secret-from">from {from}</p> : null}
        </div>
      )}

      {/* Greeting */}
      <div className={`love-card ${messageVisible ? 'is-visible' : ''}`}>
        <div className="love-kicker">a little something</div>
        <h1 className="love-title">{to ? `Hey, ${to}` : 'Hey there'}</h1>
        <p className="love-sub">Some flowers that will never wilt.</p>
      </div>

      {/* Secret note */}
      <div className={`secret-card ${revealed ? 'is-open' : ''}`}>
        <div className="secret-seal">🌼</div>
        <p className="secret-note">{secretNote}</p>
        {from ? <p className="secret-from">from {from}</p> : null}
      </div>

      {/* Hint + hold progress */}
      <div className="hint">
        <span className="hint-text">
          {revealed
            ? 'drag to spin it. hold again to replay 🌼'
            : 'drag to look around. press and hold for a surprise 🌼'}
        </span>
        <span className="hint-bar">
          <span className={`hint-fill ${charging ? 'is-charging' : ''}`} />
        </span>
      </div>
    </div>
  );
}

const STYLES = `
.flowers-root {
  position: fixed;
  inset: 0;
  z-index: 9999;
  overflow: hidden;
  font-family: ui-rounded, 'Segoe UI', system-ui, -apple-system, sans-serif;
  cursor: grab;
  user-select: none;
  touch-action: none;
  -webkit-tap-highlight-color: transparent;
}
.flowers-root:active { cursor: grabbing; }

.sky {
  position: absolute;
  inset: 0;
  background:
    radial-gradient(120% 90% at 50% 118%, #ffd9ec 0%, #ffbcdd 20%, transparent 55%),
    linear-gradient(180deg, #241543 0%, #4a2c78 26%, #8f4c8f 52%, #d97aa8 76%, #ffd9a8 100%);
  transition: filter 1.4s ease;
}
.sky.is-bright { filter: brightness(1.12) saturate(1.1); }

.scene { position: absolute; inset: 0; }
.scene canvas { display: block; }

/* Greeting */
.love-card {
  position: absolute;
  top: 4.5vh;
  left: 50%;
  transform: translate(-50%, 18px);
  text-align: center;
  color: #fff;
  opacity: 0;
  transition: opacity 1.1s ease, transform 1.1s cubic-bezier(0.22, 1, 0.36, 1);
  padding: 0 24px;
  max-width: 620px;
  pointer-events: none;
  text-shadow: 0 2px 20px rgba(60, 15, 45, 0.45);
}
.love-card.is-visible { opacity: 1; transform: translate(-50%, 0); }
.love-kicker {
  text-transform: uppercase;
  letter-spacing: 0.4em;
  font-size: 12px;
  font-weight: 600;
  opacity: 0.85;
  margin-bottom: 10px;
  padding-left: 0.4em;
}
.love-title {
  font-size: clamp(32px, 6.5vw, 60px);
  font-weight: 800;
  margin: 0;
  line-height: 1.04;
  letter-spacing: -0.015em;
}
.love-sub {
  margin: 12px auto 0;
  font-size: clamp(14px, 2.2vw, 19px);
  font-weight: 500;
  opacity: 0.92;
}

/* Secret note */
.secret-card {
  position: absolute;
  left: 50%;
  top: 46%;
  transform: translate(-50%, -46%) scale(0.7) rotate(-2deg);
  width: min(88vw, 480px);
  padding: 30px 32px 26px;
  background: linear-gradient(160deg, #fffdf8 0%, #fff2f8 100%);
  border-radius: 22px;
  box-shadow: 0 26px 80px rgba(70, 15, 50, 0.5);
  text-align: center;
  color: #4a2338;
  opacity: 0;
  pointer-events: none;
  transition: opacity 0.7s ease, transform 0.7s cubic-bezier(0.22, 1.3, 0.36, 1);
  border: 1px solid rgba(255, 170, 205, 0.55);
}
.secret-card.is-open {
  opacity: 1;
  transform: translate(-50%, -50%) scale(1) rotate(-1deg);
  pointer-events: auto;
}
.secret-seal {
  font-size: 42px;
  line-height: 1;
  margin-bottom: 14px;
  animation: seal-pop 0.8s cubic-bezier(0.22, 1.6, 0.36, 1) both;
}
@keyframes seal-pop {
  0% { transform: scale(0) rotate(-24deg); }
  100% { transform: scale(1) rotate(0deg); }
}
.secret-note {
  margin: 0;
  font-size: clamp(16px, 3vw, 21px);
  font-weight: 600;
  line-height: 1.55;
}
.secret-from {
  margin: 18px 0 0;
  font-size: clamp(14px, 2.5vw, 18px);
  font-style: italic;
  font-weight: 600;
  color: #b0466f;
}

/* Hint */
.hint {
  position: absolute;
  left: 50%;
  bottom: 3.4vh;
  transform: translateX(-50%);
  display: flex;
  flex-direction: column;
  align-items: center;
  gap: 10px;
  color: #fff;
  text-shadow: 0 2px 10px rgba(60, 15, 45, 0.55);
  pointer-events: none;
  z-index: 3;
}
.hint-text {
  font-size: 14px;
  font-weight: 600;
  opacity: 0.95;
  animation: hint-breathe 2.6s ease-in-out infinite;
}
@keyframes hint-breathe {
  0%, 100% { opacity: 0.68; }
  50% { opacity: 1; }
}
.hint-bar {
  width: 190px;
  height: 6px;
  border-radius: 999px;
  background: rgba(255, 255, 255, 0.28);
  overflow: hidden;
}
.hint-fill {
  display: block;
  width: 0%;
  height: 100%;
  border-radius: 999px;
  background: linear-gradient(90deg, #ffd7e6, #ff6fa5);
  box-shadow: 0 0 12px rgba(255, 111, 165, 0.8);
}
.hint-fill.is-charging { animation: charge ${HOLD_MS}ms linear forwards; }
@keyframes charge { from { width: 0%; } to { width: 100%; } }

/* Fallback if WebGL is unavailable */
.fallback {
  position: absolute;
  left: 50%;
  top: 50%;
  transform: translate(-50%, -50%);
  width: min(88vw, 460px);
  padding: 28px;
  background: rgba(255, 253, 248, 0.96);
  border-radius: 20px;
  color: #4a2338;
  text-align: center;
  font-size: 18px;
  font-weight: 600;
  line-height: 1.5;
}

@media (prefers-reduced-motion: reduce) {
  .hint-text { animation: none; }
}
`;
