import { React, styled, css, observer } from 'vendor'
import { Icon } from 'shared'
import { colors } from '../theme'
import Floater from 'react-floater'
import { omit, merge } from 'lodash'

const floaterStyles = {
    default: {
        floater: {
            maxWidth: '100%',
        },
        container: {
            padding: 0,
            borderRadius: '4px',
        },
        options: {
            zIndex: 1501,
        },
    },
    gray: {
        arrow: {
            color: colors.neutral.std,
            spread: 16,
            length: 10,
        },
        container: {
            padding: 0,
            borderRadius: '4px',
        },
    },
    green: {
        arrow: {
            color: colors.secondary,
            spread: 16,
            length: 10,
        },
        container: {
            minHeight: 0,
            padding: 0,
        },
    },
    greenNoBody: {
        arrow: {
            color: colors.secondary,
            spread: 16,
            length: 10,
            margin: 20,
        },
        container: {
            minHeight: 0,
            padding: 0,
        },
    },
};

const StyledContent = styled.div<TutorTooltipProps>`
    .header {
        ${(props: TutorTooltipProps) => props.variant === Variants.Green && css`
            background: ${colors.secondary};
        `}
        ${(props: TutorTooltipProps) => props.variant === Variants.Gray && css`
            background: ${colors.neutral.std};
        `}
        color: #fff;
        padding: 10px 20px;
        font-size: 1.6rem;
        line-height: 2rem;
        letter-spacing: -0.64px;
        position: relative;

        .close {
            position: absolute;
            right: 0;
            top: 0;
            bottom: 0;
            background: rgba(0, 0, 0, 0.2);
            background-blend-mode: multiply;
            min-width: 4rem;
            color: #fff;
        }

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
        ${(props: TutorTooltipProps) => props.variant === Variants.Gray && css`
            background: ${colors.neutral.lighter};
        `}

        font-size: 1.4rem;
        line-height: 2rem;
        padding: 16px 20px 24px;
        background: #fff;
        max-width: 272px;
        letter-spacing: -0.4px;
    }
`

enum Variants {
    Gray = 'gray',
    Green = 'green',
}

interface TutorTooltipProps {
    variant?: Variants
    header?: string
    body?: any
    children: any
    open?: boolean
    autoOpen?: boolean
    onClose?(): any
    styles?: any
    disableFlip?: boolean
    placement?: any
    offset?: number
}

const TutorTooltip = observer((props: TutorTooltipProps) => {
    const { header, body, onClose, variant, styles } = props
    const customStyles = merge(floaterStyles[variant || 'default'], styles)
    const floaterProps = omit(props, ['styles', 'variant', 'header', 'body'])

    const content = (
        <StyledContent variant={variant}>
            <div className="header">
                {header}
                <button onClick={onClose} aria-label="Close" className="close">
                    <Icon type="close" />
                </button>
            </div>
            <div className="body">
                {body}
            </div>
        </StyledContent>
    )
    return (
        <Floater
            content={content}
            styles={customStyles}
            {...floaterProps}
        />
    )
})

export default TutorTooltip
export { Variants }
