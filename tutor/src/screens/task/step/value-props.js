import { React, PropTypes, styled, css, cn } from 'vendor';
import Theme from '../../../theme';
import { StepCard } from './card';
import ContinueBtn from './continue-btn';

const blueBackground = css`
  color: white;
  background-color: ${Theme.colors.blue_info};
`;

const CardBody = styled(StepCard)`
  ${props => props.blue && blueBackground}
  h4 {
    font-weight: 900;
  }
`;

class ValueProp extends React.Component {

  static propTypes = {
    blue: PropTypes.bool,
    title: PropTypes.string.isRequired,
    className: PropTypes.string,
    children: PropTypes.node.isRequired,
    step: PropTypes.shape({
      type: PropTypes.string.isRequired,
    }).isRequired,
    ux: PropTypes.shape({
      viewedInfoSteps: PropTypes.array.isRequired,
      canGoForward: PropTypes.bool.isRequired,
      goForward: PropTypes.func.isRequired,
    }).isRequired,
  };

  componentWillUnmount() {
    this.props.ux.viewedInfoSteps.push(this.props.step.type);
  }

  render() {
    const { className, blue, step: { type }, title, children, ux } = this.props;

    return (
      <CardBody blue={blue} className={cn(`openstax-${type}`, className)}>
        <h1>{title}</h1>
        {children}
        <ContinueBtn variant="light" ux={ux} />
      </CardBody>
    );
  }
}

export function PersonalizedGroup(props) {
  return (
    <ValueProp blue {...props} title='Personalized questions'>
      <p>
        Personalized questions —like this next one— are
        chosen specifically for you by OpenStax Tutor
        based on your learning history.
      </p>
    </ValueProp>
  );
}

export function SpacedPractice(props) {
  return (
    <ValueProp blue {...props} title='Spaced Practice'>
      <p>
        Did you know?  Research shows you can strengthen your
        memory —<strong>and spend less time studying</strong>—
        if you revisit material over multiple study sessions.
      </p>
      <p>
        OpenStax Tutor will include <strong>spaced practice</strong>
        questions —like this next one— from prior sections
        to give your learning a boost. You may occasionally
        see questions you’ve seen before.
      </p>
    </ValueProp>
  );
}

export function IndividualReview(props) {
  return (
    <ValueProp {...props} title='Your individual review'>
      <p>
        OpenStax Tutor has selected questions for you based
        on what you’ve studied and how you’ve performed so far.
      </p>
      <p>
        By answering these custom review questions, you’re more
        likely to remember what you learned.
      </p>
    </ValueProp>
  );
}

export function TwoStepValueProp(props) {
  return (
    <ValueProp blue {...props} title="Two-step questions">
      <p>
        Research shows a great way to boost learning is to try
        recalling what you have learned.
      </p>
      <h4>
        Step 1: Free response for longer lasting learning
      </h4>
      <p>
        Help your learning last longer by constructing an answer in the
        free response box from memory.  For greatest benefit,
        try not to refer to notes or text.
      </p>
      <h4>
        Step 2: Tutor personalized feedback with multiple choice
      </h4>
      <p>
        Receive personalized feedback by selecting the best
        multiple-choice option.
      </p>
      <p>
        Both you and your instructor can review your answers later.
      </p>
    </ValueProp>
  );
}
