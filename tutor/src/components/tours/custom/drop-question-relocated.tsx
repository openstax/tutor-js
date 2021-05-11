import { React, styled } from 'vendor'
import { Icon } from 'shared'
import { GreenTooltip } from './common'

const StyledGreenTooltip = styled(GreenTooltip)`
    margin-left: -8px;
    margin-top: 8px;

    .header {
        padding: 10px 24px;
        font-weight: bold;

        button {
            display: flex;
            flex-direction: column;
            align-items: center;
            justify-content: center;

            svg {
                margin: 0;
                width: 11px;
                color: #fff;
            }
        }
    }

    .body {
        font-size: 1.4rem;
        line-height: 2rem;
        padding: 12px 24px 24px;
        background: #fff;
        max-width: 312px;
        letter-spacing: -0.4px;

        ol {
            font-weight: bold;
            margin: 12px 0 0;
            padding-inline-start: 16px;
        }
    }
`

export const DropQuestionRelocated = (props: any) => {
    const close = () => {
        props.ride.markComplete()
    }
    return (
        <StyledGreenTooltip {...props}>
            <div className="header">
                Drop Question?
                <button onClick={close} aria-label="Close" className="close">
                    <Icon type="close" />
                </button>
            </div>
            <div className="body">
                Now you can drop any question, including OpenStax Tutor-assigned questions.
                <ol>
                    <li>Go to ‘Submission overview’ tab</li>
                    <li>Scroll to the question you wish to drop</li>
                    <li>Click <Icon type="minus-circle" /></li>
                </ol>
            </div>
        </StyledGreenTooltip >
    );
}

export default DropQuestionRelocated;
