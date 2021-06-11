import { React, useState, styled, observer } from 'vendor'
import TutorTooltip, { Variants as TooltipVariants } from '../../../components/tutor-tooltip'
import { Icon } from 'shared'
import { Offering, currentOfferings } from '../../../models'

const IconWrapper = styled.div`
    float: right;
`

const StyledBody = styled.div`
    line-height: 2rem;

    cite.em {
        font-weight: bold;
    }
`


const Sociology3eOfferingTooltip = observer(({ offering }: { offering: Offering }) => {
    if (!(offering.isSociology2e && currentOfferings.soc3eAvailable)) {
        return null
    }
    const [showSoc3eTooltip, setShowSoc3eTooltip] = useState(false)

    const body = (
        <StyledBody>
            A new addition is available -
            <div><cite className="em">Introduction to Sociology 3e</cite>.</div>
            <cite>Introduction to Sociology 2e</cite> is available only until Summer 2022.
            <div>
                <a target="_blank" href="TODO: ADD FAQ LINK">Learn more</a>
            </div>
        </StyledBody>
    )

    return (
        <IconWrapper>
            <TutorTooltip
                header={'New edition!'}
                body={body}
                open={showSoc3eTooltip}
                autoOpen={false}
                disableFlip={true}
                variant={TooltipVariants.Gray}
                offset={0}
                onClose={() => setShowSoc3eTooltip(!showSoc3eTooltip)}
            >
                <Icon
                    type="info-circle"
                    onClick={() => setShowSoc3eTooltip(!showSoc3eTooltip)}
                />
            </TutorTooltip>
        </IconWrapper>
    )
})

export default Sociology3eOfferingTooltip
