import Map from './map';
import Ecosystem from './ecosystems/ecosystem';
import { computed, action } from 'mobx';

class Ecosystems extends Map {

  // called by API
  fetch() { }

  @action onLoaded({ data }) {
    data.forEach((eco) => {
      const course = this.get(eco.id);
      course ? course.update(eco) : this.set(eco.id, new Ecosystem(eco, this));
    });
  }

}


const ecosystemsMap = new Ecosystems();

export default ecosystemsMap;
