import { React, styled } from 'vendor'
import { Button } from 'react-bootstrap'
import { Icon } from 'shared'
import { colors } from 'theme'

const StyledButton = styled(Button)`
    &.btn.btn-standard:not(.btn-primary) {
        border: 1px dashed ${colors.neutral.pale};
    }
`

export const GhostButton = () => {
    return (
        <StyledButton
            variant="light"
            className="btn-standard"
            data-test-id="drop-questions-ghost-btn"
            disabled="true"
        >
            <Icon type="question-circle" />
        </StyledButton>
    )
}
