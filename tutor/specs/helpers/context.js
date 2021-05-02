import PropTypes from 'prop-types';
import React from 'react';
import { wrapInTestContext } from 'react-dnd-test-utils';
import { MemoryRouter as Router } from 'react-router-dom';
import Theme from '../../src/theme';
import { ThemeProvider } from 'styled-components';
import { Navbar } from '../../src/components/navbar';
import { NavbarContext } from '../../src/components/navbar/context';
import ModalManager from '../../src/components/modal-manager';
import TourConductor from '../../src/components/tours/conductor';
import { SpyMode } from 'shared';
import { observable, action } from 'mobx';
import { observer, Provider } from 'mobx-react';
import { SecondaryToolbar } from '../../src/components/navbar/secondary-toolbar'
import { modelize } from 'modeled-mobx';

function wrapInDnDTestContext(DecoratedComponent) {
    return wrapInTestContext(DecoratedComponent);
}
export { wrapInTestContext as wrapInDnDTestContext };

class CourseContext {
    @observable course;
    constructor(c) { this.course = c; }
}

@observer
class TutorSpecLayout extends React.Component {
    courseContext = new CourseContext(this.props.course);
    topNavbarContext = new NavbarContext();
    bottomNavbarContext = new NavbarContext();
    @observable secondaryTopControls = null
    @observable isTopToolbarCollapsed = false
    @action setSecondaryTopControls = (controls) => {
        this.secondaryTopControls = controls;
    }
    @action setTopToolbarCollapsed = (isCollapsed) => {
        this.isTopToolbarCollapsed = isCollapsed;
    }
    constructor(props) {
        super(props)
        modelize(this)
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
                    <Navbar
                        area="header" context={this.topNavbarContext}
                        isDocked={Boolean(this.secondaryTopControls)}
                    />
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

const R = React.forwardRef(({ children, path }, ref) => (
    <Router initialIndex={0} initialEntries={[path]} ref={ref}>
        {children}
    </Router>
));

R.defaultProps = {
    withRef: false,
    path: '/',
};

export { R };

// eslint-disable-next-line react/prefer-stateless-function
export class C extends React.Component {
    static DnDContext = wrapInDnDTestContext(({ children }) => children);
    static propTypes = {
        path: PropTypes.string,
        withRef: PropTypes.bool,
        withTours: PropTypes.object,
        children: PropTypes.element.isRequired,
    }

    routerRef = React.createRef();
    componentRef = React.createRef();

    get router() {
        return this.routerRef.current;
    }

    get pathname() {
        return this.routerRef.current.history.location.pathname;
    }

    get component() {
        return this.componentRef.current;
    }

    render() {
        const { children, withRef, path, noRef, withTours } = this.props;

        const child = withRef ?
            React.cloneElement(children, { ref: this.componentRef }) : children;

        return (
            <ThemeProvider theme={Theme}>
                <R ref={this.routerRef} noRef={noRef} path={path}>
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
                </R>
            </ThemeProvider>
        );
    }
}
