import { React, styled } from 'vendor'
import { Button } from 'react-bootstrap'
import { Icon } from 'shared'
import { colors } from '../theme'
import TourAnchor from './tours/anchor'

const StyledButton = styled(Button)`
    &.btn.btn-standard:not(.btn-primary) {
        border: 1px dashed ${colors.neutral.pale};
    }
`

export const GhostButton = ({ tourAnchorId }: { tourAnchorId: string }) => {
    return (
        <StyledButton
            variant="light"
            className="btn-standard"
            data-test-id="drop-questions-ghost-btn"
            disabled={true}
        >
            <TourAnchor id={tourAnchorId}>
                <Icon type="question-circle" />
            </TourAnchor>
        </StyledButton>
    )
}
