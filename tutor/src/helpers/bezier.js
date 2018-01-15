import { defer } from 'lodash';

function EASE_IN_OUT(t) {
  if (t < .5) { return 4 * t * t * t; } else { return ((t - 1) * ((2 * t) - 2) * ((2 * t) - 2)) + 1; }
}

function CALC(start, end, elapsed, duration) {
  if (elapsed > duration) { return end; }
  return start + ((end - start) * EASE_IN_OUT(elapsed / duration));
}

const requestAnimationFrame = window.requestAnimationFrame || defer;

export default function bezier({
  range, duration, onStep, onComplete,
}) {
  const startTime = Date.now();

  const step = () => {
    const elapsed = Date.now() - startTime;
    onStep(CALC(range[0], range[1], elapsed, duration));
    if (elapsed < duration) {
      requestAnimationFrame(step);
    } else if (onComplete) {
      onComplete();
    }
  };

  step();
}
