import {
  BaseModel, identifiedBy,
} from 'shared/model';

export default
@identifiedBy('stats')
class Stats extends BaseModel {

  // called by API
  fetch() {}
  onLoaded({ data }) {
    this.data = data;
  }

}
