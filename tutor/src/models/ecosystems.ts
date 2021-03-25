import Map from 'shared/model/map';
import Ecosystem from './ecosystems/ecosystem';
import { action } from 'mobx';

class EcosystemsMap extends Map {
  static Model = Ecosystem;

  constructor() {
    // TODO: [mobx-undecorate] verify the constructor arguments and the arguments of this automatically generated super call
    super();

    modelize(this);
  }

  // called by API
  fetch() { }

  @action onLoaded({ data }) {
      this.mergeModelData(data);
  }
}

const ecosystemsMap = new EcosystemsMap();

export { Ecosystem, EcosystemsMap };
export default ecosystemsMap;
