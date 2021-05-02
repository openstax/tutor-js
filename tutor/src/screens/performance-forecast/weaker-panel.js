import PropTypes from 'prop-types';
import React from 'react';
import { Row } from 'react-bootstrap';
import WeakerSections from './weaker-sections';
import PracticeWeakestButton from '../../components/buttons/practice-weakest';

// eslint-disable-next-line react/prefer-stateless-function
export default class WeakerPanel extends React.Component {
    static propTypes = {
        course:              PropTypes.object.isRequired,
        performance:         PropTypes.object.isRequired,
        weakerTitle:         PropTypes.string.isRequired,
        weakerExplanation:   PropTypes.node.isRequired,
        weakerEmptyMessage:  PropTypes.string.isRequired,
        canPractice:         PropTypes.bool,
        sectionCount:        PropTypes.number,
    };

    render() {
        // Do not render if we have no sections
        let practiceBtn;
        const { performance } = this.props

        if (performance.children.length == 0) { return null }

        // Only show the practice button if practice is allowed and weakest sections exit
        if (this.props.canPractice && performance.canDisplayWeakest) {
            practiceBtn = <PracticeWeakestButton title="Practice All" courseId={this.props.course.id} />;
        }

        return (
            <>
                <Row className="weaker-header">
                    <h3>
                        {this.props.weakerTitle}
                    </h3>
                </Row>
                <div className="chapter-panel weaker">
                    <div className="chapter metric">
                        <span className="title">
                            {this.props.weakerTitle}
                        </span>
                        {this.props.weakerExplanation}
                        {practiceBtn}
                    </div>
                    <WeakerSections {...this.props} />
                </div>
            </>
        );
    }
}
