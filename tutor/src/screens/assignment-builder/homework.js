import {
  React, PropTypes, observer, cn,
} from '../../helpers/react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import Header from './header';
import TaskPlanBuilder from './builder';
import ChooseExercises from './homework/choose-exercises';
import ReviewExercises from './homework/review-exercises';
import FeedbackSetting from './feedback';
import PlanFooter from './footer';
import Wrapper from './wrapper';
import UX from './ux';
import sharedExercises, { ExercisesMap } from '../../models/exercises';

@observer
class Homework extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
    exercises:  PropTypes.instanceOf(ExercisesMap),
  }

  static defaultProps = {
    exercises: sharedExercises,
  };

  render() {
    const { ux, ux: { plan } } = this.props;

    return (
      <Wrapper planType={plan.type}>
        <Card className={cn('edit-homework', 'dialog', {
          'is-invalid-form': ux.hasError,
          hide: ux.isShowingSectionSelection,
        })}>

          <Header plan={plan} onCancel={ux.onCancel} />

          <Card.Body>
            <TaskPlanBuilder ux={ux} />
            <Row>
              <Col xs={8}>
                <FeedbackSetting plan={plan} />
              </Col>
            </Row>
            <Row>
              <Col xs={12} md={12}>
                {!plan.isVisibleToStudents && (
                  <Button
                    id="select-sections"
                    className={cn({
                      invalid: ux.hasError && !plan.hasExercises,
                    })}
                    onClick={ux.onShowSectionSelection}
                    variant="default"
                  >+ Select Problems</Button>)}
                {ux.hasError && !ux.hasExercises && (
                  <span className="problems-required">
                    Please select problems for this assignment.
                  </span>)}
              </Col>
            </Row>
          </Card.Body>
          <PlanFooter
            ux={ux}
            onPublish={this.onPublish}
            onSave={this.onSave}
            onCancel={this.onCancel}
            hasError={ux.hasError}

            getBackToCalendarParams={this.getBackToCalendarParams}
            goBackToCalendar={this.goBackToCalendar}
          />
        </Card>
        {ux.isShowingSectionSelection && (
          <ChooseExercises
            ux={ux}
            exercises={this.props.exercises}
            cancel={this.cancelSelection}
            hide={this.hideSectionTopics}
          />)}
        {ux.isShowingExerciseReview && (
          <ReviewExercises ux={ux} />)}
      </Wrapper>
    );
  }
}

export default Homework;
