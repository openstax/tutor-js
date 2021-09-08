import { React, observer, styled, cn } from 'vendor'
import { Icon } from 'shared'
import { colors } from '../../theme'
import UX from './ux'

const StyledIcon = styled(Icon)`
    min-height: 2.4rem;
    min-width: 2.4rem;
    padding: 4px;
    &.isShowingToolbar {
        background-color: ${colors.neutral.lighter};
        border-radius: 50%;
    }
`
StyledIcon.displayName = 'StyledIcon'

type StepToolbarToggleProps = {
    ux: UX,
}

const StepToolbarToggle = ({ ux }: StepToolbarToggleProps) => {
    return (
        <StyledIcon
            type="wrench"
            onClick={ux.toggleTaskToolbar}
            className={cn('toolbar-icon', { 'isShowingToolbar': !ux.hideToolbar })}
            buttonProps={{ 'aria-label': `${ux.hideToolbar ? 'Show' : 'Hide'} task toolbar` }}
        />
    )
}

export default observer(StepToolbarToggle)
