import { React, PropTypes, styled } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { colors } from '../../theme';

const StyledTooltip = styled(Tooltip)`
  margin-left: 0.5rem;

  && {
    z-index: 0;

    .tooltip-inner {
      background: ${colors.bright_green};
      color: #fff;
      text-transform: uppercase;
      font-size: 0.8rem;
      box-shadow: none;
    }

    .arrow:before {
      border-right-color: ${colors.bright_green};
    }
  }
`;

const NewTooltip = ({ children }) => {
  return (
    <OverlayTrigger
      defaultShow={true}
      trigger={null}
      placement="right"
      popperConfig={{
        modifiers: {
          preventOverflow: { enabled: false },
          hide: { enabled: false },
        },
      }}
      overlay={<StyledTooltip>New</StyledTooltip>}
    >
      {children}
    </OverlayTrigger>
  );
};

NewTooltip.propTypes = {
  children: PropTypes.node.isRequired,
};

export default NewTooltip;
