import { React, PropTypes, styled, cn } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

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
`;

const ExtensionIconWrapper = styled.div`
  display: flex;
  align-items: center;
`;

const EIcon = ({ className }) => <GreenCircle className={cn('extension-icon', className)}>E</GreenCircle>;
EIcon.propTypes = {
  className: PropTypes.string,
};

const ExtensionIcon = ({ className }) => (
  <OverlayTrigger
    placement="auto"

    overlay={<Tooltip id="extension-icon">Student was granted an extension</Tooltip>}
  >
    <ExtensionIconWrapper>
      <EIcon className={className} />
    </ExtensionIconWrapper>

  </OverlayTrigger>
);
ExtensionIcon.propTypes = {
  className: PropTypes.string,
};
export { GreenCircle, EIcon };
export default ExtensionIcon;
