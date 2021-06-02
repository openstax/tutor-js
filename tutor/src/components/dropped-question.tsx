import { React, styled, css, observer } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { TaskPlanScoreHeading } from '../models/task-plans/teacher/scores'
import pluralize from 'pluralize';
import { colors } from '../theme';

interface CornerTriangleProps {
    preventOverflow?: boolean
    size?: number
    color: string
    tooltip: string
}
const CornerTriangle:React.FC<CornerTriangleProps> = (
    { color, tooltip, preventOverflow = true, ...attrs }
) => {
    return (
        <OverlayTrigger
            overlay={<Tooltip id="corner-triangle">{tooltip}</Tooltip>}
            popperConfig={ { modifiers: { preventOverflow: { enabled: preventOverflow } } } }
        >
            <StyledTriangle color={color} {...attrs} />
        </OverlayTrigger>
    );
}

const TriangleCSS = css<{ size?: number, color?: string }>`
    border-style: solid;
    border-width: ${({ size = 1 }) => `0 ${size}rem ${ size }rem 0`};
    border-color: transparent #000 transparent transparent;
    ${props => props.color === 'green' && css`
border-color: transparent ${colors.assignments.scores.extension} transparent transparent;
`}
    ${props => props.color === 'blue' && css`
border-color: transparent ${colors.assignments.scores.dropped} transparent transparent;
`}
`;

const StyledTriangle = styled.div`
    height: 0;
    width: 0;
    position: absolute;
    top: 0;
    right: 0;
    ${TriangleCSS}
`;

export const DroppedIcon = styled.div`
    ${TriangleCSS}
    border-width: 0 1.2rem 1.2rem 0;
`;


interface DroppedIndicatorProps {
    preventOverflow?: boolean
    size?: number
    tooltip: string
}

const DroppedIndicator: React.FC<DroppedIndicatorProps> = observer(({
    tooltip,
    preventOverflow = true,
    size = 1,
}) => {
    return (
        <CornerTriangle
            preventOverflow={preventOverflow}
            size={size}
            color="blue"
            tooltip={tooltip}
        />
    )
})
DroppedIndicator.displayName = 'DroppedIndicator'


interface DroppedQuestionHeadingIndicatorProps {
    preventOverflow?: boolean
    size?: number
    heading: TaskPlanScoreHeading
}

const DroppedQuestionHeadingIndicator: React.FC<DroppedQuestionHeadingIndicatorProps> = observer(({
    heading,
    preventOverflow = true,
    size = 1,
}) => {
    if (!heading.someQuestionsDropped) return null
    let tooltip

    const isHomework = heading.tasking.scores.type == 'homework'

    if (isHomework && heading.isCore) {
        if (heading.everyQuestionFullCredit) {
            tooltip = 'Full credit given to all students'
        } else {
            tooltip = 'Points changed to 0 for all students'
        }
    } else {
        tooltip = `Question dropped for ${pluralize('student', heading.studentResponses.length, true)}`
    }

    return (
        <DroppedIndicator
            tooltip={tooltip}
            preventOverflow={preventOverflow}
            size={size}
            data-test-id="dropped-question-indicator"
            data-question-id={heading.title}
        />
    );
})
DroppedQuestionHeadingIndicator.displayName = 'DroppedQuestionHeadingIndicator'


interface DroppedReviewExerciseIndicatorProps {
    info: {
        droppedQuestion?: {
            drop_method?: any
        }
        heading: TaskPlanScoreHeading
        responses: any[]
    }
}

export const DroppedReviewExerciseIndicator: React.FC<DroppedReviewExerciseIndicatorProps> = observer(({
    info,
}) => {
    const { droppedQuestion, heading } = info
    if (!droppedQuestion || !droppedQuestion.drop_method) return null

    return (
        <DroppedQuestionHeadingIndicator
            heading={heading}
            size={1.6}
        />
    )
})
DroppedReviewExerciseIndicator.displayName = 'DroppedReviewExerciseIndicator'


interface DroppedStepIndicatorProps {
    size?: number
    step: { drop_method?: 'full_credit' | 'zeroed' }
}
const DroppedStepIndicator: React.FC<DroppedStepIndicatorProps> = observer(({
    step,
    size = 1,
}) => {
    if (!step.drop_method) return null
    let tooltip
    if (step.drop_method == 'full_credit') {
        tooltip = 'Full credit given'
    }
    else /*if (step.drop_method == 'zeroed')*/ {
        tooltip = 'Points changed to 0'
    }

    return (<DroppedIndicator tooltip={tooltip} size={size}/>);
})
DroppedStepIndicator.displayName = 'DroppedStepIndicator'

export {
    CornerTriangle,
    TriangleCSS,
    DroppedIndicator,
    DroppedQuestionHeadingIndicator,
    DroppedStepIndicator,
};
