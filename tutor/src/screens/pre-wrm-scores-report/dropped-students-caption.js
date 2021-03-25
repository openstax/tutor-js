import { React, PropTypes, styled, observer } from 'vendor';
import UX from './ux';

const Legend = styled.p`
  color: ${props => props.theme.colors.neutral.std};
`;


@observer
export default class DroppedStudentsCaption extends React.Component {

    static propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,
    }

    render() {
        if (!this.props.ux.hasDroppedStudents) {
            return null;
        }

        return (
            <Legend>
        * Dropped students’ scores are not included in the
        overall course averages and appear at the bottom of the table.
            </Legend>
        );
    }

}
