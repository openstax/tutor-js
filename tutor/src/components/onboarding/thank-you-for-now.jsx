import PropTypes from 'prop-types';
import React from 'react';
import { Button } from 'react-bootstrap';
import { observer } from 'mobx-react';
import { OnboardingNag, Body, Heading } from './onboarding-nag';

@observer
export default
class ThankYouForNow extends React.Component {

    static propTypes = {
        ux: PropTypes.object.isRequired,
        onDismiss: PropTypes.func.isRequired,
    }

    render() {
        return (
            <OnboardingNag className="thanks">
                <Heading>
          Thank you!
                </Heading>
                <Body>
          Thanks for letting us know!
                    <Button variant="link" onClick={this.props.onDismiss}>Back to dashboard</Button>
                </Body>
            </OnboardingNag>
        );
    }

}
