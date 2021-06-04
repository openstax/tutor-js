import { React, styled } from 'vendor'
import { Icon } from 'shared'
import { GreenTooltip } from './common'
import UiSettings from 'shared/model/ui-settings'

const StyledGreenTooltip = styled(GreenTooltip)`
    .header {
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

    &.drop-relocated {
        .header {
            padding: 10px 24px;
            font-weight: bold;
        }
    }

    &.drop-new {
        .header {
            padding: 9px 10px;
            min-width: 196px;
        }
    }
`

const DropQuestionRelocated = (props: any) => {
    const close = () => {
        UiSettings.set('has-viewed-drop-question-relocated', true)
        props.ride.markComplete()
    }

    return (
        <StyledGreenTooltip {...props} className="drop-relocated">
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
        </StyledGreenTooltip>
    )
}

const DropQuestionNew = (props: any) => {
    const close = () => {
        props.ride.markComplete()
    }

    return (
        <StyledGreenTooltip {...props} className="drop-new">
            <div className="header">
                <b>NEW!</b> Drop Question
                <button onClick={close} aria-label="Close" className="close">
                    <Icon type="close" />
                </button>
            </div>
        </StyledGreenTooltip>
    )
}

export { DropQuestionRelocated, DropQuestionNew }
