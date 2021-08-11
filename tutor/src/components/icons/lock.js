import { React, PropTypes, styled, cn, css } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { colors } from 'theme';
import { Icon } from 'shared';

const LockIconWrapper = styled.div`
  display: flex;
  align-items: center;

  ${props => props.inline && css`
    display: inline-block;
  `}
`;

const StyledTooltip = styled(Tooltip)`
  pointer-events: none;
  max-width: 214px;
  color: ${colors.neutral.thin};
  // Fix absolute positioning confusing where to place tooltip
  &.bs-tooltip-right {
    margin-left: 2.5rem;
  }
`;

const LockIcon = ({ className }) => (
    <Icon className={cn('lock-icon', className)} type="lock" />
);
LockIcon.propTypes = {
    className: PropTypes.string,
};

const StepLockIcon = ({ className, wasGraded, isClosed, inline = false }) => {
    let msg;
    if (isClosed) {
        msg = 'This assignment is closed. You can no longer add or edit a response.';
    }
    else if (wasGraded) {
        msg = 'Question has been graded already.';
    }
    else {
        return null;
    }

    return (
        <OverlayTrigger
            placement="auto"
            overlay={<StyledTooltip id="step-lock-icon">{msg}</StyledTooltip>}
            popperConfig={{
                modifiers: {
                    preventOverflow: { enabled: false },
                },
            }}
        >
            <LockIconWrapper inline={inline}>
                <LockIcon className={className} />
            </LockIconWrapper>
        </OverlayTrigger>
    );
};
StepLockIcon.propTypes = {
    className: PropTypes.string,
    wasGraded: PropTypes.bool,
    isClosed: PropTypes.bool,
    inline: PropTypes.bool,
};

export { LockIcon, StepLockIcon };
