import { React, observable, styled, action } from 'vendor';
import { Icon } from 'shared';
import Theme from '../../theme';

const StyledToggle = styled.button`
  border: 0;
  background-color: transparent;
  transistion: color 0.2s;
  color: ${Theme.colors.neutral.dark};
  &:hover, &:active {
    color: ${Theme.colors.blue_info};
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
      <StyledToggle onClick={this.onToggle}><Icon type="th" /></StyledToggle>
    );
  }
}
