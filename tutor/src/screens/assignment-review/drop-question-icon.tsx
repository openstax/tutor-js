import { React, Theme } from 'vendor';
import UX from './ux'
import { Icon } from 'shared'

const DropQuestionIcon:React.FC<{ ux: UX, info: any }> = ({ ux, info }) => {
    if (!ux.course.isActive) { return null }
    return (
        <Icon
            type="minus-circle"
            data-tour-anchor-id="drop-question-new"
            tooltip="Drop question"
            color={Theme.colors.neutral.gray}
            hoverColor={Theme.colors.neutral.darker}
            tooltipProps={{ placement: 'bottom' }}
            onClick={() => ux.displayDropQuestion(info.question)}
        />
    )
}

export default DropQuestionIcon
