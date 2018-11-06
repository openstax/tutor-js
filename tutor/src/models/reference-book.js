import { readonly } from 'core-decorators';
import { uniq, compact, map, first, last, mapValues, omit } from 'lodash';
import { action, observable, computed } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field, session, hasMany,
} from 'shared/model';
import ChapterSection from './chapter-section';
import Chapter from './reference-book/chapter';

function mapPages(page, pages) {
  if (page.isPage) {
    const lastPage = last(pages.byId.values());
    if (lastPage) { lastPage.linkNextPage(page); }
    pages.byId.set(page.id, page);
    pages.byUUID.set(page.uuid, page);
    pages.byChapterSection.set(page.chapter_section.asString, page);
  }
  (page.children || []).forEach(child => {
    mapPages(child, pages);
  });
  return pages;
}

@identifiedBy('reference-book')
export default class ReferenceBook extends BaseModel {

  @identifier id;
  @field archive_url;
  @field webview_url;
  @field({ model: ChapterSection }) chapter_section;

  @computed get pages() {
    return mapPages(this, {
      byId: observable.map(),
      byUUID: observable.map(),
      byChapterSection: observable.map(),
    });
  }

  @hasMany({ model: Chapter, inverseOf: 'book' }) children;
  @field cnx_id;
  @field short_id;
  @field title;
  @field type;
  @field uuid;
  @field({ type: 'date' }) baked_at;

  fetch() {
    return { id: this.id };
  }

  @action onApiRequestComplete({ data }) {
    this.update(omit(first(data), 'id')); // data is an array
  }

  // a simplified data structure suitable for passing into flux
  @computed get topicInfo() {
    return mapValues(this.pages.byId.toJS(), pg => pg.asTopic);
  }

  @computed get isBaked() {
    return Boolean(this.baked_at);
  }

  sectionsForPageIds(pageIds) {
    return uniq(compact(map(pageIds, (pageId) => {
      const pg = this.pages.byId.get(pageId);
      return pg ? pg.chapter_section.asString : null;
    })));
  }

}
