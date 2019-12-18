import classnames from 'classnames';

import union from 'lodash/union';
import difference from 'lodash/difference';
import map from 'lodash/map';
import compact from 'lodash/compact';
import keys from 'lodash/keys';

export default {
  getBodyClasses() {
    return difference(document.body.classList || document.body.className.split(' '), keys(this._getClasses()));
  },

  getClasses(props, state) {
    return compact(map(this._getClasses(props, state), function(value, key) {
      if (value) { return key; }
      return null;
    }));
  },

  setBodyClasses(props, state) {
    return document.body.className = classnames(union(this.getBodyClasses(), this.getClasses(props, state)));
  },

  unsetBodyClasses(props, state) {
    return document.body.className = classnames(difference(this.getBodyClasses(), this.getClasses(props, state)));
  },
};
