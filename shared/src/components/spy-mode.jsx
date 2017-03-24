import React from 'react';
import classnames from 'classnames';
import { observable, action } from 'mobx';
import { Provider, observer } from 'mobx-react';

export class SpyModeContext {

  @observable isEnabled = false;

  toggle() { this.isEnabled = !this.isEnabled; }
}

@observer
export class SpyModeWrapper extends React.PureComponent {

  @observable mode = new SpyModeContext();

  static propTypes = {
    children: React.PropTypes.node,
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
            className="debug-toggle-link">
            π
          </a>
        </div>
      </Provider>
    );
  }
}

export class SpyModeContent extends React.PureComponent {

  static propTypes = {
    className: React.PropTypes.string,
    unstyled:  React.PropTypes.bool,
    children: React.PropTypes.node,
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

export { SpyModeContent as Content, SpyModeWrapper as Wrapper };
