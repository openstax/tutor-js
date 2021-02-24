import PropTypes from 'prop-types';
import React from 'react';
import { partial } from 'lodash';
import { observer } from 'mobx-react';
import { action } from 'mobx';
import { Icon } from 'shared';
import AnswerModel  from 'shared/model/exercise/answer';
import cn from 'classnames';

@observer
export default
class Answer extends React.Component {

  static propTypes = {
      answer: PropTypes.instanceOf(AnswerModel).isRequired,
      canMoveUp: PropTypes.bool.isRequired,
      canMoveDown: PropTypes.bool.isRequired,
      moveAnswer: PropTypes.func.isRequired,
      removeAnswer: PropTypes.func.isRequired,
      changeCorrect: PropTypes.func.isRequired,
  };

  state = {};

  @action.bound updateFeedback(ev) {
      this.props.answer.feedback_html = ev.target.value;
  }

  @action.bound updateContent(ev) {
      this.props.answer.content_html = ev.target.value;
  }

  render() {
      const { answer, canMoveUp, canMoveDown } = this.props;

      return (
          <li className={cn('answer', { 'correct-answer': answer.isCorrect })}>
              <div className="answer-actions">
                  <label>
            Distractor
                  </label>
                  <Icon type="check-circle"
                      className="is-correct"
                      color={answer.isCorrect ? 'green' : 'lightGray'}
                      onClick={partial(this.props.changeCorrect, answer)}
                  />
                  {canMoveUp &&
            <Icon onClick={partial(this.props.moveAnswer, answer, 1)} type="arrow-circle-down" />
                  }
                  {canMoveDown &&
            <Icon type="arrow-circle-up"
                onClick={partial(this.props.moveAnswer, answer, -1)}  />
                  }
                  <Icon
                      type="ban"
                      onClick={partial(this.props.removeAnswer, answer)}
                  />
              </div>

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
