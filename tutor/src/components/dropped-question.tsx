import { React, styled, css, observer } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { ID } from '../models/types'
import { colors } from '../theme';

interface CornerTriangleProps {
    size?: number
    color: string
    tooltip: string
}
const CornerTriangle:React.FC<CornerTriangleProps> = ({ color, tooltip, ...attrs }) => {
    return (
        <OverlayTrigger overlay={<Tooltip id="corner-triangle">{tooltip}</Tooltip>}>
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

interface DroppedQuestionIndicatorProps {
    size?: number
    model: {
        id?: ID
        drop_method?: 'full_credit' | 'zeroed' | 'partial'
    }
}

const DroppedQuestionIndicator: React.FC<DroppedQuestionIndicatorProps> = observer(({
    model,
    size = 1,
}) => {
    if (!model.drop_method) return null
    let tooltip = 'Question dropped'
    if (model.drop_method == 'partial') {
        tooltip += ': some questions worth 0 points, others assigned full credit'
    }
    if (model.drop_method == 'zeroed') {
        tooltip += ': question is worth 0 points'
    }
    if (model.drop_method == 'full_credit') {
        tooltip += ': full credit assigned for this question'
    }
    return (
        <CornerTriangle
            data-test-id="dropped-question-indicator"
            data-question-id={model.id ? `Q${model.id}` : ''}
            size={size}
            color="blue" tooltip={tooltip}
        />
    )
})
DroppedQuestionIndicator.displayName = 'DroppedQuestionIndicator'
export { CornerTriangle, TriangleCSS, DroppedQuestionIndicator };
