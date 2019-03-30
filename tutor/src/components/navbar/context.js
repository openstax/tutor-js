import React from 'react';
import Map from 'shared/model/map';
import { observable, computed } from 'mobx';

class Region extends Map {

  keyType = String

  constructor(context) {
    super();
    this.context = context;
  }

  remove(id) {
    this.widgets.delete(id);
  }

  @computed get components() {
    return this.keys().map((k) => {
      return React.createElement(
        this.get(k),
        Object.assign(Map.toObject(this.context.childProps), { key: k })
      );
    });
  }

}

export
class NavbarContext {

  childProps = observable.map();
  @observable className;

  left = new Region(this);
  right = new Region(this);
  center = new Region(this);

  @computed get isEmpty() {
    return !(
      [this.left, this.right, this.center].find(c => !c.isEmpty)
    );
  }
}
