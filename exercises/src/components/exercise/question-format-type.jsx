import PropTypes from 'prop-types';
import React from 'react';
import { map } from 'lodash';
import { observer } from 'mobx-react';
import { modelize } from 'shared/model'
import { action } from 'mobx';
import { Popover, OverlayTrigger } from 'react-bootstrap';
import styled from 'styled-components';
import Question  from 'shared/model/exercise/question';
import { Icon } from 'shared';

const StyledTwoStepInfo = styled(Popover)`
  padding: 1rem;
`;

@observer
class QuestionFormatType extends React.Component {
    static propTypes = {
        question: PropTypes.instanceOf(Question).isRequired,
        addAnswer: PropTypes.func,
    };

    constructor(props) {
        super(props);
        modelize(this);
    }

    @action.bound updateRadioFormat(ev) {
        if (ev.target.value === 'multiple-choice' && this.props.question.answers.length === 0) {
            this.props.addAnswer()
        }
        this.props.question.setExclusiveFormat(ev.target.value);
    }

    @action.bound setChoiceRequired(ev) {
        this.props.question.toggleFormat('free-response', ev.target.checked);
    }

    @action.bound preserveOrderClicked(ev) {
        this.props.question.is_answer_order_important = ev.target.checked;
    }

    renderTwoStepInfo() {
        return (
            <OverlayTrigger
                trigger="hover"
                placement="right"
                overlay={
                    <StyledTwoStepInfo>
                        <p>
                            A two-step question requires students to recall an answer from memory
                            before viewing the multiple-choice options.
                            Our research shows that retrieval practice helps to improve knowledge retention.
                        </p>
                    </StyledTwoStepInfo>
                }
            >
                <Icon
                    type="question-circle"
                    className="question-info-icon"
                />
            </OverlayTrigger>
        );
    }

    render() {
        const { question } = this.props;

        return (
            <div className="format-type">
                {map(question.allowedFormatTypes, (name, id) => (
                    <div key={id}>
                        <input
                            type="radio"
                            id={`input-${id}`}
                            name={`${question.index}-formats`}
                            value={id}
                            onChange={this.updateRadioFormat}
                            checked={question.hasFormat(id)}
                            disabled={id === 'open-ended' && question.answers.length > 0}
                        />
                        <label htmlFor={`input-${id}`}>
                            {name}
                        </label>
                    </div>
                ))}
                {question.hasFormat('multiple-choice') && (
                    <div className="multi-choice-boxes">
                        <div className="requires-choices">
                            <input
                                type="checkbox"
                                id="input-rq"
                                checked={question.hasFormat('free-response')}
                                onChange={this.setChoiceRequired}
                            />
                            <label htmlFor="input-rq">
                                Two Step Question
                            </label>
                            {this.renderTwoStepInfo()}
                        </div>
                        <div className="order-matters">
                            <input
                                type="checkbox"
                                id="input-om"
                                checked={question.is_answer_order_important}
                                onChange={this.preserveOrderClicked}
                            />
                            <label htmlFor="input-om">
                                Order Matters
                            </label>
                        </div>
                    </div>
                )}
            </div>
        );
    }
}


export default QuestionFormatType;
