import {
  React, PropTypes, styled, observer, action,
} from 'vendor';
import UiSettings from 'shared/model/ui-settings';
import { Icon } from 'shared';
import Theme from '../../theme';
const VIEWED_NUDGE_IS_AVAILABLE_KEY = 'vnamsg';

const Bar = styled.div`
  display: flex;
  min-height: 50px;
  padding-top: 1rem;
  align-items: center;
  padding-bottom: 1rem;
  padding-right: 1.25rem;
  justify-content: space-between;
  background-color: ${props => Theme.colors.tasks[props.planType]};
`;

const Message = styled.div`
  span { padding: 0 1rem; }
  a {
  color:black;
  text-decoration: underline;
  }
`;

@observer
class NudgeIsAvailableMessage extends React.Component {

  static propTypes = {
    planType: PropTypes.string.isRequired,
    className: PropTypes.string,
  }

  componentWillUnmount() {
    this.onClose();
  }

  @action.bound onClose() {
    UiSettings.set(VIEWED_NUDGE_IS_AVAILABLE_KEY, true);
  }

  render() {
    const hasViewed = UiSettings.get(VIEWED_NUDGE_IS_AVAILABLE_KEY);
    if (hasViewed) { return null; }

    const { className, planType } = this.props;

    return (
      <Bar className={className} planType={planType}>
        <Message>
          <b>GOOD TO KNOW:</b>
          <span>
            Our new feature encourages students to answer
            questions in their own words.
          </span>
          <a
            href="https://openstax.secure.force.com/help/articles/FAQ/Two-step-questions-and-response-validation-in-OpenStax-Tutor-Beta"
            target="_blank"
          >
            Learn More <Icon type="external-link-alt" />
          </a>
        </Message>
        <Icon type="close" onClick={this.onClose} />
      </Bar>
    );
  }

}

export default NudgeIsAvailableMessage;
