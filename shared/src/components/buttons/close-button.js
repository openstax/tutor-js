import React from 'react';
import PropTypes from 'prop-types';
import classnames from 'classnames';
import { filterProps } from '../../factories/link';

const CloseButton = (props) => {
    const classNames = classnames('openstax-close-x', 'close', props.className);
    return <button {...filterProps(props)} className={classNames} />;
};

CloseButton.propTypes = {
    className: PropTypes.string,
};

export default CloseButton;
