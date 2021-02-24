import { React, PropTypes, styled, moment, cn, css } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import { colors } from 'theme';

const GreenCircle = styled.div`
  width: 1.4rem;
  height: 1.4rem;
  min-width: 1.4rem;
  min-height: 1.4rem;
  background: #009670;
  color: #fff;
  font-size: 0.9rem;
  line-height: 1.4rem;
  border-radius: 50%;
  text-align: center;
  vertical-align: middle;

  ${props => props.inline && css`
    display: inline-block;
  `}
`;

const ExtensionIconWrapper = styled.div`
  display: flex;
  align-items: center;

  ${props => props.inline && css`
    display: inline-block;
  `}
`;

const EIcon = ({ className, inline }) => <GreenCircle className={cn('extension-icon', className)} inline={inline}>E</GreenCircle>;
EIcon.propTypes = {
    className: PropTypes.string,
    inline: PropTypes.bool,
};

const StyledTooltip = styled(Tooltip)`
  pointer-events: none;
  max-width: 214px;
  color: ${colors.neutral.thin};
  // Fix absolute positioning confusing where to place tooltip
  &.bs-tooltip-right {
    margin-left: 2.5rem;
  }
`;

const ExtensionIcon = ({ className, extension, timezone, inline = false }) => {
    let msg = 'Student was granted an extension.';
    const format = (dte) => moment.tz(dte, timezone).format('h:mm a z on MMM D');

    if (extension) {
        msg += ` Assignment is now due at ${format(extension.due_at)} and closes at ${format(extension.closes_at)}`;
    }
    return (
        <OverlayTrigger
            placement="auto"
            overlay={<StyledTooltip id="extension-icon">{msg}</StyledTooltip>}
            popperConfig={{
                modifiers: {
                    preventOverflow: { enabled: false },
                },
            }}
        >
            <ExtensionIconWrapper inline={inline}>
                <EIcon className={className} />
            </ExtensionIconWrapper>
        </OverlayTrigger>
    );
};

ExtensionIcon.propTypes = {
    className: PropTypes.string,
    extension: PropTypes.shape({
        due_at: PropTypes.string,
        closes_at: PropTypes.string,
    }),
    inline: PropTypes.bool,
    timezone: PropTypes.string,
};
export { GreenCircle, EIcon };
export default ExtensionIcon;
