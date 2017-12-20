/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * DS207: Consider shorter variations of null checks
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import React from 'react';
import _ from 'underscore';
import classnames from 'classnames';
import { SpyMode } from 'shared';

import CourseData from '../../helpers/course-data';
import Course from '../../models/course';
import Menu from './slide-out-menu';
import { ResizeListenerMixin, ChapterSectionMixin } from 'shared';
import Page from './page';
import ReferenceViewPageNavigation from './page-navigation';
import UX from './ux';


export default class ReferenceBook extends React.Component {

  //  mixins: [ResizeListenerMixin, ChapterSectionMixin]

  static propTypes = {
    navbarControls: React.PropTypes.element,
    ux: React.PropTypes.instanceOf(UX).isRequired,
  };

  isMenuOnTop = () => {
    return (
      this.state.windowEl.width < MENU_VISIBLE_BREAKPOINT
    );
  };

  onMenuClick = (section, ev) => {
    if (this.isMenuOnTop()) { this.toggleMenuState(); }
    return (
      (typeof this.props.onSectionSelection === 'function' ? this.props.onSectionSelection(section, ev) : undefined)
    );
  };

  toggleMenuState = (ev) => {
    this.setState({ isMenuVisible: !this.state.isMenuVisible });
    return (
      (ev != null ? ev.preventDefault() : undefined)
    );
  }; // needed to prevent scrolling to top

  render() {
    const { ux } = this.props;

    const className = classnames('reference-book', this.props.className,
      { 'menu-open': ux.isMenuVisible });

    return (
      <div {...ux.dataProps} className={className}>
        <SpyMode.Wrapper>
          <div className="content">
            <Menu ux={ux} />
            <ReferenceViewPageNavigation ux={ux}>
              <Page {...ux.pageProps} />
            </ReferenceViewPageNavigation>
          </div>
        </SpyMode.Wrapper>
      </div>
    );
  }
}
