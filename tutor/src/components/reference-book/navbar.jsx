/*
 * decaffeinate suggestions:
 * DS102: Remove unnecessary code created because of implicit returns
 * Full docs: https://github.com/decaffeinate/decaffeinate/blob/master/docs/suggestions.md
 */
import React from 'react';
import BS from 'react-bootstrap';
import _ from 'underscore';
import cn from 'classnames';
import TutorLink from '../link';
import ChapterSection from '../task-plan/chapter-section';
import BindStoreMixin from '../bind-store-mixin';
// import { ReferenceBookStore } from '../../flux/reference-book';
// import { ReferenceBookPageStore } from '../../flux/reference-book-page';
import SlideOutMenuToggle from './slide-out-menu-toggle';
import AnnotationsSummaryToggle from '../annotations/summary-toggle';

// mixins: [BindStoreMixin]
// bindStore: ReferenceBookPageStore

export default class extends React.Component {
  static displayName = 'ReferenceBookNavBar';

  static propTypes = {
    courseId: React.PropTypes.string.isRequired,
    ecosystemId: React.PropTypes.string.isRequired,
    toggleTocMenu: React.PropTypes.func.isRequired,
    section: React.PropTypes.string.isRequired,
    isMenuVisible: React.PropTypes.bool.isRequired,
    extraControls: React.PropTypes.element,
  };

  renderSectionTitle = () => {
    const { section, ecosystemId } = this.props;
    const title = ReferenceBookStore.getPageTitle({ section, ecosystemId });

    return (

      (
        <div className="section-title">
          <span>
            <ChapterSection section={section} />
          </span>
          <span className="title">
            {title}
          </span>
        </div>
      )

    );
  };

  render() {
    return (
      (
        <nav
          className={cn('tutor-top-navbar', { 'menu-open': this.props.isMenuVisible })}>
          <div className="left-side-controls">
            <a
              className="menu-toggle"
              onClick={this.props.toggleTocMenu}
              tabIndex={0}
              aria-label={this.props.isMenuVisible ? 'Close Sections Menu' : 'Open Sections Menu'}>
              <SlideOutMenuToggle isMenuVisible={this.props.isMenuVisible} />
            </a>
            {this.renderSectionTitle()}
          </div>
          <div className="center-control">
            <div className="icons">
              <AnnotationsSummaryToggle
                type="refbook"
                section={this.props.section}
                courseId={this.props.courseId}
                ecosystemId={this.props.ecosystemId} />
            </div>
          </div>
          <div className="right-side-controls">
            {this.props.extraControls}
          </div>
        </nav>
      )
    );
  }
}
