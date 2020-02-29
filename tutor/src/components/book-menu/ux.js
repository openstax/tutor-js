import { observable, action, observe } from 'mobx';
import scrollIntoView from 'scroll-into-view';

export default class MenuUX {

  @observable currentPage;
  expanded = observable.map();

  constructor({ book, currentPage, wrapper }) {
    this.book = book;
    this.wrapper = wrapper;
    this.currentPage = currentPage;
    observe(this, 'currentPage', this.onPageChange, true);
  }

  expand(page, options = { wasSelected: true }) {
    this.eachParent(page, (node) => {
      const expandedOptions = this.expanded.get(node.pathId);
      if (!expandedOptions || !expandedOptions.wasSelected) {
        this.expanded.set(node.pathId, options);
      }
    });
  }

  collapse(page) {
    this.expanded.delete(page.pathId);
  }

  areSiblings(a, b) {
    return a.parent == b.parent;
  }

  eachParent(node, fn) {
    if (node) fn(node);
    while ((node = node.parent)) {
      fn(node);
    }
  }

  isExpanded(node) {
    return Boolean(this.expanded.get(node.pathId));
  }

  @action toggleExpansion(node, ev) {
    if (this.isExpanded(node)) {
      this.collapse(node);
    } else {
      this.expand(node);
    }
    ev.preventDefault();
  }

  wasAutoExpanded(page) {
    const options = this.expanded.get(page.pathId);
    return Boolean(options && options.wasSelected == false);
  }

  @action.bound onPageChange({ oldValue: oldPage, newValue: newPage }) {
    if (oldPage == newPage) { return; }

    // find chapters that were selected only because of the old page
    if (oldPage && !this.areSiblings(oldPage, newPage)) {
      this.eachParent(oldPage, (node) => {
        if (this.wasAutoExpanded(node)) {
          this.collapse(node);
        }
      });
    }

    this.expand(newPage, { wasSelected: false });
    if (this.wrapper) {
      scrollIntoView(this.wrapper.querySelector(`[data-node-id="${newPage.pathId}"]`), {
        validTarget: (target) => {
          return target == this.wrapper;
        },
      });
    }
  }

}
