import { observable, computed, action } from 'mobx';
import Router from '../../helpers/router';
import { extend, first } from 'lodash';
import User from '../../models/user';
import MenuToggle from '../../components/book-menu/toggle';
import SectionTitle from './section-title';
import AnnotationsSummaryToggle from './annotation-summary-toggle';
import TeacherContentToggle from './teacher-content-toggle';
import WindowSize from '../../models/window-size';

const TEACHER_CONTENT_SELECTOR = '.os-teacher';

// menu width (300) + page width (1000) + 50 px padding
// corresponds to @book-page-width and @book-menu-width in variables.scss
const MENU_VISIBLE_BREAKPOINT = 1350;

export default class ReferenceBookUX {

  @observable isMenuVisible = window.innerWidth > MENU_VISIBLE_BREAKPOINT;
  @observable activeSection = '1';
  @observable isShowingTeacherContent = false;
  @observable hasTeacherContent = false;
  @observable navBar;
  windowSize = new WindowSize();

  constructor(course, router) {
    this.course = course;
    this.router = router;

    if (!this.course.referenceBook.api.hasBeenFetched) {
      this.course.referenceBook.fetch().then(() => {
        if (this.activePage) {
          this.activePage.ensureLoaded();
        } else {
          this.setSection(); // will default to first section
        }
      });
    }
  }

  @computed get allowsAnnotating() {
    return User.canAnnotate;
  }

  @computed get isMenuOnTop() {
    return this.windowSize.width < MENU_VISIBLE_BREAKPOINT;
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

  @action.bound onMenuSelection(section) {
    this.setSection(section);
    if (this.isMenuOnTop) { this.isMenuVisible = false; }
  }

  @action.bound setSection(section) {
    if (!section) { section = first(this.pages.byChapterSection.keys()); }
    this.activeSection = section;
    if (this.activePage) { this.activePage.ensureLoaded(); }
  }

  @action setNavBar(nav) {
    nav.className='reference-book';
    nav.childProps.set('ux', this);
    nav.left.merge({
      'slide-out-menu-toggle': MenuToggle,
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
    return this.pages.byChapterSection.get(this.activeSection);
  }

  @computed get toc() {
    return this.course.referenceBook.children;
  }

  sectionHref(section) {
    if (!section) { return null; }
    return Router.makePathname('viewReferenceBookSection', {
      courseId: this.course.id,
      section: section.chapter_section.asString,
    }, { query: Router.currentQuery() });
  }

  sectionLinkProps(section) {
    if (!section) { return null; }
    return {
      to: 'viewReferenceBookSection',
      params: extend(Router.currentParams(), { section: section.chapter_section.asString }),
      query: Router.currentQuery(),
    };
  }

  @action.bound onNavSetSection(path) {
    this.router.history.push(path);
  }

  @computed get pageProps() {
    return { ux: this };
  }

  @computed get pagingProps() {
    return {
      onForwardNavigation: this.onNavSetSection,
      onBackwardNavigation: this.onNavSetSection,
      isForwardEnabled: !!this.activePage.nextPage,
      isBackwardEnabled: !!this.activePage.prevPage,
      forwardHref: this.sectionHref(this.activePage.nextPage),
      backwardHref: this.sectionHref(this.activePage.prevPage),
    };
  }

}
