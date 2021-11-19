import { React, styled, useState } from 'vendor'
import { Overlay, Popover } from 'react-bootstrap'
import { colors } from '../theme'
import { Icon } from 'shared'
import { Placement } from 'react-bootstrap/Overlay';

const StyledPopover = styled(Popover)`
  padding: 1.5rem;
  font-size: 1.4rem;
  line-height: 2.0rem;

  p {
    color: ${colors.neutral.darker};
  }
  a {
    font-weight: 500;
  }
`;

const StyledQuestionInfoIcon = styled(Icon)`
  &.question-info-icon {
    margin-left: 1rem;
    color:${colors.bright_blue};
    margin: 0;
    line-height: inherit;
  }
`;

const InfoIconPopover = ({ popoverInfo, placement = 'top' }: { popoverInfo: React.ReactNode, placement?: Placement }) => {
    const [show, setShow] = useState(false);
    const [target, setTarget] = useState<HTMLElement | null>(null);

    const handleEvent = (event: React.MouseEvent<HTMLElement>) => {
        setShow(!show);
        if (!show) {
            setTarget(event.target as HTMLElement);
        }
    };
    const popover = <StyledPopover id="">
        {popoverInfo}
    </StyledPopover >;

    return (
        <>
            <StyledQuestionInfoIcon
                type="question-circle"
                className="question-info-icon"
                onClick={handleEvent}
            />
            <Overlay
                rootClose
                show={show}
                target={target ? target : undefined}
                placement={placement}
                onHide={() => setShow(false)}
            >
                {popover}
            </Overlay>
        </>

    )
}

export default InfoIconPopover
