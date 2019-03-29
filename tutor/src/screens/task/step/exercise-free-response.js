import {
  React, PropTypes, observer, styled, action, observable,
} from '../../../helpers/react';
import { isEmpty } from 'lodash';
import { Button } from 'react-bootstrap';
import TaskStep from '../../../models/student-tasks/step';
import Question from 'shared/model/exercise/question';
import QuestionStem from './question-stem';
import Theme from '../../../theme';

const StyledFreeResponse = styled.div`
  textarea {
  width: 100%;
  min-height: 8em;
  line-height: 1.5em;
  margin: 1em 0 0 0;
  padding: 0.75em;
  border: 1px solid ${Theme.colors.neutral.std};
  }
`;

@observer
class FreeResponseReview extends React.Component {

  static propTypes = {
    step: PropTypes.instanceOf(TaskStep).isRequired,
  };

  render() {
    const { step } = this.props;

    if (!step.free_response) { return null; }

    return (
      <div className="free-response">{step.free_response}</div>
    );
  }

}


@observer
class FreeResponseInput extends React.Component {

  static propTypes = {
    step: PropTypes.instanceOf(TaskStep).isRequired,
    question: PropTypes.instanceOf(Question).isRequired,
  };

  textArea = React.createRef();

  @observable isDisabled = true;

  @action.bound setValue(ev) {
    this.isDisabled = isEmpty(ev.target.value);
  }

  @action.bound onSave() {
    this.props.step.free_response = this.textArea.current.value;
  }

  render() {
    const { step, question } = this.props;

    return (
      <StyledFreeResponse>
        <QuestionStem question={question} />
        <textarea
          ref={this.textArea}
          aria-label="question response text box"
          placeholder="Enter your response"
          defaultValue={step.free_response}
          onChange={this.setValue}
        />
        <Button disabled={this.isDisabled} onClick={this.onSave}>Answer</Button>
      </StyledFreeResponse>
    );
  }

}

export { FreeResponseInput, FreeResponseReview };
