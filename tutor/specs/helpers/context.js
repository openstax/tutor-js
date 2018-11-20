import PropTypes from 'prop-types';
import React from 'react';
import merge from 'lodash/merge';
import TestBackend from 'react-dnd-test-backend';
import TestRouter from './test-router';
import { MemoryRouter as Router } from 'react-router-dom';
import Theme from '../../src/theme';
import { ThemeProvider } from 'styled-components';
import { DragDropContextProvider, DragDropContext } from 'react-dnd';
import TutorTheme from '../../src/theme';
import TourConductor from '../../src/components/tours/conductor';
import { SpyMode } from 'shared';

function wrapInDnDTestContext(DecoratedComponent) {
  return DragDropContext(TestBackend)(
    (props) => <DecoratedComponent {...props} />
  );
}
export { wrapInDnDTestContext };


// eslint-disable-next-line react/prefer-stateless-function
export class C extends React.Component {
  static DnDContext = wrapInDnDTestContext(({ children }) => children);
  static propTypes = {
    path: PropTypes.string,
    noRef: PropTypes.bool,
    withTours: PropTypes.object,
    children: PropTypes.element.isRequired,
  }
  static defaultProps = {
    path: '/',
  }
  render() {
    const { children, noRef, withTours } = this.props;
    const child = noRef ? children : React.cloneElement(children, { ref: 'instance' });
    const routerProps = {
      initialIndex: 0,
      initialEntries: [this.props.path],
    };
    const body = (
      <ThemeProvider theme={Theme}>
        <Router {...routerProps} ref="router">
          <C.DnDContext>
            {child}
          </C.DnDContext>
        </Router>
      </ThemeProvider>
    );
    if (withTours) {
      return (
        <SpyMode.Wrapper>
          <TourConductor tourContext={withTours}>
            {body}
          </TourConductor>
        </SpyMode.Wrapper>
      );
    }
    return body;
  }
}

const EnzymeContext = {
  withDnD(options = {}) {
    const context = this.build(options);
    return merge(
      context,
      {
        context: {
          dragDropManager: {},
        },
        childContextTypes: {
          dragDropManager: PropTypes.object,
        },
      },
    );
  },

  build(options = {}) {
    return merge({}, {
      context: {
        theme: TutorTheme,
        router: new TestRouter(options.pathname || '/'),
        broadcasts: { location(cb) { return cb({ pathname: (options.pathname || '/') }); } },
      },

      childContextTypes: {
        theme: PropTypes.object,
        broadcasts: PropTypes.object,
        router: PropTypes.object,
      },
    }, options);
  },
};

export { EnzymeContext };
