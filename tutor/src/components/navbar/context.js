import React from 'react';
import Map from 'shared/model/map';
import { observable, computed, action, modelize } from 'shared/model'


class Region extends Map {

    keyType = String

    constructor(context) {
        super();
        modelize(this);
        this.context = context;
    }

    remove(id) {
        this.widgets.delete(id);
    }

    coerceValue(v) {
        return v
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

    constructor(defaultSetter = null) {
        modelize(this);
        this.defaultSetter = defaultSetter;
        this.resetToDefault();
    }

    @action resetToDefault() {
        this.left.clear();
        this.center.clear();
        this.right.clear();
        if (this.defaultSetter) {
            this.defaultSetter.call(this);
        }
    }

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
