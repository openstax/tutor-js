import PropTypes from 'prop-types';
import React from 'react';
import { inject, observer } from 'mobx-react';
import NavbarContext from './context';
import cn from 'classnames';

export default
@inject('navBar')
@observer
class PlugableNavBar extends React.Component {

  static propTypes = {
    navBar: PropTypes.instanceOf(NavbarContext).isRequired,
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
};
