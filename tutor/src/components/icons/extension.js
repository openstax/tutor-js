import { React, styled } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

const GreenCircle = styled.div`
  display: inline-block;
  width: 1.4rem;
  height: 1.4rem;
  position: absolute;
  right: 1rem;
  background: #009670;
  color: #fff;
  font-size: 0.9rem;
  line-height: 1.4rem;
  border-radius: 50%;
  text-align: center;
`;

const ExtensionIcon = () => (
  <OverlayTrigger
    placement="right"
    overlay={<Tooltip>Student was granted an extension</Tooltip>}
  >
    <GreenCircle>E</GreenCircle>
  </OverlayTrigger>
);

export default ExtensionIcon;
