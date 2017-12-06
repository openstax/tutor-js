import React from 'react';
import { observer } from 'mobx-react';
import pluralize from 'pluralize';
import { observable, action, computed } from 'mobx';
import { Button, Panel, Table } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import Icon from '../../icon';
import WarningModal from '../../warning-modal';
import NewTabLink from '../../new-tab-link';
import { JobCompletion } from '../../../models/jobs/queue';
import S from '../../../helpers/string';
import { downloadData, arrayToCSV } from '../../../helpers/download-data';

const Troubleshoot = () => (
  <NewTabLink
    to="http://openstax.force.com/support/articles/FAQ/How-do-I-send-student-scores-from-OpenStax-Tutor-to-my-learning-management-system/?q=lms+scores&l=en_US&c=Products%3ATutor&fs=Search&pn=1"
  >
    Troubleshoot sending scores to your LMS
  </NewTabLink>
);

@observer
export class LMSErrors extends React.Component {

  static propTypes = {
    job: React.PropTypes.instanceOf(JobCompletion).isRequired,
    footer: React.PropTypes.node.isRequired,
  }

  @observable displayInfo = false;

  @action.bound toggleInfo() {
    this.displayInfo = !this.displayInfo;
    console.log(this.displayInfo)
  }

  @computed get errorData() {
    return this.props.job.info.errors.map((e) =>
      [
        e.student_identifier,
        e.student_name,
        S.numberWithTwoDecimalPlaces(e.score * 100),
      ]);
  }

  @action.bound startDownload() {
    const rows = [
      [ 'Student ID', 'Name', 'CourseAverage' ],
    ].concat(this.errorData);
    downloadData(arrayToCSV(rows), 'failed-scores.csv', 'text/csv');
  }

  render() {
    return (
      <WarningModal
        className="lms-push-partial-failure"
        backdrop={false}
        title="Some scores not sent"
      >
        {this.displayInfo ? this.renderInfo() : this.renderMessage()}
      </WarningModal>
    );
  }

  renderMessage() {
    const { props: { job } } = this;

    return (
      <div>
        <p>
          Course averages
          for {pluralize('student', job.info.errors.length, true)} could not be
          sent successfully to your LMS.  There may be an issue with
          your LMS, or something may have happened when students enrolled.
        </p>
        <Troubleshoot />
        <div className="controls">
          <Button bsStyle="primary" onClick={this.toggleInfo}>
            View those scores
          </Button>
          <Button onClick={this.props.dismiss}>
            Close
          </Button>
        </div>
      </div>
    );

  }

  renderInfo() {

    return (
      <div>
        <p>SCORES NOT SENT</p>

        <Table>
          <thead>
            <tr>
              <th>Student ID</th>
              <th>Name</th>
              <th className="average">
                Course Average
                <Icon type="download" onClick={this.startDownload}/>
              </th>
            </tr>
          </thead>
          <tbody>
            {this.errorData.map(([id, name, score], key) => (
              <tr key={key}>
                <td>{id}</td>
                <td>{name}</td>
                <td>{score}%</td>
              </tr>
            ))}
          </tbody>
        </Table>
        <div className="controls">
          <Button className="dark" onClick={this.toggleInfo}>
            Back
          </Button>
          <Button onClick={this.props.dismiss}>
            Close
          </Button>
        </div>

      </div>
    );
  }

}

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
    <Troubleshoot />

  </WarningModal>
);

const renderFailedToSend = (footer) => (
  <WarningModal
    backdrop={false}
    title="Scores not sent"
    footer={footer}
  >
    <p>
      Your course averages could not be sent, either due to a network timeout or a problem in your LMS. Try again on the Scores page.
      If this problem persists, you may need to perform extra steps in your LMS. This support article shows you how:
    </p>
    <div>
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
    const { job, dismiss } = this.props;

    const { info: { errors, data: {
      num_callbacks,
    } } } = job;

    if (this.showDetails) {
      const footer = <Button onClick={dismiss}>Close</Button>;
      if (!isEmpty(errors)) {
        return <LMSErrors {...{ job, footer, dismiss }} />;
      } else if (num_callbacks) {
        return renderFailedToSend(footer);
      } else {
        return renderNoScores(footer);
      }
    }

    return (
      <div className="toast scores failure">
        <div className="heading">
          {num_callbacks ? 'Some scores not sent' : 'Scores not sent'}
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
