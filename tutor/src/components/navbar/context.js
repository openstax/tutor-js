import React from 'react';
import { observable, computed, ObservableMap } from 'mobx';

class Region extends ObservableMap {

  constructor(context) {
    super();
    this.context = context;
  }

  remove(id) {
    this.widgets.delete(id);
  }

  @computed get components() {
    return this.keys().map((k) =>
      React.createElement('div',
        {
          key: k,
          'data-nav-id': k,
          className: 'navbar-item',
        },
        React.createElement(
          this.get(k),
          this.context.childProps.toJS(),
        ),
      )
    );
  }

}

export default class NavbarContext {

  childProps = observable.map();
  @observable className;

  left = new Region(this);
  right = new Region(this);
  center = new Region(this);

}
