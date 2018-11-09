import PropTypes from 'prop-types';
import React from 'react';
import merge from 'lodash/merge';
import TestBackend from 'react-dnd-test-backend';
import TestRouter from './test-router';
//import { DragDropManager } from 'dnd-core';
import { DragDropContext } from 'react-dnd';

function wrapInDnDTestContext(DecoratedComponent) {
  return DragDropContext(TestBackend)(
    (props) => <DecoratedComponent {...props} />
  );
}
export { wrapInDnDTestContext };

const EnzymeContext = {
  withDnD(options = {}) {
    const context = this.build(options);
    return merge(
      context,
      {
        context: {
          dragDropManager: new DragDropManager(TestBackend),
        },

        childContextTypes: {
          dragDropManager: PropTypes.object,
        },
      },
    );
  },

  build(options = {}) {
    return merge({
      context: {
        router: new TestRouter(options.pathname || '/'),
        broadcasts: { location(cb) { return cb({ pathname: (options.pathname || '/') }); } },
      },

      childContextTypes: {
        broadcasts: PropTypes.object,
        router: PropTypes.object,
      },
    }, options);
  },
};

export default EnzymeContext;
