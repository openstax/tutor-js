import { observable, computed, action } from 'mobx';
import Router from '../../helpers/router';
import { extend } from 'lodash';

import SlideOutMenuToggle from './slide-out-menu-toggle';
import SectionTitle from './section-title';
import AnnotationsSummaryToggle from './annotation-summary-toggle';
import TeacherContentToggle from './teacher-content-toggle';

const TEACHER_CONTENT_SELECTOR = '.os-teacher';

// menu width (300) + page width (1000) + 50 px padding
// corresponds to @reference-book-page-width and @reference-book-menu-width in variables.scss
const MENU_VISIBLE_BREAKPOINT = 1350;

export default class ReferenceBookUX {

  @observable isMenuVisible = window.innerWidth > MENU_VISIBLE_BREAKPOINT;
  @observable activeSection = '1';
  @observable isShowingTeacherContent = false;
  @observable hasTeacherContent = false;
  @observable lastSection;
  @observable navBar;

  constructor(course) {
    this.course = course;
    this.course.referenceBook.fetch().then(() => {
      if (this.activePage) { this.activePage.ensureLoaded(); }
    });
  }

  @computed get courseDataProps() {
    const { course } = this;
    return {
      'data-title': course.name,
      'data-book-title': course.bookName || '',
      'data-appearance': course.appearance_code,
    };
  }

  @action.bound toggleTeacherContent() {
    this.isShowingTeacherContent = !this.isShowingTeacherContent;
  }

  @action checkForTeacherContent() {
    this.hasTeacherContent = Boolean(
      document.querySelector(TEACHER_CONTENT_SELECTOR)
    );
    this.pendingCheck = null;
  }


  @action.bound toggleTocMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }


  @action.bound setSection(section = '1') {
    if (this.activeSection !== section) {
      this.lastSection = this.activeSection;
    }
    this.activeSection = section;
    if (this.activePage) { this.activePage.ensureLoaded(); }
  }

  @action setNavBar(nav) {
    nav.childProps.set('ux', this);
    nav.left.merge({
      'slide-out-menu-toggle': SlideOutMenuToggle,
      'section-title': SectionTitle,
    });
    nav.center.merge({
      'annotation-toggle': AnnotationsSummaryToggle,
    });
    if (this.course.isTeacher) {
      nav.right.merge({
        'teacher-content-toggle': TeacherContentToggle,
      });
    }

    this.navBar = nav;
  }

  @computed get pages() {
    return this.course.referenceBook.pages;
  }

  @computed get activePage() {
    return this.pages.get(this.activeSection);
  }

  @computed get toc() {
    return this.course.referenceBook.children;
  }

  routerLinkProps(section) {
    if (!section) { return null; }
    return {
      to: 'viewReferenceBookSection',
      params: extend(Router.currentParams(), { section: section.chapter_section.asString }),
      query: Router.currentQuery(),
    };
  }

  @action.bound onPrevSection() {
    this.setSection(this.activePage.prevPage.chapter_section.asString);
  }

  @action.bound onNextSection() {
    this.setSection(this.activePage.nextPage.chapter_section.asString);
  }

  @computed get pageProps() {
    return { ux: this };
  }

  @computed get pagingProps() {
    return {
      onForwardNavigation: this.onNextSection,
      onBackwardNavigation: this.onPrevSection,
      isForwardEnabled: !!this.activePage.nextPage,
      isBackwardEnabled: !!this.activePage.prevPage,
      forwardRouterProps: this.routerLinkProps(this.activePage.nextPage),
      backwardRouterProps: this.routerLinkProps(this.activePage.prevPage),
    };
  }

}
