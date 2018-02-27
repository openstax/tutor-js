import React from 'react';
import { observable, action } from 'mobx';
import { observer } from 'mobx-react';


import Courses from '../../models/courses-map';
import LoadableItem from '../loadable-item';
import { UnsavedStateMixin } from '../unsaved-state';
import { ExerciseStore } from '../../flux/exercise';
import Router from '../../helpers/router';
import showDialog from './unsaved-dialog';
import Dashboard from './dashboard';
import Loading from '../loading-screen';


@observer
export default class QuestionsDashboardShell extends React.Component {

  @computed get course() {
    const {courseId} = Router.currentParams();
    const course = Courses.get(courseId);
  }

  componentDidMount() {
    this.course.referenceBook.fetch();
  }

  render() {
    if (!this.course.referenceBook.api.hasBeenFetched) { return <Loading />; }

    return <Dashboard course={course} />;
  }

});

export default QuestionsDashboardShell;
