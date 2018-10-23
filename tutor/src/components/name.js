import _ from 'underscore';
import PropTypes from 'prop-types';
import React from 'react';
import BS from 'react-bootstrap';

class Name extends React.Component {
  static propTypes = {
    className:   PropTypes.string,
    first_name:  PropTypes.string,
    last_name:   PropTypes.string,
    name:        PropTypes.string,
    tooltip:     PropTypes.object,
  };

  render() {
    const name = _.isEmpty(this.props.name) ?
      `${this.props.first_name} ${this.props.last_name}`
      :
      this.props.name;

    const span = <span className={this.props.className || '-name'}>
      {name}
    </span>;

    if (this.props.tooltip != null ? this.props.tooltip.enable : undefined) {
      const tooltip = <BS.Tooltip id={`name-tooltip-${this.props.first_name}-${this.props.last_name}`}>
        {name}
      </BS.Tooltip>;
      return (
        <BS.OverlayTrigger
          placement={this.props.tooltip.placement}
          delayShow={this.props.tooltip.delayShow}
          delayHide={this.props.tooltip.delayHide}
          overlay={tooltip}>
          {span}
        </BS.OverlayTrigger>
      );
    } else {
      return span;
    }
  }
}


export default Name;
