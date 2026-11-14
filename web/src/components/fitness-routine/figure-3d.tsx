import { useEffect, useRef } from 'react';
import { Stage, repProgress } from './anim/stage';
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
}: {
  exercise: ExerciseDef;
  className?: string;
  /** Starting camera angle: 0 side on, 1.45 front on. */
  azimuth?: number;
  onPhase?: (phase: string) => void;
}) {
  const host = useRef<HTMLDivElement>(null);
  const phaseRef = useRef(onPhase);

  useEffect(() => {
    phaseRef.current = onPhase;
  }, [onPhase]);

  useEffect(() => {
    const mount = host.current;
    if (!mount) return;

    const stage = new Stage(mount);
    stage.cam.target = [...exercise.camera.target];
    stage.cam.radius = exercise.camera.radius;
    stage.cam.az = azimuth;
    stage.cam.azTarget = azimuth;
    stage.showProps(exercise.props);

    const observer = new ResizeObserver(() => stage.resize());
    observer.observe(mount);
    stage.resize();

    const reduced = window.matchMedia?.(
      '(prefers-reduced-motion: reduce)',
    ).matches;
    const repSeconds = exercise.repSeconds ?? 5;

    let raf = 0;
    let t = 0;
    let last = performance.now();
    let lastPhase = '';

    const frame = (now: number) => {
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

      stage.updateCamera(exercise.camera);
      stage.render();
      raf = requestAnimationFrame(frame);
    };
    raf = requestAnimationFrame(frame);

    return () => {
      cancelAnimationFrame(raf);
      observer.disconnect();
      stage.dispose();
    };
  }, [exercise, azimuth]);

  return <div ref={host} className={className} />;
}
