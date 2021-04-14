import { React, PropTypes, observer } from 'vendor';
import UX from '../ux';
import { StepCard } from './card';
import ContinueBtn from './continue-btn';
import { StudentTaskStep } from '../../../models'

@observer
export default class PlaceHolderTaskStep extends React.Component {

    static propTypes = {
        ux: PropTypes.instanceOf(UX).isRequired,
        step: PropTypes.instanceOf(StudentTaskStep).isRequired,
    }

    render() {
        const { ux } = this.props;

        return (
            <StepCard>
                <h1>This step is unavailable</h1>
                <h3>
          Unlock this personalized question by
          answering more problems for this assignment.
                </h3>
                <ContinueBtn ux={ux} />
            </StepCard>
        );
    }
}
