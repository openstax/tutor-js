// NOTE: This file is used in the loader so it's dependiencies should be kept to a minimum
import PropTypes from 'prop-types';
import React from 'react';
import cn from 'classnames';
import styled from 'styled-components';
import Staxly from './staxly-animation';

const Message = styled.h3`
  text-align: center;
  font-weight: bold;
  font-size: 24px;
  color: #5e6062;
  font-family: "HelveticaNeue", "Helvetica Neue", Helvetica, Arial, sans-serif;
`;

export default function LoadingAnimation({ className, message = 'Loading…' }) {
    return (
        <div className={cn('loading-animation', className)}>
            <Staxly isLoading={true} />
            <Message>{message}</Message>
        </div>
    );
}

LoadingAnimation.propTypes = {
    className: PropTypes.string,
    message: PropTypes.string,
};
