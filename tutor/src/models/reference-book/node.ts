import type Book from '../reference-book'
import { merge, pick, filter } from 'lodash';
import {
    BaseModel, model, NEW_ID, field, observable,
    modelize, getParentOf, hydrateModel, array,
    action, computed, override,
} from 'shared/model';
import { ChapterSection }from '../../models'
import { MediaActions } from '../../flux/media'
import type { ReferenceBook } from '../reference-book'

import urlFor from '../../api';

const NON_ASSIGNABLE_TITLES = [
    'Glossary',
    'Key Terms',
    /Problems \S+ Exercises/,
    /Summary$/,
    /Suggested Resource$/,
    /Test Prep/,
    /\w+ Questions$/,
    'Section Quiz',
    'Short Answer',
    'Further Research',
    'References',
];

const UPDATEABLE_FIELDS = ['content_html', 'spy'];
const NOT_FOUND_CONTENT = {
    id: -1,
    content_html: `
    <div className="invalid-page">
      <h1>
        Uh-oh, no page here
      </h1>
      <p>This page was not found</p>
    </div>
  `,
};

export class ReferenceBookNode extends BaseModel {


    // a mock page for use by entities such as exercises that need to indicate
    // they are not linked to a "real" page
    // eslint-disable-next-line
    static UNKNOWN = hydrateModel(ReferenceBookNode, { id: 'UNKNOWN', chapter_section: ['99','99'] })

    @field id = NEW_ID;
    @field title = '';
    @field type = '';

    @field cnx_id = '';
    @field short_id = '';
    @field uuid = '';
    @model(ChapterSection) chapter_section = ChapterSection.blank

    @observable chapter = '';

    @field content_html = '';

    @model(ReferenceBookNode) children = array((a: ReferenceBookNode[]) =>({
        get assignable() { return filter(a, 'isAssignable'); },
        get first() { return a.length ? a[0] : null; },
    }))

    constructor() {
        super();
        modelize(this);
    }

    @computed get hasContent() {
        return this.isPage;
    }

    @computed get isUnit() {
        return 'unit' === this.type;
    }
    @computed get isChapter() {
        return 'chapter' === this.type || 'part' == this.type;
    }
    @computed get isPage() {
        return 'page' === this.type;
    }

    @computed get index() {
        return this.parent && this.parent.children.indexOf(this);
    }

    @computed get pathId() {
        let n: any = this;
        let path = [this.index];
        while (n.parent) {
            n = n.parent;
            path.push(n.index);
        }
        return path.join('-');
    }

    get parent(): ReferenceBookNode | Book { return getParentOf(this) }

    // nb these are not observable, othewise they can't be set from within mapPages computed
    nextPage: ReferenceBookNode | null = null;
    prevPage: ReferenceBookNode | null = null;

    @action linkNextPage(pg: ReferenceBookNode) {
        this.nextPage = pg;
        pg.prevPage = this;
        return pg;
    }

    @action fetchExercises() {}

    @override async ensureLoaded(): Promise<void> {
        if (!this.content_html && !this.api.isPending && !this.api.hasBeenFetched) {
            this.fetchContent();
        }
    }

    @computed get contents() {
        // NS: The BE has fixed this on 2/28/2020
        // the regex can be removed after all ecosystems are re-imported
        return this.content_html
            .replace(/^[\s\S]*<body[\s\S]*?>/, '')
            .replace(/<\/body>[\s\S]*$/, '');
    }

    @computed get book(): ReferenceBook {
        let n: any = this;
        while (n.parent) {
            n = n.parent;
        }
        return n as ReferenceBook;
    }

    async fetchContent() {
        const data = await this.api.request(urlFor('fetchReferenceBookPage', {
            cnxId: this.cnx_id, ecosystemId: this.book.id,
        }));
        this.onContentFetchComplete(data);
    }

    @action onContentFetchComplete( data: any) {
        this.update(pick(data, UPDATEABLE_FIELDS));
        MediaActions.parse(this.content_html);
    }

    @computed get asTopic() {
        return merge({ chapter_section: this.chapter_section.asString }, pick(this, 'id', 'title'));
    }

    @computed get bookIsCollated() {
        return Boolean(this.book && this.book.is_collated);
    }

    onContentFetchFail() {
        this.update(NOT_FOUND_CONTENT);
    }

    @computed get isIntro() {
        return this.chapter_section.section < 2 && this.title.startsWith('Intro');
    }

    @computed get isChapterSectionDisplayed() {
        return Boolean(!this.isIntro && this.isAssignable);
    }

    @computed get titleText() {
        const match = this.title.match(/class="os-text">([^<]+)<\/span>/);
        return match ? match[1] : this.title;
    }

    @computed get isAssignable() {
        return !NON_ASSIGNABLE_TITLES.find(m => this.titleText.match(m));
    }

    @computed get titleWithSection() {
        if(!this.chapter_section || !this.chapter_section.chapter) {
            return this.titleText;
        }
        return `${this.chapter_section.asString}. ${this.titleText}`;
    }
}
