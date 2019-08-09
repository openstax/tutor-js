import '../../resources/styles/tutor.scss';
import PropTypes from 'prop-types';
import { observer } from 'mobx-react';
import React from 'react';
import { get } from 'lodash';
import S from '../helpers/string';
import classnames from 'classnames';
import Router from '../helpers/router';
import Analytics from '../helpers/analytics';
import MatchForTutor from './match-for-tutor';
import TeacherAsStudentFrame from '../components/teacher-as-student-frame';
import { DragDropContext } from 'react-dnd';
import HTML5Backend from 'react-dnd-html5-backend';
import User from '../models/user';
import { SpyMode } from 'shared';
import Courses from '../models/courses-map';
import { TransitionActions } from '../flux/transition';
import ModalManager from './modal-manager';
import TourConductor from './tours/conductor';
import ErrorBoundary from './error-monitoring/boundary';
import { TutorLayout } from './tutor-layout';

const RouteChange = function(props) {
  TransitionActions.load(props.pathname);
  return <span />;
};

RouteChange.propTypes = {
  pathname: PropTypes.string.isRequired,
};

@observer
class App extends React.Component {

  static propTypes = {
    app: PropTypes.object.isRequired, // can't use instanceOf (circular dep)
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
    const { courseId } = Router.currentParams();
    const course = courseId ? Courses.get(courseId) : null;
    const routeName = S.dasherize(
      get(Router.currentMatch(), 'entry.name', '')
    );
    const classNames = classnames(
      'tutor-app', 'openstax-wrapper', routeName, {
        'is-college':     course && course.is_college,
        'is-high-school': course && !course.is_college,
      }
    );

    return (
      <div className={classNames}>
        <ErrorBoundary app={this.props.app}>
          <TeacherAsStudentFrame course={course} routeName={routeName}>
            <SpyMode.Wrapper>
              <ModalManager>
                <TourConductor>
                  <TutorLayout course={course}>
                    <MatchForTutor routes={Router.getRenderableRoutes()} />
                  </TutorLayout>
                </TourConductor>
              </ModalManager>
            </SpyMode.Wrapper>
          </TeacherAsStudentFrame>
        </ErrorBoundary>
      </div>
    );
  }

}


export default DragDropContext(HTML5Backend)(App);
