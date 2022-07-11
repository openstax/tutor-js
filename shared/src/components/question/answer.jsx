import React from 'react';
import PropTypes from 'prop-types';
import { partial, pick, debounce } from 'lodash';
import { observer } from 'mobx-react';
import { action, modelize } from '../../model'
import keymaster from 'keymaster';
import Icon from '../icon';
import { idType } from '../../helpers/react';
import keysHelper from '../../helpers/keys';
import ArbitraryHtmlAndMath from '../html';
import { SimpleFeedback } from './feedback';
import cn from 'classnames';
import { Answer as OSAnswer } from '@openstax/assignment-components';

let idCounter = 0;

@observer
export default
class Answer extends React.Component {

    static propTypes = {
        answer: PropTypes.object.isRequired, // both shared exercise/answer and tutor/reviewanswer is passed in
        iter: PropTypes.number.isRequired,
        qid: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
        ]).isRequired,
        type: PropTypes.string.isRequired,
        hasCorrectAnswer: PropTypes.bool.isRequired,
        onChangeAnswer: PropTypes.func.isRequired,
        disabled: PropTypes.bool,
        chosenAnswer: PropTypes.array,
        correctAnswerId: idType,
        incorrectAnswerId: idType,
        answered_count: PropTypes.number,
        show_all_feedback: PropTypes.bool,
        keyControl: PropTypes.oneOfType([
            PropTypes.string,
            PropTypes.number,
            PropTypes.array,
        ]),
    };

    static defaultProps = {
        disabled: false,
        show_all_feedback: false,
    };

    static contextTypes = {
        processHtmlAndMath: PropTypes.func,
    };

    constructor(props) {
        super(props)
        modelize(this)
    }

    UNSAFE_componentWillMount() {
        if (this.shouldKey()) { this.setUpKeys(); }
    }

    componentWillUnmount() {
        const { keyControl } = this.props;
        if (keyControl != null) { keysHelper.off(keyControl, 'multiple-choice'); }
    }

    componentDidUpdate(prevProps) {
        const { keyControl } = this.props;

        if (this.shouldKey(prevProps) && !this.shouldKey()) {
            keysHelper.off(prevProps.keyControl, 'multiple-choice');
        }

        if (this.shouldKey() && (prevProps.keyControl !== keyControl)) {
            this.setUpKeys();
        }
    }

    shouldKey = (props) => {
        if (props == null) { ({ props } = this); }
        const { keyControl, disabled } = props;

        return (
            (keyControl != null) && !disabled
        );
    };

    setUpKeys = () => {
        const { answer, onChangeAnswer, keyControl } = this.props;

        const keyInAnswer = debounce(partial(onChangeAnswer, answer), 200, {
            leading: true,
            trailing: false,
        });
        keysHelper.on(keyControl, 'multiple-choice', keyInAnswer);
        return (
            keymaster.setScope('multiple-choice')
        );
    };

    onKeyPress = (ev) => {
        if ((ev.key === 'Enter') && (this.props.disabled !== true)) { this.onChange(); }
        return (
            null
        );
    }; // silence react event return value warning

    @action.bound onChange() {
        this.props.onChangeAnswer(this.props.answer);
    }

    render() {
        let feedback, radioBox, selectedCount, correctIncorrectIcon;
        let {
            answer, iter, qid, type, correctAnswerId, incorrectAnswerId,
            answered_count, hasCorrectAnswer, chosenAnswer, disabled,
        } = this.props;
        if (qid == null) { qid = `auto-${idCounter++}`; }

        if (type === 'teacher-review') {
            const percent = Math.round((answer.selected_count / answered_count) * 100) || 0;
            selectedCount = (
                <span
                    className="selected-count"
                    data-percent={`${percent}`}
                >
                    {answer.selected_count}
                </span>
            );
        }

        if (this.props.show_all_feedback && answer.feedback_html) {
            feedback = (
                <SimpleFeedback key="question-mc-feedback">
                    {answer.feedback_html}
                </SimpleFeedback>
            );
        }

        const htmlAndMathProps = pick(this.context, ['processHtmlAndMath']);

        return (
            <OSAnswer
                type={type}
                iter={iter}
                answer={answer}
                chosenAnswer={chosenAnswer}
                onChangeAnswer={this.onChange}
                disabled={disabled}
                onKeyPress={this.onKeyPress}
                qid={qid}
                correctIncorrectIcon={<Icon type="check" color="green" />}
                selectedCount={selectedCount}
                feedback={feedback}
                correctAnswerId={correctAnswerId}
                incorrectAnswerId={incorrectAnswerId}
                hasCorrectAnswer={hasCorrectAnswer}
            >
                <ArbitraryHtmlAndMath
                    {...htmlAndMathProps}
                    html={answer.content_html} />
            </OSAnswer>
        )
    }
}
