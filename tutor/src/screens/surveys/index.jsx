import React from 'react';
import { Survey, Model, StylesManager } from 'survey-react';
import { observable, computed, action, observe } from 'mobx';
import { Panel } from 'react-bootstrap';
import Router from '../../helpers/router';
import { observer, inject } from 'mobx-react';
import Courses from '../../models/courses-map';
import Course from '../../models/course';
import { idType } from 'shared';
import StudentTasks from '../../models/student-tasks';
import LoadingScreen from '../../components/loading-screen';
import NotFound from '../../components/invalid-page';
import CoursePage from '../../components/course-page';
import BackButton from '../../components/buttons/back-button';
import './styles.scss';

const ThankYou = ({ survey }) => {
  const params = Router.currentParams();
  const backLink = params.courseId ? { to: 'dashboard', text: 'Back to Dashboard', params } :
    { to: 'myCourses', text: 'Back to My Courses' };

  return (
    <Panel>
      <h3>Thank you for completing the survey!</h3>
      <p>
        <BackButton fallbackLink={backLink} />
      </p>
    </Panel>
  );
};


@observer
export default class Surveys extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.instanceOf(Course),
    params: React.PropTypes.shape({
      courseId: idType,
      surveyId: idType,
    }).isRequired,
  }

  componentWillMount() {
    if (!this.studentTasks.api.isFetchedOrFetching) {
      this.studentTasks.fetch();
    }
  }

  @computed get course() {
    return this.props.course || Courses.get(this.props.params.courseId);
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
    this.survey.save();
  }

  render() {
    if (this.studentTasks.api.isPending) { return <LoadingScreen />; }
    const { course, model, survey } = this;

    if (!survey) { return <NotFound />; }
    if (survey.api.isPending) { return <LoadingScreen message="Saving response…" />; }
    if (survey.isComplete) { return <ThankYou survey={survey} /> };

    return (
      <CoursePage
        className="research-surveys"
        title={course.name}
        subtitle={course.termFull}
        course={course}
      >
        <h3>Survey “{survey.title}”</h3>
        <Survey model={model} onComplete={this.onComplete} />
      </CoursePage>
    );
  }


}
