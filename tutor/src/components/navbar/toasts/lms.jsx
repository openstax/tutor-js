import React from 'react';
import { observer } from 'mobx-react';
import { observable, action } from 'mobx';
import { Button } from 'react-bootstrap';
import Icon from '../../icon';
import WarningModal from '../../warning-modal';
import NewTabLink from '../../new-tab-link';
import { JobCompletion } from '../../../models/jobs/queue';

const renderNoScores = (footer) => (
  <WarningModal
    backdrop={false}
    title="No scores to send"
    footer={footer}
  >
    <p>
      This course has no scores to send, either because there are no
      students enrolled or no assignments have been created.
    </p>
  </WarningModal>
);

const renderFailedToSend = (footer) => (
  <WarningModal
    backdrop={false}
    title="Scores not sent"
    footer={footer}
  >
    <p>
      You may need to perform extra steps in your LMS to send
      OpenStax Tutor course averages to your gradebook.
    </p>
    <div>
      <p>
        For more instructions, consult this support article:
      </p>
      <p>
        <NewTabLink
          to="http://4tk3oi.axshare.com/salesforce_support_page_results.html#choose_support_article=All&CSUM=1"
        >
          send course averages to your LMS
        </NewTabLink>
      </p>
    </div>
  </WarningModal>
);

@observer
export class Failure extends React.Component {

  static propTypes = {
    dismiss: React.PropTypes.func.isRequired,
    job: React.PropTypes.instanceOf(JobCompletion).isRequired,
  }

  @observable showDetails = false;
  @action.bound onShowDetails() { this.showDetails = true; }

  render() {
    const { job } = this.props;

    const { info: { data: {
      num_callbacks,
    } } } = job;

    if (this.showDetails) {
      const footer = <Button onClick={this.props.dismiss}>Close</Button>;
      return num_callbacks === 0 ? renderNoScores(footer) : renderFailedToSend(footer);
    }

    return (
      <div className="toast scores failure">
        <div className="heading">
          Scores not sent
          <Icon type="close" onClick={this.props.dismiss} />
        </div>
        <Button bsStyle="link" onClick={this.onShowDetails}>Details</Button>
      </div>
    );
  }
}

export function Success() {
  return (
    <div className="toast success">
      Scores successfully sent
    </div>
  );
}
