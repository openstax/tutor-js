import { React, observable, styled, action } from 'vendor';
import { Icon } from 'shared';
import Theme from '../../theme';
import { Button } from 'react-bootstrap';

const StyledButton = styled(Button)`
  display: flex;
  align-items: center;
  font-size: 1.6rem;
  color: ${Theme.colors.navbars.control};
  background-color: transparent;
  border: none;
  white-space: nowrap;
  margin-right: 2.4rem;

  svg {
    height: 1.8rem;
    margin-right: 0.8rem;
  }
`;

export default
class MilestonesToggle extends React.Component {

  static propTypes = {

  }

  @observable static isActive = false;

  @action.bound onToggle() {
    MilestonesToggle.isActive = !MilestonesToggle.isActive;
  }

  render() {
    return (
      <StyledButton
        variant="plain"
        onClick={this.onToggle}
        bsPrefix="milestones-toggle"
      >
        <Icon type="th" />
        Overview
      </StyledButton>
    );
  }
}
