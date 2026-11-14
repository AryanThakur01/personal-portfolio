import { useEffect, useRef } from 'react';
import { Stage, frameExercise, repProgress } from './anim/stage';
import type { ExerciseDef } from './anim/types';

/**
 * Renders one exercise: an IK-driven figure performing reps.
 *
 * Lazy-loaded by the movement panel, since three.js is far too heavy to sit
 * in the page's initial chunk.
 */
export function Figure3D({
  exercise,
  className,
  azimuth = 0.6,
  onPhase,
  onFail,
}: {
  exercise: ExerciseDef;
  className?: string;
  /** Starting camera angle: 0 side on, 1.45 front on. */
  azimuth?: number;
  onPhase?: (phase: string) => void;
  /** Called when the scene cannot be created, so a fallback can be shown. */
  onFail?: () => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(onPhase);
  const failRef = useRef(onFail);

  useEffect(() => {
    phaseRef.current = onPhase;
    failRef.current = onFail;
  }, [onPhase, onFail]);

  useEffect(() => {
    const mount = host.current;
    if (!mount) return;

    let stage: Stage;
    try {
      stage = new Stage(mount);
    } catch {
      failRef.current?.();
      return;
    }
    stage.cam.az = azimuth;
    stage.cam.azTarget = azimuth;
    stage.showProps(exercise.props);

    // Framing is recomputed every frame from the canvas's live size. Doing it
    // once at mount is not enough: the panel often has no height yet when the
    // stage is built, which leaves the camera aspect wrong and the figure
    // somewhere off in a corner.
    let focus = frameExercise(exercise.pose, stage.camera.fov, 1);
    let lastW = 0;
    let lastH = 0;

    const measure = () => {
      const w = mount.clientWidth;
      const h = mount.clientHeight;
      if (!w || !h) return false;
      if (w === lastW && h === lastH) return true;

      lastW = w;
      lastH = h;
      stage.resize();
      focus = frameExercise(exercise.pose, stage.camera.fov, w / h);
      return true;
    };

    // Snap straight to the framing the first time a real size is available,
    // rather than easing in from the default.
    let settled = false;
    const snap = () => {
      if (settled || !measure()) return;
      settled = true;
      stage.cam.target = [...focus.target];
      stage.cam.radius = focus.radius;
    };
    snap();

    const observer = new ResizeObserver(snap);
    observer.observe(mount);

    const canvas = stage.renderer.domElement;
    const onLost = (e: Event) => {
      e.preventDefault();
      failRef.current?.();
    };
    canvas.addEventListener('webglcontextlost', onLost);

    const reduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const repSeconds = exercise.repSeconds ?? 5;

    let raf = 0;
    let t = 0;
    let last = performance.now();
    let lastPhase = '';

    const frame = (now: number) => {
      snap();
      const dt = Math.min(0.05, (now - last) / 1000);
      last = now;
      if (!reduced) t += dt / repSeconds;

      const u = reduced ? exercise.tempo[0] * 0.6 : t % 1;
      const [d, seg] = repProgress(u, exercise.tempo);

      const phase = exercise.phases[seg];
      if (phase !== lastPhase) {
        lastPhase = phase;
        phaseRef.current?.(phase);
      }

      const pose = exercise.pose(d);
      // A touch of sway and breathing, so holds are not dead still.
      pose.pelvis[1] += 0.002 * Math.sin(now / 700);
      const breath =
        1 +
        0.03 * Math.sin(u * Math.PI * 2 - 1.2) +
        0.008 * Math.sin(now / 900);

      stage.drawFigure(pose, breath);

      if (exercise.barbell && pose._handPoint) {
        const bell = stage.props.barbell;
        if (bell) bell.position.set(pose._handPoint[0], pose._handPoint[1], 0);
      }

      stage.updateCamera(focus);
      stage.render();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      canvas.removeEventListener('webglcontextlost', onLost);
      stage.dispose();
    };
  }, [exercise, azimuth]);

  return <div ref={host} className={className} />;
}
