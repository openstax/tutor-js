import { React, observable, styled, action, modelize } from 'vendor';
import { Icon } from 'shared';
import SecondaryToolbarButton from '../../components/navbar/secondary-toolbar-button';

const StyledButton = styled(SecondaryToolbarButton)`
  margin-right: 2rem;
`;

export default
class MilestonesToggle extends React.Component {
    static propTypes = {

    }

    @observable static isActive = false;

    constructor(props) {
        super(props);
        modelize(this);
    }

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
                <span>Overview</span>
            </StyledButton>
        );
    }
}
