import PropTypes from 'prop-types';
import React from 'react';
import { computed, action } from 'mobx';
import { observer } from 'mobx-react';
import { Button } from 'react-bootstrap';
import Router from '../../helpers/router';
import { withRouter } from 'react-router-dom';

export default
@withRouter
@observer
class Surveys extends React.Component {

  static propTypes = {
    course: PropTypes.object.isRequired,
    history: PropTypes.object.isRequired,
  }

  @computed get survey() {
    const surveys = this.props.course.studentTaskPlans.researchSurveys;
    return surveys ? surveys.array[0] : null;

  }

  @action.bound onClick() {
    this.props.history.push(
      Router.makePathname('researchSurvey',
        { courseId: this.props.course.id, surveyId: this.survey.id })
    );
  }

  render() {
    const { survey } = this;
    if (!survey) { return null; }

    return (
      <div className="research-surveys card">
        <div className='actions-box'>
          <h1 className='panel-title'>Research Survey Available</h1>
          <p>
            You’ve been selected to participate in an optional
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
