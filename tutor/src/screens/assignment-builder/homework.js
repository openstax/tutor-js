import {
  React, PropTypes, observer, cn,
} from 'vendor';
import { isEmpty } from 'lodash';
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
    const { ux, ux: { plan, form } } = this.props;

    return (
      <Wrapper ux={ux}>

        <Card>

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
                      invalid: ux.showErrors && !plan.hasExercises,
                    })}
                    onClick={ux.onShowSectionSelection}
                    variant="default"
                  >+ Select Problems</Button>)}
                {form.showErrors && isEmpty(ux.selectedExercises) && (
                  <span className="problems-required">
                    Please select problems for this assignment.
                  </span>)}
              </Col>
            </Row>
          </Card.Body>
          <PlanFooter ux={ux} />
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
