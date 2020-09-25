import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import Courses from '../../models/courses-map';
import Router from '../../helpers/router';
import Dashboard from './dashboard';
import Loading from 'shared/components/loading-animation';

import './styles.scss';

export default
@observer
class QuestionsDashboardShell extends React.Component {

  @computed get course() {
    const { courseId } = Router.currentParams();
    return Courses.get(courseId);
  }

  componentDidMount() {
    if (!this.course.referenceBook.ensureLoaded()) {
      this.course.referenceBook.fetch();
    }
  }

  render() {
    if (!this.course.referenceBook.api.hasBeenFetched) { return <Loading />; }
    return <Dashboard course={this.course} />;
  }

}
