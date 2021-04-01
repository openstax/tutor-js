import {
    React, PropTypes, action, observer, inject,
} from 'vendor';
import Standard from './standard';
import { Primary, TextAction } from './buttons';

@inject((allStores, props) => ({ tourContext: ( props.tourContext || allStores.tourContext ) }))
@observer
export default
class TipsNowOrLater extends React.Component {

    static propTypes = {
        ride: PropTypes.object.isRequired,
        step: PropTypes.object.isRequired,
        className: PropTypes.string,
        buttons: PropTypes.object,
        style: PropTypes.object,
    }

    @action.bound onViewNowClick() {
        this.props.ride.markComplete();
        this.props.ride.context.playTriggeredTours({
            except: this.props.ride.tour.id,
        });
    }

    @action.bound onViewLaterClick() {
        this.props.ride.onCancel();
    }

    render () {
        const buttons = [
            <Primary key="p" onClick={this.onViewNowClick}>View tips now</Primary>,
            <TextAction key="l" onClick={this.onViewLaterClick}>View later</TextAction>,
        ];

        return (
            <Standard {...this.props} buttons={buttons} />
        );
    }
}
