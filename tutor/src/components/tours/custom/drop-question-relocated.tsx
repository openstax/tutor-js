import { React, styled } from 'vendor'
import { GreenTooltip } from './common'
import { colors } from 'Theme'

const StyledGreenTooltip = styled(GreenTooltip)`
    .header {
        padding: 10px 24px;
    }

    .body {
        font-size: 1.4rem;
        line-height: 2rem;
        padding: 12px 24px 24px;
        background: #fff;
        max-width: 312px;

        ol {
            font-weight: bold;
            margin-top: 12px;
            padding-inline-start: 0;
        }
    }
`

export const DropQuestionRelocated = (props) => {
    const markCompleted = () => {
        props.ride.markComplete()
    }
    return (
        <StyledGreenTooltip {...props}>
            <div className="header">
                Drop Question?
                <button onClick={markCompleted} aria-label="Close">X</button>
            </div>
            <div className="body">
                Now you can drop any question, including OpenStax Tutor-assigned questions.
                <ol>
                    <li>Go to ‘Submission overview’ tab</li>
                    <li>Scroll to the question you wish to drop</li>
                    <li>Click [icon here]</li>
                </ol>
            </div>
        </StyledGreenTooltip>
    );
}

export default DropQuestionRelocated;
