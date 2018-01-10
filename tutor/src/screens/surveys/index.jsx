import React from 'react';
import { Survey, Model } from 'survey-react';
import { observable, computed, action, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import Courses from '../../models/courses-map';
import StudentTasks from '../../models/student-tasks';
import LoadingScreen from '../../components/loading-screen';
import NotFound from '../../components/invalid-page';
import CoursePage from '../../components/course-page';

@observer
export default class Surveys extends React.PureComponent {

  static propTypes = {
    params: React.PropTypes.shape({
      courseId: React.PropTypes.string,
      surveyId: React.PropTypes.string,
    }).isRequired,
  }

  componentWillMount() {
    if (!this.studentTasks.api.isFetchedOrFetching) {
      this.studentTasks.fetch();
    }
    Survey.cssType = 'bootstrap';
  }

  @computed get course() {
    return Courses.get(this.props.params.courseId);
  }

  @computed get studentTasks() {
    return this.course.studentTasks;
  }

  @computed get survey() {
    return this.studentTasks.researchSurveys ?
      this.studentTasks.researchSurveys.get(this.props.params.surveyId) : null;
  }

  @computed get model() {
    return this.survey ? new Model(this.survey.surveyJS) : null;
  }

  @action.bound onComplete(survey) {
    this.survey.response = survey.data;
    this.survey.save(); //response = survey.data;
  }

  render() {
    if (this.studentTasks.api.isPending) { return <LoadingScreen />; }
    const { course, model, survey } = this;

    if (!survey) { return <NotFound />; }

    return (
      <CoursePage
        className="research-surveys"
        title={course.name}
        subtitle={course.termFull}
        course={course}
      >
        <h1>Survey “{survey.title}”</h1>
        <Survey model={model} onComplete={this.onComplete} />
      </CoursePage>
    );
  }


}
