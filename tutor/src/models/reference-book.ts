import { first, last, fromPairs, omit, flatMap, filter } from 'lodash';
import { readonly } from 'core-decorators';
import Map, { hydrateInstance } from 'shared/model/map';
import { ReferenceBookObj } from './types'
import {
  BaseModel,
  field,
  model,
  modelize,
  observable,
  computed,
  NEW_ID,
} from 'shared/model';
import DateTime from 'shared/model/date-time';
import ChapterSection from './chapter-section';
import Node from './reference-book/node';
import Api from '../api'

function mapPages(page: ReferenceBook | Node, pages: any) {
    if (page.isPage) {
        const lastPage = last(Array.from(pages.byId.values())) as Node | undefined;
        if (lastPage) { lastPage.linkNextPage(page as Node); }
        pages.all.push(page);
        pages.byId.set(page.id, page);
        pages.byUUID.set(page.uuid, page);
        pages.byChapterSection.set(page.chapter_section.asString, page);
    }
    (page.children || []).forEach(child => {
        mapPages(child, pages);
    });
    return pages;
}

export default class ReferenceBook extends BaseModel {
    @field id = NEW_ID;

    @field({ model: ChapterSection }) chapter_section = ChapterSection.blank;
    @readonly isPage = false
    @readonly index = 0;

    @model(Node) children:Node[] = [];

    @field cnx_id = '';
    @field short_id = '';
    @field title = '';
    @field type = '';
    @field uuid = '';
    @model(DateTime) baked_at = DateTime.unknown;
    @field is_collated = true;

    @computed get pages() {
        return mapPages(this, {
            all: observable.array(),
            byId: new Map({}, { keyType: String }),
            byUUID: observable.map(),
            byChapterSection: observable.map(),
        });
    }

    @computed get chapters() {
        return flatMap(this.children, c => c.isChapter ? c : filter(c.children, 'isChapter'));
    }

    constructor() {
        super();
        modelize(this);
    }

    async fetch() {
        const data = await this.api.request<ReferenceBookObj[]>(Api.fetchReferenceBook({ bookId: this.id }))
        hydrateInstance(this, omit(first(data), 'id'))
    }

    async ensureFetched() {
        if (this.pages.all.length == 0) {
            return await this.fetch();
        }
        return Promise.resolve(this);
    }

    // a simplified data structure suitable for passing into flux
    @computed get topicInfo() {
        const pages = this.pages.byId;
        return fromPairs(Array.from(pages.keys()).map(id =>
            [id, pages.get(id).asTopic]
        ));
    }

    @computed get isBaked() {
        return Boolean(this.baked_at);
    }
}
