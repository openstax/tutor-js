import { observable, computed, action, observe } from 'mobx';
import Router from '../../helpers/router';
import { extend, first } from 'lodash';
import User from '../../models/user';
import MenuToggle from '../../components/book-menu/toggle';
import SectionTitle from './section-title';
import AnnotationsSummaryToggle from './annotation-summary-toggle';
import TeacherContentToggle from './teacher-content-toggle';
import WindowSize from '../../models/window-size';
import BookUX from '../../models/reference-book/ux';


const TEACHER_CONTENT_SELECTOR = '.os-teacher';

export default class ReferenceBookUX extends BookUX {

  @observable isShowingTeacherContent = false;
  @observable hasTeacherContent = false;
  @observable navBar;

  @action.bound toggleTeacherContent() {
    this.isShowingTeacherContent = !this.isShowingTeacherContent;
  }

  @action checkForTeacherContent() {
    this.hasTeacherContent = Boolean(
      document.querySelector(TEACHER_CONTENT_SELECTOR)
    );
    this.pendingCheck = null;
  }

  constructor(router, tours) {
    super();
    this.tours = tours;
    this.router = router;
  }

  @computed get allowsAnnotating() {
    return User.canAnnotate;
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
    if (this.course && this.course.isTeacher) {
      nav.right.merge({
        'teacher-content-toggle': TeacherContentToggle,
      });
    }
    this.navBar = nav;
  }

  sectionHref(section) {
    if (!section) { return null; }
    return Router.makePathname('viewReferenceBookSection', {
      ecosystemId: this.book.id,
      chapterSection: section.chapter_section.asString,
    }, { query: Router.currentQuery() });
  }

  sectionLinkProps(section) {
    return {
      to: 'viewReferenceBookSection',
      params: extend(Router.currentParams(), { chapterSection: section.chapter_section.asString }),
      query: Router.currentQuery(),
    };
  }

  @action.bound onNavSetSection(path) {
    this.router.history.push(path);
  }

  @computed get pageProps() {
    return { ux: this };
  }

}
