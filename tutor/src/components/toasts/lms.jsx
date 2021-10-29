import PropTypes from 'prop-types';
import React from 'react';
import { observer } from 'mobx-react';
import pluralize from 'pluralize';
import { observable, action, computed, modelize } from 'shared/model'
import { Button, Table } from 'react-bootstrap';
import { isEmpty } from 'lodash';
import { Icon } from 'shared';
import WarningModal from '../warning-modal';
import NewTabLink from '../new-tab-link';
import { downloadData, arrayToCSV } from '../../helpers/download-data';

const Troubleshoot = () => (
    <NewTabLink
        href="https://openstax.secure.force.com/help/articles/FAQ/How-do-I-send-student-scores-from-OpenStax-Tutor-to-my-learning-management-system?search=troubleshoot%20sending%20scores"
    >
    Troubleshoot sending scores to your LMS
    </NewTabLink>
);

@observer
class LMSErrors extends React.Component {
    static propTypes = {
        toast: PropTypes.object.isRequired,
        footer: PropTypes.node.isRequired,
        dismiss: PropTypes.any,
    }

    @observable displayInfo = false;

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound toggleInfo() {
        this.displayInfo = !this.displayInfo;
    }

    @computed get errorData() {
        return this.props.toast.info.errors.map((e) =>
            [
                e.student_identifier,
                e.student_name,
                isNaN(e.score) ? '---' : `${Math.round(e.score * 100)}%`,
                e.message,
            ]);
    }

    @action.bound startDownload() {
        const rows = [
            [ 'Student ID', 'Name', 'Course Average', 'Reason' ],
        ].concat(this.errorData);
        downloadData(
            arrayToCSV(rows),
            `course-${this.props.toast.info.data.course.id}-lms-score-errors.csv`,
            'text/csv'
        );
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
        const { props: { toast } } = this;

        return (
            <div>
                <p>
            Course averages
            for {pluralize('student', toast.info.errors.length, true)} could not be
            sent successfully to your LMS. There may be an issue with
            your LMS, or you may need to update your weights calculation in Student Scores.
                </p>
                <Troubleshoot />
                <div className="controls">
                    <Button variant="primary" onClick={this.toggleInfo}>
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
                            <th>Course Average</th>
                            <th>Reason</th>
                            <th><Icon type="download" onClick={this.startDownload}/></th>
                        </tr>
                    </thead>
                    <tbody>
                        {this.errorData.map(([id, name, score, message], key) => (
                            <tr key={key}>
                                <td>{id}</td>
                                <td>{name}</td>
                                <td>{score}</td>
                                <td>{message}</td>
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
                    to="https://openstax.secure.force.com/help/articles/FAQ/How-do-I-send-student-scores-from-OpenStax-Tutor-to-my-learning-management-system"
                >
          Send course averages to your LMS
                </NewTabLink>
            </p>
        </div>
    </WarningModal>
);

@observer
class Failure extends React.Component {
    static propTypes = {
        dismiss: PropTypes.func.isRequired,
        toast: PropTypes.object.isRequired,
    }

    @observable showDetails = false;

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound onShowDetails() { this.showDetails = true; }

    render() {
        const { toast, dismiss } = this.props;

        const { info: { errors, data: {
            num_callbacks,
        } } } = toast;

        if (this.showDetails) {
            const footer = <Button onClick={dismiss}>Close</Button>;
            if (!isEmpty(errors)) {
                return <LMSErrors {...{ toast, footer, dismiss }} />;
            } else if (num_callbacks) {
                return renderFailedToSend(footer);
            } else {
                return renderNoScores(footer);
            }
        }

        return (
            <div className="toast scores failure">
                <div className="title">
                    {num_callbacks ? 'Some scores not sent' : 'Scores not sent'}
                    <Icon type="close" className="dismiss" onClick={this.props.dismiss} />
                </div>
                <div className="body">
                    <Button variant="link" className="details" onClick={this.onShowDetails}>Details</Button>
                </div>
            </div>
        );
    }
}

function Success() {
    return (
        <div className="toast success">
            <div className="title">Scores sent successfully</div>
            <div className="body">Check your LMS gradebook for the updates</div>
        </div>
    );
}

export { Failure, Success, LMSErrors };
