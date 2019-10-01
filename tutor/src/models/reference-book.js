import { first, last, fromPairs, omit } from 'lodash';
import { action, observable, computed } from 'mobx';
import Map from 'shared/model/map';
import {
  BaseModel, identifiedBy, identifier, field, hasMany,
} from 'shared/model';
import ChapterSection from './chapter-section';
import Chapter from './reference-book/chapter';

function mapPages(page, pages) {
  if (page.isPage) {
    const lastPage = last(Array.from(pages.byId.values()));
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

export default
@identifiedBy('reference-book')
class ReferenceBook extends BaseModel {

  @identifier id;
  @field archive_url;
  @field webview_url;

  @field({ model: ChapterSection }) chapter_section;

  @computed get pages() {
    return mapPages(this, {
      byId: new Map({}, { keyType: String }),
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
  @field is_collated;

  fetch() {
    return { id: this.id };
  }

  @action onApiRequestComplete({ data }) {
    this.update(omit(first(data), 'id')); // data is an array
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
