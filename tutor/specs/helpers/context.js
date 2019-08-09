import PropTypes from 'prop-types';
import React from 'react';
import merge from 'lodash/merge';
import TestBackend from 'react-dnd-test-backend';
import TestRouter from './test-router';
import { MemoryRouter as Router } from 'react-router-dom';
import Theme from '../../src/theme';
import { ThemeProvider } from 'styled-components';
import { DragDropContext } from 'react-dnd';
import TutorTheme from '../../src/theme';
import { Navbar } from '../../src/components/navbar';
import { NavbarContext } from '../../src/components/navbar/context';
import ModalManager from '../../src/components/modal-manager';
import TourConductor from '../../src/components/tours/conductor';
import { SpyMode } from 'shared';
import { observable, action } from 'mobx';
import { observer, Provider } from 'mobx-react';

function wrapInDnDTestContext(DecoratedComponent) {
  return DragDropContext(TestBackend)(
    (props) => <DecoratedComponent {...props} />
  );
}
export { wrapInDnDTestContext };

class CourseContext {
  @observable course;
  constructor(c) { this.course = c; }
}

@observer
class TutorSpecLayout extends React.Component {
  courseContext = new CourseContext(this.props.course);
  topNavbarContext = new NavbarContext();
  bottomNavbarContext = new NavbarContext();
  @action.bound setSecondaryTopControls(controls) {
    this.secondaryTopControls = controls;
  }
  @action.bound setTopToolbarCollapsed(isCollapsed) {
    this.isTopToolbarCollapsed = isCollapsed;
  }
  render() {
    return (
      <Provider
        topNavbar={this.topNavbarContext}
        courseContext={this.courseContext}
        bottomNavbar={this.bottomNavbarContext}
        setSecondaryTopControls={this.setSecondaryTopControls}
      >
        <div>
          <Navbar area="header" context={this.topNavbarContext}
            isDocked={Boolean(this.secondaryTopControls)} />
          {this.secondaryTopControls &&
            <SecondaryToolbar
              controls={this.secondaryTopControls}
              setCollapsed={this.setTopToolbarCollapsed}
            />}
          {this.props.children}
          <Navbar area="footer" context={this.bottomNavbarContext} />
        </div>
      </Provider>
    );
  }

}

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
    return (
      <ThemeProvider theme={Theme}>
        <Router {...routerProps} ref="router">
          <C.DnDContext>
            <SpyMode.Wrapper>
              <ModalManager>
                <TourConductor tourContext={withTours}>
                  <TutorSpecLayout>
                    {child}
                  </TutorSpecLayout>
                </TourConductor>
              </ModalManager>
            </SpyMode.Wrapper>
          </C.DnDContext>
        </Router>
      </ThemeProvider>
    );
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
