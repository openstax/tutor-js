import Map from 'shared/model/map';
import Ecosystem from './ecosystems/ecosystem';
import { computed, action } from 'mobx';

class Ecosystems extends Map {

  // called by API
  fetch() { }

  @action onLoaded({ data }) {
    data.forEach((eco) => {
      const ecosystem = this.get(eco.id);
      ecosystem ? ecosystem.update(eco) : this.set(eco.id, new Ecosystem(eco, this));
    });
  }

}


const ecosystemsMap = new Ecosystems();

export default ecosystemsMap;
