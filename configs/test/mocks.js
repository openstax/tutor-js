jest.mock(
  'popper.js',
  () =>
    class Popper {
      static placements = [
        'auto',
        'auto-end',
        'auto-start',
        'bottom',
        'bottom-end',
        'bottom-start',
        'left',
        'left-end',
        'left-start',
        'right',
        'right-end',
        'right-start',
        'top',
        'top-end',
        'top-start',
      ];
      destroy() { }
      scheduleUpdate() { }
      disableEventListeners() { }
    }
);

jest.mock('react-overlays/Overlay.js', () =>
  function MockedOverlay({ children }) {
    return children;
  }
);
