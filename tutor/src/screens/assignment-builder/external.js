import {
  React, PropTypes, observable, action, observer, cn,
} from '../../helpers/react';
import { pick, get } from 'lodash';
import { Card, Row, Col } from 'react-bootstrap';
import { idType } from 'shared';
import Header from './header';
import { TutorInput } from '../../components/tutor-input';
import { TaskPlanStore, TaskPlanActions } from '../../flux/task-plan';
import { TaskingStore } from '../../flux/tasking';
import PlanFooter from './footer';
import PlanMixin from './plan-mixin';
import TaskPlanBuilder from './builder';
import Wrapper from './wrapper';
import UX from './ux';

@observer
class External extends React.Component {

  static propTypes = {
    ux: PropTypes.instanceOf(UX).isRequired,
  }

  render() {
    const { ux, ux: { plan } } = this.props;

    return (
      <Wrapper planType="external">
        <Card
          className={cn('edit-external', 'dialog', { 'is-invalid-form': ux.hasError })}
        >
          <Header plan={plan} onCancel={ux.onCancel} />
          <Card.Body>
            <TaskPlanBuilder ux={ux} />
            <Row>
              <Col xs={12} md={12}>
                <TutorInput
                  disabled={!plan.canEdit}
                  label="Assignment URL"
                  {...ux.form.$('externalUrl').bind()}
                />
              </Col>
            </Row>
          </Card.Body>
          <PlanFooter ux={ux} />
        </Card>
      </Wrapper>
    );
  }
}

export default External;
