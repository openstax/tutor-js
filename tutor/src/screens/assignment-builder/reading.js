import {
  React, PropTypes, observable, action, observer, cn,
} from '../../helpers/react';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import Header from './header';
import ReviewSelections from './reading/review-selection';
import TaskPlanBuilder from './builder';
import ChooseExercises from './homework/choose-exercises';
import ReviewExercises from './homework/review-exercises';
import FeedbackSetting from './feedback';
import PlanFooter from './footer';
import Wrapper from './wrapper';
import UX from './ux';
import NoQuestionsTooltip from './reading/no-questions-tooltip';
import SelectSections from './select-sections';

@observer
class Reading extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  }

  render() {
    const { ux, ux: { plan } } = this.props;

    let addReadingsButton, readingsRequired, selectReadings;
    //    const { id, courseId } = this.props;
    //    const builderProps = pick(this.state, 'isVisibleToStudents', 'isEditable', 'isSwitchable');
    //    const hasError = this.hasError();

    //     const ecosystemId = TaskPlanStore.getEcosystemId(id, courseId);
    //     const topics = TaskPlanStore.getTopics(id);

    //    const addReadingText = (topics != null ? topics.length : undefined) ? 'Add More Readings' : 'Add Readings';

    const formClasses = cn('edit-reading', 'dialog', {
      'is-invalid-form': ux.hasError,
    });

    if (ux.hasError && isEmpty(ux.selectedPageIds)) {
      readingsRequired = (
        <span className="readings-required">
          Please add readings to this assignment.
        </span>
      );
    }

    return (
      <Wrapper planType="reading" cardClassName={formClasses}>
        <Card className={formClasses}>
          <Header plan={plan} onCancel={ux.onCancel} />
          <Card.Body>
            <TaskPlanBuilder ux={ux} />
            <Row>
              <Col xs={12} md={12}>
                <ReviewSelections ux={ux} />
                {ux.canEdit && (
                  <Button
                    id="select-sections"
                    className={cn('select-sections-btn', {
                      'invalid': ux.hasError || isEmpty(ux.selectedPageIds),
                    })}
                    onClick={ux.onShowSectionSelection}
                    variant="default"
                  >
                    {'+ '}
                    {isEmpty(ux.selectedPageIds) ? 'Add Readings' : 'Add More Readings'}
                  </Button>)}
                <NoQuestionsTooltip />
                {readingsRequired}
              </Col>
            </Row>
          </Card.Body>

          <PlanFooter ux={ux} />

        </Card>
        {ux.isShowingSectionSelection && (
          <SelectSections
            ux={ux}
            header="Select Readings"
            primary={
              <Button
                key="add-readings-btn"
                id="add-section-to-reading"
                variant="primary"
                onClick={ux.onSelectSectionConfirm}
                disabled={isEmpty(ux.selectedPageIds)}
              >
                Add Readings
              </Button>
            }
          />
        )}
      </Wrapper>
    );
  }
}

export default Reading;

// export { ReadingPlan };
// const ReadingShell = PlanMixin.makePlanRenderer('reading', ReadingPlan);
// export default ReadingShell;
