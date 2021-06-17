import {
    React, PropTypes, observer,
} from 'vendor';
import Spotlight from './spotlight';
import STEPS from './custom';
import TutorTooltip from '../tutor-tooltip';

@observer
export default class TourStep extends React.Component {

    static propTypes = {
        step: PropTypes.object.isRequired,
        ride: PropTypes.object.isRequired,
    }

    render() {
        const { step, ride } = this.props;
        const Step = STEPS[step.customComponent || 'Standard'];

        const tip = (
            <TutorTooltip
                open={true}
                debug={ride.context.emitDebugInfo}
                autoOpen={true}
                key={step.anchor_id}
                target={step.target}
                variant={step.variant}
                disableAnimation={true}
                placement={step.placement}
                content={<Step step={step} ride={ride} />}
            />
        );
        if (step.shouldShowSpotlight) {
            return (
                <Spotlight step={step} ride={ride}>
                    {tip}
                </Spotlight>
            );
        }
        return tip;
    }

}
