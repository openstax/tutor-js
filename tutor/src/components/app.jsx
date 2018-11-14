import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

import Router from '../helpers/router';
import Analytics from '../helpers/analytics';
import Navbar from './navbar';
import MatchForTutor from './match-for-tutor';

import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import User from '../models/user';
import { SpyMode } from 'shared';
import Courses from '../models/courses-map';
import { TransitionActions } from '../flux/transition';

import TourConductor from './tours/conductor';

const RouteChange = function(props) {
  TransitionActions.load(props.pathname);
  return <span />;
};

RouteChange.propTypes = {
  pathname: PropTypes.string.isRequired,
};

class App extends React.Component {

  static propTypes = {
    location: PropTypes.shape({
      pathname: PropTypes.string,
    }).isRequired,
  }

  static contextTypes = {
    router: PropTypes.object,
  }

  componentDidMount() {
    Analytics.setGa(window.ga);
    User.recordSessionStart();
    this.storeHistory();
  }

  componentDidUpdate() {
    this.storeHistory();
  }

  storeHistory() {
    Analytics.onNavigation(this.props.location.pathname);
    TransitionActions.load(this.props.location.pathname);
  }

  render() {
    const { params } = this.context.router.route.match;
    const { courseId } = params;
    const course = courseId ? Courses.get(courseId) : null;
    const classNames = classnames('tutor-app', 'openstax-wrapper', {
      'is-college':     course && course.is_college,
      'is-high-school': course && !course.is_college,
    });

    return (
      <div className={classNames}>
        <SpyMode.Wrapper>
          <Navbar.context>
            <TourConductor>
              <Navbar.bar />
              <MatchForTutor routes={Router.getRenderableRoutes()} />
            </TourConductor>
          </Navbar.context>
        </SpyMode.Wrapper>
      </div>
    );
  }

}


export default DragDropContext(HTML5Backend)(App);
