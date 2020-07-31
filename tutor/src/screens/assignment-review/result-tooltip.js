import { React, PropTypes, observer, styled } from 'vendor';
import { OverlayTrigger, Popover } from 'react-bootstrap';
import { colors } from 'theme';

const StyledPopover = styled(Popover)`
  pointer-events: none;

  &.bs-popover-bottom {
    margin-top: -0.75rem;
  }
`;

const PopoverContent = styled(Popover.Content)`
  && {
    font-size: 1.4rem;
    width: 15rem;
    color: ${colors.neutral.thin};
  }

  > div {
    display: flex;
    justify-content: space-between;

    &:first-child {
      font-weight: bold;
    }
  }

  div + div {
    text-align: right;
  }
`;

const BodyContent = styled.div`
  display: flex;
  justify-content: center;
  align-items: center;
  height: 3.9rem;
  width: 100%;
`;

const ResultsTooltip = observer(({ result, children }) => (
  <OverlayTrigger
    trigger="hover"
    placement="bottom"
    popperConfig={{
      modifiers: {
        preventOverflow: { enabled: false },
      },
    }}
    overlay={
      <StyledPopover>
        <PopoverContent>
          <div>
            <div>Points earned:</div>
            <div>{result.displayValue}</div>
          </div>
          <div>
            <div>Late penalty:</div>
            <div>{result.latePenalty}</div>
          </div>
          <div>
            <div>Final points:</div>
            <div>{result.finalPoints}</div>
          </div>
        </PopoverContent>
      </StyledPopover>
    }
  >
    <BodyContent>{children}</BodyContent>
  </OverlayTrigger>
));

ResultsTooltip.propTypes = {
  result: PropTypes.shape({
    displayValue: PropTypes.string,
    latePenalty: PropTypes.string,
    finalPoints: PropTypes.string,
  }),
};

export default ResultsTooltip;
