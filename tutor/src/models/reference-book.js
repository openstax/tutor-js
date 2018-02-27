import { readonly } from 'core-decorators';
import { last } from 'lodash';
import { action, observable, computed } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field, session, hasMany,
} from 'shared/model';
import ChapterSection from './chapter-section';
import Chapter from './reference-book/chapter';

function mapPages(section, pages) {
  if (section.isPage) {
    const lastPage = last(pages.byId.values());
    if (lastPage) { lastPage.linkNextPage(section); }
    pages.byId.set(section.id, section);
    pages.bySection.set(section.chapter_section.asString, section);
  }
  (section.children || []).forEach(child => {
    mapPages(child, pages);
  });
}

@identifiedBy('reference-book')
export default class ReferenceBook extends BaseModel {

  @identifier id;
  @field archive_url;
  @field webview_url;
  @field({ model: ChapterSection }) chapter_section

  @readonly pages = { bySection: observable.map(), byId: observable.map() };
  @hasMany({ model: Chapter, inverseOf: 'book' }) children;
  @field cnx_id;
  @field short_id;
  @field title;
  @field type;
  @field uuid;

  constructor(attrs) {
    super(attrs);
    mapPages(this, this.pages);
  }

  fetch() {
    return { id: this.id };
  }

  @action onApiRequestComplete({ data }) {
    this.update(data[0]);
    mapPages(this, this.pages);
  }

}
