import React from 'react';
import Map from 'shared/model/map';
import { observable, computed } from 'mobx';

class Region extends Map {

  constructor(context) {
    super({}, { keyType: String });
    this.context = context;
  }

  remove(id) {
    this.widgets.delete(id);
  }

  @computed get components() {
    return this.keys().map((k) => {
      return React.createElement('div', {
        key: k,
        'data-nav-id': k,
        className: 'navbar-item',
      }, React.createElement(
        this.get(k),
        Map.toObject(this.context.childProps),
      ));
    });
  }

}

export default class NavbarContext {

  childProps = observable.map();
  @observable className;

  left = new Region(this);
  right = new Region(this);
  center = new Region(this);

}
