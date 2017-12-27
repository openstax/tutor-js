import React from 'react';
import { inject, observer } from 'mobx-react';

import BS from 'react-bootstrap';
import _ from 'underscore';

import TutorLink from '../link';
import BindStoreMixin from '../bind-store-mixin';
// import { ReferenceBookStore } from '../../flux/reference-book';
// import { ReferenceBookPageStore } from '../../flux/reference-book-page';
import SlideOutMenuToggle from './slide-out-menu-toggle';

import NavbarContext from '../navbar/context';

@inject('navBar')
@observer
export default class ReferenceBookNavBar extends React.Component {

  static propTypes = {
    params: React.PropTypes.shape({
      courseId: React.PropTypes.string.isRequired,
    }).isRequired,
    navBar: React.PropTypes.instanceOf(NavbarContext).isRequired,
  };

  render() {
    const { left, right, center } = this.props.navBar;
    return (
      <nav className="tutor-top-navbar reference-book">
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

// <a
//   className="menu-toggle"
//   onClick={this.props.toggleTocMenu}
//   tabIndex={0}
//   aria-label={this.props.isMenuVisible ? 'Close Sections Menu' : 'Open Sections Menu'}>
//   <SlideOutMenuToggle isMenuVisible={this.props.isMenuVisible} />
// </a>
// {this.renderSectionTitle()}


// <div className="icons">
//   <AnnotationsSummaryToggle
//     type="refbook"
//     section={this.props.section}
//     courseId={this.props.courseId}
//     ecosystemId={this.props.ecosystemId} />
// </div>

// {this.props.extraControls}
