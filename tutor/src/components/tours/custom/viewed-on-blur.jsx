import PropTypes from 'prop-types';
import React        from 'react';
import ReactDOM     from 'react-dom';
import { Tooltip }  from 'react-joyride';
import { get }      from 'lodash';
import classnames   from 'classnames';

export default class ViewedOnBlur extends React.Component {
  className = 'viewed-on-blur-tooltip'

  static contextTypes = {
    router: PropTypes.object,
  }

  constructor(props) {
    super(props);

    this.checkIsBlur = this.checkIsBlur.bind(this);
  }

  componentDidMount() {
    this.tooltipEl = ReactDOM.findDOMNode(this.tooltip);

    document.addEventListener('click', this.checkIsBlur);
    document.addEventListener('focus', this.checkIsBlur);
  }

  componentWillReceiveProps(nextProps) {
    if (get(nextProps.step, 'joyrideRef.next')) {
      if (this.unlistenRouteChange) {
        this.unlistenRouteChange();
      }
      this.unlistenRouteChange = this.context.router.history.listen(nextProps.step.joyrideRef.next);
    }
  }

  componentWillUnmount() {
    this.unlistenRouteChange();

    document.removeEventListener('click', this.checkIsBlur);
    document.removeEventListener('focus', this.checkIsBlur);
  }

  checkIsBlur (focusEvent) {
    if(focusEvent.target !== this.tooltipEl && !this.tooltipEl.contains(focusEvent.target)) {
      this.props.step.joyrideRef.next();
    }
  }

  render () {
    const className = classnames(this.className, this.props.className);

    return (
      <Tooltip
        {...this.props}
        className={className}
        ref={tooltip => this.tooltip = tooltip}/>
    );
  }
}
