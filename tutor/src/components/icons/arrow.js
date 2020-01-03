import PropTypes from 'prop-types';
import React from 'react';

const PATHS = {
  right: 'M0,658.604l0,76.396l369.225,-369.225l-0.3,-0.3l-368.925,-365.475l0,77.168l291.449,290.332l-291.449,291.104Z',
  left:  'M369.225,658.604l0,76.396l-369.225,-369.225l0.3,-0.3l368.925,-365.475l0,77.168l-291.449,290.332l291.449,291.104Z',
  up:    'M76.396,0l-76.396,0l369.225,369.225l0.3,-0.3l365.475,-368.925l-77.168,0l-290.332,291.449l-291.104,-291.449Z',
  down:  'M76.396,0l-76.396,0l369.225,369.225l0.3,-0.3l365.475,-368.925l-77.168,0l-290.332,291.449l-291.104,-291.449Z',
};

// created as plain class without this binding and never updates
class Arrow extends React.Component {

  static propTypes = {
    direction: PropTypes.oneOf(['left', 'right', 'up', 'down']),
  };

  shouldComponentUpdate(nextProps) { return nextProps.direction !== this.props.direction; }

  render() {
    const vertical = (this.props.direction === 'up') || (this.props.direction === 'down');
    return (
      <svg
        className={`icon arrow ${this.props.direction}`}
        version="1.1"
        xmlns="http://www.w3.org/2000/svg"
        x="0px"
        y="0px"
        viewBox={`0 0 ${vertical ? '735 370' : '370 735' }`}>
        <path d={PATHS[this.props.direction]} />
      </svg>
    );
  }
}


export default Arrow;
