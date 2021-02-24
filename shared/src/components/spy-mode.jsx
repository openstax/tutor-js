import PropTypes from 'prop-types';
import React from 'react';
import classnames from 'classnames';
import { observable, action } from 'mobx';
import { Provider, observer } from 'mobx-react';

export class SpyModeContext {

  @observable isEnabled = false;

  toggle() { this.isEnabled = !this.isEnabled; }
}


@observer
class SpyModeWrapper extends React.Component {

  @observable mode = new SpyModeContext();

  static propTypes = {
      children: PropTypes.node,
  }

  @action.bound
  toggleDebug(ev) {
      ev.preventDefault();
      this.mode.toggle();
  }

  render() {
      return (
          <Provider spyMode={this.mode}>
              <div
                  className={classnames('openstax-debug-content', { 'is-enabled': this.mode.isEnabled })}>
                  {this.props.children}
                  <a
                      href="#spy"
                      tabIndex={-1}
                      onClick={this.toggleDebug}
                      className="debug-toggle-link"
                      aria-hidden="true">
            π
                  </a>
              </div>
          </Provider>
      );
  }
}

// eslint-disable-next-line
class SpyModeContent extends React.Component {

  static propTypes = {
      className: PropTypes.string,
      unstyled:  PropTypes.bool,
      children: PropTypes.node,
  }

  render() {
      return (
          <div
              className={classnames('visible-when-debugging', this.props.className, { unstyled: this.props.unstyled })}>
              {this.props.children}
          </div>
      );
  }
}

const SpyMode = {
    Content: SpyModeContent,
    Wrapper: SpyModeWrapper,
};

export { SpyModeWrapper, SpyModeContent };
export default SpyMode;
