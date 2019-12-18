import { computed } from 'mobx';
import {
  BaseModel, identifiedBy, field, identifier, belongsTo,
} from 'shared/model';

export default
@identifiedBy('ecosystems/ecosystem')
class EcosystemBook extends BaseModel {

  @identifier id;
  @field title;
  @field uuid;
  @field version;
  @belongsTo({ model: 'ecosystems/ecosystem' }) ecosystem;

  @computed get titleWithVersion() {
    return `${this.title} ${this.version}`;
  }
}
