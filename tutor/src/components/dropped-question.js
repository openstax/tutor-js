import { React, PropTypes, styled, css } from 'vendor';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';

import { colors } from 'theme';

export const CornerTriangle = ({ color, tooltip }) => {
  return (
    <OverlayTrigger
      placement="right"
      overlay={
        <Tooltip>
          {tooltip}
        </Tooltip>
      }
    >
      <StyledTriangle color={color} />
    </OverlayTrigger>
  );
};
CornerTriangle.propTypes = {
  color: PropTypes.string.isRequired,
  tooltip: PropTypes.string.isRequired,
};
  
const StyledTriangle = styled.div`
    height: 0;
    width: 0;
    position: absolute;
    top: 0;
    right: 0;
    border-style: solid;
    border-width: 0 1rem 1rem 0;
    border-color: transparent #000 transparent transparent;
    ${props => props.color === 'green' && css`
      border-color: transparent ${colors.assignments.scores.extension} transparent transparent;
    `}
    ${props => props.color === 'blue' && css`
      border-color: transparent ${colors.assignments.scores.dropped} transparent transparent;
    `}
  `;