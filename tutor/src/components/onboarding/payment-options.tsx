import { React, observer } from 'vendor'
import { Button } from 'react-bootstrap'
import { OnboardingNag, Body } from './onboarding-nag'

import type { StudentCourseOnboarding } from './ux/student-course'

interface PaymentOptionsProps {
    ux: StudentCourseOnboarding
}

@observer
export default class PaymentOptions extends React.Component<PaymentOptionsProps> {
    render() {
        const { ux } = this.props;

        return (
            <OnboardingNag className="payment-options">
                <Body>
                    <Button variant="primary" className="now" onClick={ux.payNow}>
                        Pay via credit or debit card
                    </Button>
                    <p>You may request a refund within 14 days of purchasing</p>

                    <div className="or">or</div>

                    <Button className="secondary" onClick={ux.showRedeemCode}>
                        I have an access code
                    </Button>
                    <p>Redeem the access code purchased from your bookstore</p>
                </Body>
            </OnboardingNag>
        );
    }

}
