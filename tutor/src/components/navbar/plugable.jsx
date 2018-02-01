import React from 'react';
import { inject, observer } from 'mobx-react';
import NavbarContext from './context';
import cn from 'classnames';

@inject('navBar')
@observer
export default class PlugableNavBar extends React.Component {

  static propTypes = {
    navBar: React.PropTypes.instanceOf(NavbarContext).isRequired,
  };

  render() {
    const { className, left, right, center } = this.props.navBar;
    return (
      <nav className={cn('tutor-top-navbar', 'plugable', className)}>
        <div className="left-side-controls">
          {left.components}
        </div>
        <div className="center-control">
          {center.components}
        </div>
        <div className="right-side-controls">
          {right.components}
        </div>
      </nav>
    );
  }
}
