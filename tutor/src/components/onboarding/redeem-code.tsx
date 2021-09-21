import { React, observer, styled, Box } from 'vendor'
import { Button, OverlayTrigger, Tooltip } from 'react-bootstrap'
import { OnboardingNag, Body } from './onboarding-nag'
import { breakpoint } from '../../theme'

import type { StudentCourseOnboarding } from './ux/student-course'

interface PaymentOptionsProps {
    ux: StudentCourseOnboarding
}

const CodeWrapper = styled.div`
    input {
        width: 130px;
        padding: 0 16px;
        height: 48px;
        border-width: 1px;
        border-style: solid;

        &:first-child {
            width: 70px;
        }
    }

    .has-errors input {
        background: #F8E8EA;
        border-color: #E298A0;
        color: #C22032;
    }

    .error-message {
        text-align: left;
        color: #C22032;
        font-size: 1.4rem;
    }

    h6, p {
        margin: 0 !important;
    }

    .btn.btn-primary {
        max-width: 120px;
    }
`

const StyledBox = styled(Box)`
    margin: 20px 15px 50px;

    ${breakpoint.desktop`
        > *:not(:last-child) {
            margin-right: 16px;
        }
    `}

    ${breakpoint.mobile`
        flex-direction: column;
        justify-content: center;

        .error-message {
            text-align: center;
        }
        .btn.btn-primary {
            margin-top: 1.6rem;
            max-width: 216px;
            align-self: center;
        }
    `}
`

const CodeFooter = styled.div`
    font-size: 1.4rem;
    width: 376px;

    h6 {
        font-weight: bold;
    }

    p {
        min-width: 100%;
    }

    a {
        text-decoration: underline;
    }
`

const SuccessHeading = styled.h3`
    margin-bottom: 24px;
    width: 280px;
`

@observer
export default class RedeemCode extends React.Component<PaymentOptionsProps> {
    static className = 'redeem-code';
    static tooltipText = 'You can purchase access codes at your institution’s bookstore. Check with your bookstore for availability.';

    renderForm(ux: StudentCourseOnboarding) {
        return (
            <CodeWrapper>
                <h5>Enter your pre-purchased access code below.</h5>
                <OverlayTrigger
                    placement="top"
                    popperConfig={{
                        modifiers: {
                            preventOverflow: { enabled: false },
                            disableFlip: true,
                        },
                    }}
                    overlay={
                        <Tooltip id="redeem-code-tooltip">
                            {RedeemCode.tooltipText}
                        </Tooltip>
                    }
                >
                    <a href="#" aria-label={RedeemCode.tooltipText}>Where to find the access code?</a>
                </OverlayTrigger>
                <StyledBox>
                    <div className={ux.paymentCodeError ? 'has-errors' : ''}>
                        <input
                            data-test-id="payment-code-prefix"
                            type="input"
                            placeholder="OST"
                            required
                            onChange={(e) => { ux.setPaymentCodePrefix(e.target.value) }}
                            minLength={1}
                            maxLength={999}
                            autoFocus
                        />
                        <span>&nbsp;-&nbsp;</span>
                        <input
                            data-test-id="payment-code-post"
                            type="input"
                            placeholder="100234ABCD"
                            required
                            onChange={(e) => { ux.setPaymentCodePost(e.target.value) }}
                            minLength={10}
                            maxLength={10}
                        />
                        <div className="error-message">
                            {ux.paymentCodeError}
                        </div>
                    </div>
                    <Button
                        variant="primary"
                        onClick={ux.redeemCode}
                        disabled={!ux.codeRedeemable}
                    >
                        Redeem
                    </Button>
                </StyledBox>
                <CodeFooter>
                    <h6>Once redeemed, this access code is non-refundable.</h6>
                    <p>
                        If you’re unsure about enrolling in this class, we recommend taking
                        advantage of our <a href="#" onClick={ux.onPayLater}>14-day free trial period</a>.
                    </p>
                </CodeFooter>
            </CodeWrapper>
        )
    }

    renderSuccess(ux: StudentCourseOnboarding) {
        return (
            <>
                <SuccessHeading>Access code successfully redeemed!</SuccessHeading>
                <Button variant="primary" className="now" onClick={ux.finalizeRedemption}>
                    Continue
                </Button>
            </>
        )
    }

    render() {
        const { ux } = this.props;
        return (
            <OnboardingNag className="redeem-code">
                <Body>
                    {ux.codeRedeemed ? this.renderSuccess(ux) : this.renderForm(ux)}
                </Body>
            </OnboardingNag>
        )
    }
}
