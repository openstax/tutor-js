import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';

class CountdownRedirect extends React.Component {
  static defaultProps = {
      secondsDelay: 10,
      message: 'Redirecting',
      windowImpl: window,
      redirectType: 'replace',
  };

  static propTypes = {
      children: PropTypes.node,
      secondsDelay: PropTypes.number,
      className: PropTypes.string,
      destinationUrl: PropTypes.string.isRequired,
      redirectType: PropTypes.oneOf(['replace', 'assign']),
      windowImpl: PropTypes.object,
      message: PropTypes.oneOfType([
          PropTypes.string,
          PropTypes.element,
      ]),
  };

  state = { secondsRemaining: this.props.secondsDelay };

  componentWillUnmount() {
      return this.props.windowImpl.clearInterval(this.state.updateInterval);
  }

  onCounterTick = () => {
      const secondsRemaining = this.state.secondsRemaining - 1;
      if (secondsRemaining <= 0) {
          return this.props.windowImpl.location[this.props.redirectType](this.props.destinationUrl);
      } else {
          return this.setState({ secondsRemaining });
      }
  };

  UNSAFE_componentWillMount() {
      return this.setState({ updateInterval: this.props.windowImpl.setInterval(this.onCounterTick, this.props.secondsDelay * 100) });
  }

  render() {
      return (
          <div className={classnames('countdown-redirect', this.props.className)}>
              <div className="message">
                  {this.props.message}
                  {' in '}
                  {this.state.secondsRemaining}
                  {' seconds'}
              </div>
              {this.props.children}
          </div>
      );
  }
}


export default CountdownRedirect;
