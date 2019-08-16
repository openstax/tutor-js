import {
  BaseModel, identifiedBy, identifier, field, belongsTo, hasMany,
} from 'shared/model';

import { computed } from 'mobx';
import { filter, isEmpty } from 'lodash';

@identifiedBy('user/term')
class Term extends BaseModel {
  @identifier id;
  @field title;
  @field content;
  @field has_signed_before;
  @field is_proxy_signed;
  @field is_signed;
  @field name;

}

@identifiedBy('user/terms')
class UserTerms extends BaseModel {

  @belongsTo({ model: 'user' }) user;
  @hasMany({ model: Term }) terms;

  constructor(attrs) {
    super(attrs);
    if (this.user.terms_signatures_needed) { this.fetch(); }
  }

  onLoaded({ data }) {
    this.terms = data;
    this.user.terms_signatures_needed = !isEmpty(this.unsigned);
  }

  @computed get unsigned() {
    return filter(this.terms, t => !t.is_signed);
  }

  // will be overwritten by api
  fetch() {}

  onSigned() {
    this.user.terms_signatures_needed = false;
    this.unsigned.forEach((t) => (t.is_signed = true));
  }

  sign() {
    const ids = [];
    this.unsigned.forEach((t) => {
      ids.push(t.id);
    });
    return { ids };
  }
}

export { Term, UserTerms };
