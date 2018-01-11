import { computed } from 'mobx';
import {
  BaseModel, identifiedBy, field, identifier, belongsTo,
} from '../base';

@identifiedBy('ecosystems/ecosystem')
export default class EcosystemBook extends BaseModel {

  @identifier id;
  @field title;
  @field uuid;
  @field version;
  @belongsTo({ model: 'ecosystems/ecosystem' }) ecosystem;

  @computed get titleWithVersion() {
    return `${this.title} ${this.version}`;
  }
}
