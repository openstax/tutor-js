import { observable, computed, action, autorun } from 'mobx';
import { pick, assign, extend, uniq, flatMap } from 'lodash';
import MenuToggle from '../../components/book-menu/toggle';
import EcosystemSelector from './ecosystem-selector';
import Router from '../../helpers/router';
import Ecosystems from '../../models/ecosystems';
import UserMenu from '../../components/navbar/user-menu';
import Exercises from '../../models/exercises';

// menu width (300) + page width (1000) + 50 px padding
// corresponds to @reference-book-page-width and @reference-book-menu-width in variables.scss
const MENU_VISIBLE_BREAKPOINT = 1350;

export default class QaScreenUX {

  @observable ecosystemId;
  @observable section;
  @observable isMenuVisible = window.innerWidth > MENU_VISIBLE_BREAKPOINT;
  @observable isShowing2StepPreview = false;
  @observable ignoredExerciseTypes = [];

  constructor(router) {
    this.router = router;
    this.diposeExerciseFetcher = autorun(() => {
      if (this.ecosystem && !this.ecosystem.referenceBook.api.isFetchedOrFetching) {
        this.ecosystem.referenceBook.fetch()
          .then(() => { this.update({ section: '1' }); });
      }
      if (this.ecosystem && this.activePage) {
        Exercises.ensureLoaded({ ecosystem_id: this.ecosystem.id, page_id: this.activePage.id });
      }
    });
  }

  @computed get isFetchingExercises() {
    return Boolean(
      this.ecosystem &&
        this.activePage &&
        Exercises.isFetching({ ecosystem_id: this.ecosystem.id, page_id: this.activePage.id })
    );
  }

  @action dispose() {
    this.diposeExerciseFetcher();
  }

  @action update(props) {
    assign(this, pick(props, 'ecosystemId', 'section'));
  }

  @computed get exercises() {
    if (!this.activePage) { return []; }
    return Exercises.byPage[this.activePage.id] || [];
  }

  @computed get exerciseTypes() {
    return uniq(flatMap(this.exercises, 'types'));
  }

  // TODO, complete ignoring types
  isTypeIgnored() { return false; }

  @computed get activePage() {
    if (!this.section || !this.ecosystem) { return null; }
    return this.ecosystem.referenceBook.pages.get(this.section);
  }

  @action.bound toggleTocMenu() {
    this.isMenuVisible = !this.isMenuVisible;
  }

  @action.bound onEcosystemSelect(ecosystemId) {
    this.router.history.push(
      Router.makePathname('QADashboard', { ecosystemId }),
    );
  }

  @computed get ecosystem() {
    return Ecosystems.get(this.ecosystemId);
  }

  @computed get toc() {
    return this.ecosystem ? this.ecosystem.referenceBook.children : null;
  }

  @action.bound onMenuSelection() {
    if (this.isMenuOnTop) { this.isMenuVisible = false; }
  }

  sectionHref(section) {
    if (!section) { return null; }
    return Router.makePathname('QADashboard', {
      ecosystemId: this.ecosystemId,
      section: section.chapter_section.asString,
    });
  }

  sectionLinkProps(section) {
    if (!section) { return null; }
    return {
      to: 'QADashboard',
      params: extend(Router.currentParams(), { section: section.chapter_section.asString }),
    };
  }

  @action.bound onNavSetSection(path) {
    this.router.history.push(path);
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

  setNavBar(nav) {
    nav.childProps.set('ux', this);
    nav.left.merge({
      'slide-out-menu-toggle': MenuToggle,
    });
    nav.right.merge({
      ecosystems: EcosystemSelector,
      menu: UserMenu,
    });
  }

}
