import {
  React, PropTypes, observer, cn,
} from 'vendor';
import { Card, Row, Col, Button } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import Header from './header';
import ReviewSelections from './reading/review-selection';
import TaskPlanBuilder from './builder';
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
    const { ux, ux: { form, plan } } = this.props;

    return (
      <Wrapper ux={ux}>
        <Card>
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
                      'invalid': ux.showErrors || isEmpty(ux.selectedPageIds),
                    })}
                    onClick={ux.onShowSectionSelection}
                    variant="default"
                  >
                    {'+ '}
                    {isEmpty(ux.selectedPageIds) ? 'Add Readings' : 'Add More Readings'}
                  </Button>)}
                <NoQuestionsTooltip />
                {form.showErrors && isEmpty(ux.selectedPageIds) && (
                  <span className="readings-required">
                    Please add readings to this assignment.
                  </span>)}
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
