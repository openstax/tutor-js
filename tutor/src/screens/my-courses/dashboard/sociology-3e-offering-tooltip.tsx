import { React, useState, styled } from 'vendor'
import TutorTooltip from '../../../components/tutor-tooltip'
import { Icon } from 'shared'

const IconWrapper = styled.div`
    float: right;
`

const StyledBody = styled.div`
    line-height: 2rem;

    cite.em {
        font-weight: bold;
    }
`


const Sociology3eOfferingTooltip = () => {
    const [showSoc3eTooltip, setShowSoc3eTooltip] = useState(false)

    const body = (
        <StyledBody>
            A new addition is available - <cite className="em">Introduction to Sociology 3e</cite>.&nbsp;
            <cite>Introduction to Sociology 2e</cite> is available only until Summer 2022.
            <div><a target="_blank" href="TODO: ADD FAQ LINK">Learn more</a></div>
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
                variant={'gray'}
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
}

export default Sociology3eOfferingTooltip
