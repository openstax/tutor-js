import { observable, computed, action, autorun, modelize, override, runInAction } from 'shared/model';
import { readonly } from 'core-decorators';
import { extend, uniq, flatMap } from 'lodash';
import MenuToggle from '../../components/book-menu/toggle';
import EcosystemSelector from './ecosystem-selector';
import Router from '../../helpers/router';
import ViewToggle from './view-toggle';
import AppearanceSelector from './appearance-selector';
import UserMenu from '../../components/navbar/user-menu';
import { currentExercises, currentEcosystems } from '../../models';
import { BookUX } from '../../helpers/reference-book-base-ux'

// menu width (300) + page width (1000) + 50 px padding
// corresponds to @book-page-width and @book-menu-width in variables.scss
const MENU_VISIBLE_BREAKPOINT = 1350;

export default class QaScreenUX extends BookUX {

    @readonly allowsAnnotating = false;

    @observable isDisplayingExercises = true;
    @observable isShowing2StepPreview = false;
    @observable ignoredExerciseTypes = [];
    @observable appearance_code = 'default';
  
    constructor({
        history,
        exercises = currentExercises,
        ecosystems = currentEcosystems,
    }) {
        super();
        modelize(this);
        this.history = history;
        this.exercisesMap = exercises;
        this.ecosystemsMap = ecosystems;

        this.diposeExerciseFetcher = autorun(() => {
            if (this.ecosystem && !this.ecosystem.referenceBook.api.isFetchedOrFetching) {
                runInAction(() => this.ecosystemId = this.ecosystem.id );
            }
            if (this.book && this.page) {
                this.exercisesMap.ensurePagesLoaded({
                    book: this.book, page_ids: [this.page.id], limit: false,
                });
            }
        });
    }

    @computed get isFetchingExercises() {
        return Boolean(
            this.ecosystem &&
        this.page &&
        this.exercisesMap.isFetching({ page_id: this.page.id })
        );
    }

    @action unmount() {
        super.unmount();
        this.diposeExerciseFetcher();
    }

    @computed get exercises() {
        if (!this.page) { return []; }
        return this.exercisesMap.forPageId(this.page.id);
    }

    @computed get exerciseTypes() {
        return uniq(flatMap(this.exercises, 'types'));
    }

    // TODO, complete ignoring types
    isTypeIgnored() { return false; }

    @action.bound onEcosystemSelect(ecosystemId) {
        this.history.push(
            Router.makePathname('QADashboard', { ecosystemId }),
        );
    }

    @action.bound onAppearanceCodeSelect(code) {
        this.appearance_code = code;
    }

    @computed get ecosystem() {
        return this.ecosystemsMap.get(this.ecosystemId);
    }

    @action.bound setDisplayingCard(el, checked) {
        this.isDisplayingExercises = checked;
    }

    sectionHref(page) {
        if (!page) { return null; }
        return Router.makePathname('QADashboard', {
            ecosystemId: this.ecosystemId,
            pageId: page.id,
        });
    }

    propsForPage = (page) => {
        return {
            tabIndex: this.isMenuVisible ? 0 : -1,
            to: 'QADashboard',
            params: { ecosystemId: this.ecosystemId, pageId: page.id },
        };
    }

    bookLinkFor(props) {
        let { ecosystemId, pageId } = Router.currentParams();
        const { query } = props;
        return Router.makePathname(
            'QADashboard', { ecosystemId, pageId }, query
        );
    }

    rewriteBookLink(link) {
        const parts = link.pathname.split('/');
        if (parts.length < 4) { return; }
        const bookId = parts[2];
        const pageId = parts[3];
        link.href = `/qa/${bookId}/${pageId}`;
    }

    sectionLinkProps(section) {
        if (!section) { return null; }
        return {
            to: 'QADashboard',
            params: extend(Router.currentParams(), { pageId: section.id }),
        };
    }


    @action setNavBar(nav) {
        nav.childProps.set('ux', this);
        nav.left.replace({
            'slide-out-menu-toggle': MenuToggle,
        });
        nav.right.merge({
            view: ViewToggle,
            appearance: AppearanceSelector,
            ecosystems: EcosystemSelector,
            menu: UserMenu,
        });
    }

    @action clearNavBar(nav) {
        nav.resetToDefault();
    }

    @override get courseDataProps() {
        return { 'data-appearance': this.appearance_code };
    }
}
