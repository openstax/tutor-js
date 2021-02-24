import { React, styled, css } from 'vendor'
import { useEffect, useState, useRef } from 'react'
import { Icon } from 'shared'
import TutorTheme, { colors, breakpoints } from 'theme'

const Panel = styled.div`
    position: absolute;
    top: 33vh;
    right: 0;
    z-index: ${TutorTheme.zIndex.sidePanel};
    display: flex;

    .toggle {
        background: ${colors.primary};
        color: #fff;
        width: 24px;
        height: 72px;
        border: 0;
        border-top-left-radius: 0.8rem;
        border-bottom-left-radius: 0.8rem;
        display: flex;
        align-items: center;
        justify-content: center;
        box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.2);
        z-index: 1;
        margin-right: -1px;
        &[aria-expanded=false] {
            margin-right: 1px;
        }

        & .ox-icon {
            font-size: 2.8rem;
            margin: 0;
            &.ox-icon-caret-left {
                margin-left: -0.2rem;
            }
            &.ox-icon-caret-right {
                margin-left: 0.2rem;
            }
        }
    }

    .content {
        width: 240px;
        min-height: 280px;
        background: #fff;
        border: 1px solid ${colors.primary};
        border-right: 0;
        border-bottom-left-radius: 0.8rem;
        box-shadow: -2px 2px 10px rgba(0, 0, 0, 0.2);
        text-align: center;
        display: flex;
        flex-direction: column;
        align-items: stretch;
        justify-content: center;
        font-size: 1.6rem;
        line-height: 2.4rem;
        padding: 2.4rem;

        h3 {
            font-size: 1.8rem;
            line-height: 3rem;
            margin-bottom: 1.2rem;
        }
        p {
            margin-bottom: 2.8rem;
            color: ${colors.neutral.thin};
        }
        .btn {
            min-height: 4.8rem;
            display: flex;
            align-items: center;
            justify-content: center;
        }
    }
`

const SidePanel: React.FC = ({ children, windowImpl = window  }) => {
    // Need to use ui_settings?
    const mounted = useRef(false)
    const [showPanel, setPanelState] = useState(true)
    const togglePanel = () => {
        setPanelState(!showPanel)
    }

    useEffect(
        () => {
            if (mounted.current) {
                setPanelState(false)
            } else {
                mounted.current = true
            }
        },
        [windowImpl.location.pathname],
    )

    return (
        <Panel>
            <button className="toggle" aria-expanded={showPanel} onClick={togglePanel}>
                <Icon type={showPanel ? 'caret-right' : 'caret-left'} />
            </button>
            {showPanel &&
                <div className="content">
                    {children}
                </div>
            }
        </Panel>
    )
}

export default SidePanel
