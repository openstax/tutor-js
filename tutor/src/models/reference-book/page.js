import { readonly } from 'core-decorators';
import { merge, extend, defer, last, get } from 'lodash';
import htmlparser from 'htmlparser2';
import { action, observable, when,computed } from 'mobx';
import {
  BaseModel, identifiedBy, belongsTo, identifier, field, session, hasMany,
} from '../base';
import ChapterSection from '../chapter-section';
import { StepTitleActions } from '../../flux/step-title';
import { MediaActions } from '../../flux/media';
import Exercises from '../exercises';

@identifiedBy('reference-book/page')
export default class ReferenceBookPage extends BaseModel {
  @identifier id;
  @field title;
  @field type;
  @field cnx_id;
  @field short_id;
  @field uuid;
  @field({ model: ChapterSection }) chapter_section;
  @session part;
  @readonly depth = 2;
  @field content_html = '';
  @readonly isPage = true;

  @observable nextPage;
  @observable prevPage;

  linkNextPage(pg) {
    this.nextPage = pg;
    pg.prevPage = this;
    return pg;
  }

  //
  @action fetchExercises() {
  }

  @action ensureLoaded() {
    if (!this.api.isPending && !this.api.hasBeenFetched) { this.fetchContent(); }
  }

  @computed get contents() {
    // FIXME the BE sends HTML with head and body
    // Fixing it with nasty regex for now
    return this.content_html
      .replace(/^[\s\S]*<body[\s\S]*?>/, '')
      .replace(/<\/body>[\s\S]*$/, '');
  }

  fetchContent() { }

  @action onContentFetchComplete({ data }) {
    this.update(data);
    MediaActions.parse(this.content_html);
    StepTitleActions.parseMetaOnly(this.cnx_id, this.content_html);
  }

}
