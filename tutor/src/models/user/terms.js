import {
    BaseModel, identifiedBy, identifier, field, belongsTo, hasMany,
} from 'shared/model';
import { computed, action } from 'mobx';
import { isProd } from '../../helpers/production';

const REQUIRED_FOR_EVERYONE = [
    'general_terms_of_use',
    'privacy_policy',
];

@identifiedBy('user/term')
class Term extends BaseModel {
  @identifier id;
  @field title;
  @field content;
  @field has_signed_before;
  @field is_proxy_signed;
  @field is_signed;
  @field name;

  @computed get isRequired() {
      return !!REQUIRED_FOR_EVERYONE.includes(this.name);
  }

  @computed get hasAgreed() {
      return Boolean(this.is_signed || this.is_proxy_signed);
  }

}

@identifiedBy('user/terms')
class UserTerms extends BaseModel {

  @belongsTo({ model: 'user' }) user;
  @hasMany({ model: Term }) terms;

  hasAgreedTo(name) {
      const term = this.get(name);
      // allow bypassing terms on local dev since the localBE will not have the terms loaded
      return term ? term.hasAgreed : !isProd;
  }

  @computed get areSignaturesNeeded() {
      return this.requiredAndUnsigned.length !== 0;
  }

  @computed get requiredAndUnsigned() {
      return this.user.available_terms.filter(t => t.isRequired && !t.hasAgreed);
  }

  @action.bound fetchIfNeeded() {
      if (this.areSignaturesNeeded) { this.fetch(); }
  }

  get(name) {
      return this.user.available_terms.find(t => t.name == name);
  }

  // will be overwritten by api
  fetch() { }

  onLoaded({ data }) {
      data.forEach((termData) => {
          const term = this.get(termData.name);
          if (term) {
              term.update(termData);
          } else {
              this.user.available_terms.push(termData);
          }
      });
  }

  // called after signed api completes
  onSigned(resp, [ids]) {
      this.user.available_terms.forEach(t => {
          if (ids.includes(t.id)) {
              t.is_signed = true;
          }
      });

  }

  // called by api
  sign(ids) {
      return { ids };
  }
}

export { Term, UserTerms };
