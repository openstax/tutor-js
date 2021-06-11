import { React, styled, observer, useHistory } from 'vendor'
import { Icon } from 'shared'
import UiSettings from 'shared/model/ui-settings'
import Theme, { breakpoint, colors } from '../../../theme'
import { Offering, currentOfferings } from '../../../models'
import Router from '../../../helpers/router'

const DORMANT_TIME = 86400000 * 30 * 4

interface OverlayProps {
    fullscreen: boolean
}

const Overlay = styled.div<OverlayProps>`
    position: ${(props: OverlayProps) => props.fullscreen ? 'fixed' : 'absolute'};
    left: 0;
    right: 0;
    top: 0;
    bottom: 0;
    z-index: ${(props: OverlayProps) => props.fullscreen ? Theme.zIndex.navbar + 1 : 1};
    padding: ${(props: OverlayProps) => props.fullscreen ? '12rem' : '6.4rem'} 8rem 2rem;
    display: flex;
    flex-direction: column;
    align-items: center;
    justify-content: position: ${(props: OverlayProps) => props.fullscreen ? 'flex-start' : 'center'};
    ${breakpoint.tablet`
        padding: 12rem 3.2rem;
    `}
    ${breakpoint.mobile`
        justify-content: flex-start;
        padding: 12rem 2.4rem;
    `}
    color: #fff;
    font-size: 2rem;
    line-height: 3rem;
    background-color: rgba(0,0,0,0.9);

    h1 {
       font-size: 3.6rem;
       line-height: 4rem;
       letter-spacing: -1.44px;

       span {
           color: #f5d019;
       }
    }

    .text ul { padding-left: 30px; }

    & .btn.create-soc3e {
        background-color: #f5d019;
        color: #000;
        display: block;
        width: 100%;
        max-width: 590px;
        ${breakpoint.mobile`
            width: 100%;
            font-size: 1.6rem;
        `}
        padding: 8px;
        margin: 18px 0;
        text-decoration: none;
        border-radius: 2px;
        border: 1px solid ${colors.neutral.pale};
        font-size: 1.8rem;
        line-height: 2.4rem;
    }

    .close-overlay {
        border: 1px solid #fff;
        border-radius: 50%;
        background: transparent;
        color: #fff;
        position: absolute;
        top: 34px;
        right: 32px;
        width: 40px;
        height: 40px;
        &:hover {
            background: #fff;
            color: #000;
        }
    }

    .faq {
        font-size: 1.6rem;
        text-decoration: underline;
        &, &:hover { color: #fff; }
    }
`

const Sociology3eOverlay = observer(({ offering, fullscreen }: { offering: Offering, fullscreen: boolean }) => {
    if (!(offering.isSociology2e && currentOfferings.soc3eAvailable)) {
        return null
    }

    const now = new Date().getTime()
    const expiry = new Date(UiSettings.get('soc3eOverlayViewedAt'))?.getTime()

    if (now < expiry) {
        return null
    }

    const soc3eOfferingId = currentOfferings.sociology3e.array[0].id

    const markAsViewed = (history?: any) => {
        UiSettings.set('soc3eOverlayViewedAt', new Date().getTime() + DORMANT_TIME)
        history?.push(Router.makePathname('createNewCourseFromOffering', { offeringId: soc3eOfferingId }))
        return null
    }

    const history = useHistory()

    return (
        <Overlay fullscreen={fullscreen} data-test-id="sociology-3e-overlay">
            <button className="close-overlay" aria-label="Close" onClick={() => markAsViewed()}>
                <Icon type="close" />
            </button>
            <h1>New edition! <span>Introduction to Sociology 3e</span></h1>
            <div className="text">
                The new edition includes:
                <ul>
                    <li>Expanded coverage of cultures, race and ethnicity, and gender</li>
                    <li>Relevant and contemporary narratives, examples, and events</li>
                    <li>New and enriched ancillaries, multimedia, and assessments</li>
                </ul>
            </div>
            <a className="btn create-soc3e" onClick={() => markAsViewed(history)}>
                <b>Create a</b> Introduction to Sociology 3e <b>course</b>
            </a>
            <a className="faq" href="TODO: GET LINK">Frequently Asked Questions</a>
        </Overlay>
    )
})

export default Sociology3eOverlay
