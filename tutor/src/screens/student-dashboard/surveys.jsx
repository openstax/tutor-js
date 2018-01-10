import React from 'react';
import { observable, computed, action, observe } from 'mobx';
import { observer, inject } from 'mobx-react';
import { Button } from 'react-bootstrap';
import Router from '../../helpers/router';

@observer
export default class Surveys extends React.PureComponent {

  static propTypes = {
    course: React.PropTypes.object.isRequired,
  }

  static contextTypes = {
    router: React.PropTypes.object,
  }

  @computed get survey() {
    const surveys = this.props.course.studentTasks.researchSurveys;
    return surveys ? surveys.array[0] : null;

  }

  @action.bound onClick() {
    this.context.router.history.push(
      Router.makePathname('researchSurvey', { surveyId: this.survey.id })
    );
  }

  render() {
    const { survey } = this;
    if (!survey) { return null; }

    return (
      <div className="research-surveys panel">
        <div className='actions-box'>
          <h1 className='panel-title'>Research Survey Available</h1>
          <p>
            You‘ve been selected to participate in an optional
            research survey named “{survey.title}”.
          </p>
          <p>
            Would you like to complete it now?
          </p>
          <Button
            role="primary"
            onClick={this.onClick}
            className='view-performance-forecast'
          >
            Take Survey
          </Button>
        </div>
      </div>
    );
  }

}
