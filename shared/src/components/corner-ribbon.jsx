import PropTypes from 'prop-types';
import React from 'react';
import styled, { css } from 'styled-components';

const Ribbon = styled.div`
  position: relative;
  overflow: hidden;
`;

const Positions = {
  topLeft: css`
    top: 25px;
    left: -50px;
    transform: rotate(-45deg);
    `,
  topRight: css`
    top: 25px;
    right: -50px;
    left: auto;
    transform: rotate(45deg);
  `,
  bottomLeft: css`
    top: auto;
    bottom: 25px;
    left: -50px;
    transform: rotate(45deg);
  `,
  bottomRight: css`
    top: auto;
    right: -50px;
    bottom: 25px;
    left: auto;
    transform: rotate(-45deg);
 `,
};

const Colors = {
  white:     css`background: #f0f0f0; color: #555;`,
  black:     css`background: #333;`,
  grey:      css`background: #999;`,
  blue:      css`background: #39d;`,
  navy:      css`background: #232e66;`,
  green:     css`background: #2c7;`,
  turquoise: css`background: #1b9`,
  purple:    css`background: #95b;`,
  red:       css`background: #e43;`,
  orange:    css`background: #e82;`,
  yellow:    css`background: #ec0;`,
};


const Content = styled.div`
  width: 200px;
  background: #e43;
  position: absolute;
  top: 25px;
  left: -50px;
  text-align: center;
  min-height: 50px;
  letter-spacing: 1px;
  color: #f0f0f0;
  transform: rotate(-45deg);
  z-index: 2;
  display: flex;
  flex-direction: column;
  align-items: center;
  justify-content: center;

  ${props => props.hidden && 'display: none;' }
  ${props => props.fixed && 'position: fixed;' }
  ${props => props.shadow && 'box-shadow: 0 0 3px rgba(0,0,0,.3);' }

  ${props => Positions[props.position]}
  ${props => Colors[props.color]}
  > div {
   font-size: 13px;
   white-space: nowrap;
  }
`;


export default
function CornerRibbon({
  label, children, ...ribbonProps
}) {
  return (
    <Ribbon>
      <Content {...ribbonProps}>
        {label}
      </Content>
      {children}
    </Ribbon>
  );
}

CornerRibbon.propTypes = {
  position: PropTypes.oneOf(Object.keys(Positions)),
  className: PropTypes.string,
  label: PropTypes.node,
  color: PropTypes.oneOf(Object.keys(Colors)),
  children: PropTypes.node,
  shadow: PropTypes.bool,
  fixed: PropTypes.bool,
  hidden: PropTypes.bool,
};
