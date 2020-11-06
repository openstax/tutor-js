
const EMPTY_SELECTION_VALUE = Object.freeze({ from: 0, to: 0 });

function resolveSelectionValue(el) {
  if (!window.getSelection) {
    console.warn('window.getSelection() is not supported');
    return EMPTY_SELECTION_VALUE;
  }

  const selection = window.getSelection();
  if (!selection.containsNode) {
    console.warn('selection.containsNode() is not supported');
    return EMPTY_SELECTION_VALUE;
  }

  if (!selection.rangeCount) {
    return EMPTY_SELECTION_VALUE;
  }

  const range = selection.getRangeAt(0);
  if (!range) {
    return EMPTY_SELECTION_VALUE;
  }

  const { startContainer, endContainer, startOffset, endOffset } = range;
  if (
    startContainer === el ||
    endContainer === el ||
    (startContainer && el.contains(startContainer)) ||
    (endContainer && el.contains(endContainer))
  ) {
    return {
      from: startOffset,
      to: endOffset,
    };
  }

  return EMPTY_SELECTION_VALUE;
}

export default class SelectionObserver {
  _observables = [];
  _callback = null;

  constructor(callback) {
    this._callback = callback;
  }

  disconnect() {
    this._observables.forEach(obj => {
      const el = obj.target;
      el.removeEventListener('click', this._check, false);
      el.removeEventListener('selectionchange', this._check, false);
    });
    this._observables = [];
  }

  observe(el) {
    if (!window.getSelection) {
      console.warn('window.getSelection() is not supported');
      return;
    }

    if (this._observables.some(obj => obj.target === el)) {
      // Already observed.
      return;
    }

    const obj = {
      target: el,
      selection: resolveSelectionValue(el),
    };

    el.addEventListener('click', this._check, false);
    el.addEventListener('selectionchange', this._check, false);
    this._observables.push(obj);
  }

  takeRecords() {
    return this._observables.slice(0);
  }

  _onClick = () => {
    const callback = this._callback;
    this._observables = this._observables.map(obj => {
      const { target } = obj;
      return {
        target,
        selection: resolveSelectionValue(target),
      };
    });
    callback && callback(this.takeRecords(), this);
  };

  _check = () => {
    let changed = false;
    const callback = this._callback;
    this._observables = this._observables.map(obj => {
      const { target, selection } = obj;
      const $selection = resolveSelectionValue(target);
      if (selection === $selection) {
        return obj;
      }
      if (
        selection.from === $selection.from &&
        selection.to === $selection.to
      ) {
        return obj;
      }
      changed = true;
      return {
        target,
        selection: $selection,
      };
    });
    changed && callback && callback(this.takeRecords(), this);
  };
}
