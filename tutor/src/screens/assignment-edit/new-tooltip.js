import { React, PropTypes, styled } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { colors } from '../../theme';

const StyledTooltip = styled(Tooltip)`
  margin-left: 1rem;

  && {
    z-index: 0;

    .tooltip-inner {
      background: ${colors.bright_green};
      color: #fff;
      text-transform: uppercase;
      font-size: 0.9rem;
      box-shadow: none;
      font-weight: 500;
      letter-spacing: 1px;
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
