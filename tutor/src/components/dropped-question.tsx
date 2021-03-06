import { React, styled, css, observer } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { QuestionDropType } from '../models/types';
import {
    TaskPlanScoreHeading, TaskPlanScoreStudentQuestion,
} from '../models/task-plans/teacher/scores';
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
    heading: TaskPlanScoreHeading
    preventOverflow?: boolean
    size?: number
    responseCount?: number
}

const DroppedQuestionHeadingIndicator: React.FC<DroppedQuestionHeadingIndicatorProps> = observer(({
    heading,
    preventOverflow = true,
    responseCount = heading.studentResponses.length,
    size = 1,
}) => {
    if (!heading.someQuestionsDropped) return null

    let tooltip

    const isHomework = heading.tasking.scores.type == 'homework'

    if (isHomework) {
        if (heading.everyQuestionFullCredit) {
            tooltip = 'Full credit given to all students'
        } else {
            tooltip = 'Points changed to 0 for all students'
        }
    } else {
        tooltip = `Question dropped for ${pluralize('student', responseCount, true)}`
    }

    return (
        <DroppedIndicator
            tooltip={tooltip}
            preventOverflow={preventOverflow}
            size={size}
            data-test-id="dropped-question-indicator"
            data-question-id={heading.title}
        />
    )
})
DroppedQuestionHeadingIndicator.displayName = 'DroppedQuestionHeadingIndicator'


interface DroppedTutorQuestionIndicatorProps {
    result?: TaskPlanScoreStudentQuestion
    preventOverflow?: boolean
    size?: number
}

const DroppedTutorQuestionIndicator: React.FC<DroppedTutorQuestionIndicatorProps> = observer(({
    result,
    preventOverflow = true,
    size = 1,
}) => {
    if (!result?.droppedQuestion) return null

    let tooltip
    if (result.droppedQuestion.drop_method == 'full_credit') {
        tooltip = 'Full credit given'
    } else {
        tooltip = 'Points changed to 0'
    }

    return (
        <DroppedIndicator
            tooltip={tooltip}
            preventOverflow={preventOverflow}
            size={size}
            data-question-id={result.question_id}
        />
    )
})
DroppedTutorQuestionIndicator.displayName = 'DroppedTutorQuestionIndicator'


interface DroppedReviewExerciseIndicatorProps {
    info: {
        droppedQuestion?: {
            drop_method?: any
        }
        heading: TaskPlanScoreHeading
        responses: any[]
        question: { id: number }
    }
}

export const DroppedReviewExerciseIndicator: React.FC<DroppedReviewExerciseIndicatorProps> = observer(({
    info,
}) => {
    const { droppedQuestion } = info
    if (!droppedQuestion || !droppedQuestion.drop_method) return null

    let tooltip
    if (droppedQuestion.drop_method == 'full_credit') {
        tooltip = 'Full credit given'
    } else {
        tooltip = 'Points changed to 0'
    }
    tooltip += ` for ${pluralize('student', info.responses.length, true)}`

    return (
        <DroppedIndicator
            tooltip={tooltip}
            data-question-id={info.question.id}
        />
    )
})
DroppedReviewExerciseIndicator.displayName = 'DroppedReviewExerciseIndicator'


interface DroppedStepIndicatorProps {
    size?: number
    step: { drop_method?: QuestionDropType }
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
    DroppedTutorQuestionIndicator,
    DroppedStepIndicator,
};
