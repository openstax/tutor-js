import React from 'react';
import { partial } from 'lodash';
import { observer } from 'mobx-react';
import { computed, action, observable } from 'mobx';
import AnswerModel  from 'shared/model/exercise/answer';
import cn from 'classnames';
//import _ from 'underscore';
//import { AnswerActions, AnswerStore } from 'stores/answer';

@observer
export default class Answer extends React.Component {

  static propTypes = {
    answer: React.PropTypes.instanceOf(AnswerModel).isRequired,
    canMoveUp: React.PropTypes.bool.isRequired,
    canMoveDown: React.PropTypes.bool.isRequired,
    moveAnswer: React.PropTypes.func.isRequired,
    removeAnswer: React.PropTypes.func.isRequired,
    changeCorrect: React.PropTypes.func.isRequired,
  };

  state = {};

  @action.bound updateFeedback(ev) {
    this.props.answer.feedback_html = ev.target.value;
  }

  @action.bound updateContent(ev) {
    this.props.answer.content_html = ev.target.value;
  }



  //   AnswerActions.updateContent(this.props.id, event.target != null ? event.target.value : undefined);
  //   return (
  //     this.sync()
  //   );
  // };

  // changeCorrect = (event) => {
  //   this.props.changeAnswer(this.props.id);
  // };
  //
  render() {
    const { answer, canMoveUp, canMoveDown } = this.props;

    return (
      <li className={cn('answer', { 'correct-answer': answer.isCorrect })}>
        <p>
          <span className="answer-actions">
            <a
              className="pull-right"
              onClick={partial(this.props.removeAnswer, answer)}>
              <i className="fa fa-ban" />
            </a>
            {canMoveUp &&
              <a
                className="pull-right"
                onClick={partial(this.props.moveAnswer, answer, 1)}>
                <i className="fa fa-arrow-circle-down" />
              </a>
            }
            {canMoveDown &&
              <a
                className="pull-right"
                onClick={partial(this.props.moveAnswer, answer, -1)}>
                <i className="fa fa-arrow-circle-up" />
              </a>
            }
            <a
              className="pull-right is-correct"
              onClick={partial(this.props.changeCorrect, answer)}
            >
              <i className="fa fa-check-circle-o" />
            </a>
          </span>
        </p>
        <label>
          Distractor
        </label>
        <textarea
          onChange={this.updateContent}
          value={answer.content_html}
        />
        <label>
          Choice-Level Feedback
        </label>
        <textarea
          onChange={this.updateFeedback}
          value={answer.feedback_html}
        />
      </li>
    );
  }
}
