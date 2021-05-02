import { React, observer } from 'vendor';
import SupportEmailLink from '../../components/support-email-link';

@observer
export default
class OfferingUnavailable extends React.Component {

    static title = 'This course is no longer available';

    render() {
        return (
            <div>
                <p>
          This course cannot be copied because it is no longer available.
                </p>
                <p>
          Please contact <SupportEmailLink displayEmail /> for more information.
                </p>
            </div>
        );
    }
}
