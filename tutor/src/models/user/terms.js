import {
  BaseModel, identifiedBy, identifier, field, belongsTo, hasMany,
} from '../base';

import { action, computed, observable } from 'mobx';
import { filter } from 'lodash';

@identifiedBy('user/term')
export class Term extends BaseModel {
  @identifier id;
  @field title;
  @field content;
  @field has_signed_before;
  @field is_proxy_signed;
  @field is_signed;
  @field name;

}

@identifiedBy('user/terms')
export class UserTerms extends BaseModel {

  @belongsTo({ model: 'user' }) user;
  @hasMany({ model: Term }) terms;

  constructor(attrs) {
    super(attrs);
    if (this.user.terms_signatures_needed) { this.fetch(); }
  }

  onLoaded({ data }) {
    this.terms = data; //map(data, (t) => new Term(t))
  }

  @computed get unsigned() {
    return filter(this.terms, t => !t.is_signed);
  }

  // will be overwritten by api
  fetch() {}

  onSigned() {
    this.user.terms_signatures_needed = false;
  }

  sign() {
    const ids = [];
    this.unsigned.forEach((t) => {
      ids.push(t.id);
      t.is_signed = true;
    });
    return { ids };
  }
}
