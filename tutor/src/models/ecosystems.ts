import Map from 'shared/model/map';
import Ecosystem from './ecosystems/ecosystem';
import { action } from 'mobx';

class EcosystemsMap extends Map {
  static Model = Ecosystem;

  // called by API
  fetch() { }

  @action onLoaded({ data }) {
      this.mergeModelData(data);
  }

}

const ecosystemsMap = new EcosystemsMap();

export { Ecosystem, EcosystemsMap };
export default ecosystemsMap;
