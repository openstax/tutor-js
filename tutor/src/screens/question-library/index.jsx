import React from 'react';
import { computed } from 'mobx';
import { observer } from 'mobx-react';

import Courses from '../../models/courses-map';
import Router from '../../helpers/router';
import Dashboard from './dashboard';
import Loading from '../../components/loading-screen';

import './styles.scss';

@observer
export default class QuestionsDashboardShell extends React.Component {

  @computed get course() {
    const { courseId } = Router.currentParams();
    return Courses.get(courseId);
  }

  componentDidMount() {
    this.course.referenceBook.fetch();
  }

  render() {
    if (!this.course.referenceBook.api.hasBeenFetched) { return <Loading />; }
    return <Dashboard course={this.course} />;
  }

}
