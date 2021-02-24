import MobxPropTypes from 'prop-types';
import React from 'react';
import PropTypes from 'prop-types';
import indexOf from 'lodash/indexOf';
import pickBy from 'lodash/pickBy';
import concat from 'lodash/concat';
import some from 'lodash/some';
import cn from 'classnames';
import 'mobx-react';

const PASSABLE_PROPS = ['className', 'id', 'children', 'target', 'ref', 'tabIndex', 'role'];
const PASSABLE_PREFIXES = ['data-', 'aria-', 'on'];
const filterProps = (props, options = {}) =>
    pickBy(props, (prop, name) =>

        (indexOf(concat(PASSABLE_PROPS, options.props || []), name) > -1) ||
      some(concat(PASSABLE_PREFIXES, options.prefixes || []), prefix => name.indexOf(prefix) === 0)
    )
;

const ArrayOrMobxType = MobxPropTypes.oneOfType([
    MobxPropTypes.array,
    PropTypes.array,
]);

const idType = MobxPropTypes.oneOfType([
    MobxPropTypes.string,
    MobxPropTypes.number,
]);

export { React, PropTypes, cn, filterProps, ArrayOrMobxType, idType };
