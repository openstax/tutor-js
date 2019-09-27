import {
  React, PropTypes, observer,
} from 'vendor';
import { Card, Row, Col } from 'react-bootstrap';
import Header from './header';
import { TutorInput } from '../../components/tutor-input';
import PlanFooter from './footer';
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
      <Wrapper ux={ux}>
        <Card>
          <Header plan={plan} onCancel={ux.onCancel} />
          <Card.Body>
            <TaskPlanBuilder ux={ux} />
            <Row>
              <Col xs={12} md={12}>
                <TutorInput
                  label="Assignment URL"
                  name="externalUrl"
                  className="external-url"
                  {...ux.form.externalUrl}
                />
                {!plan.isExternalUrlValid && (
                  <div className="hint required-hint valid-external-url-required">A valid URL is required</div>)}
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
