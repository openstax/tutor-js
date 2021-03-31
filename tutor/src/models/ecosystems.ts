import { ID, Map, modelize, action }  from 'shared/model'
import Ecosystem from './ecosystems/ecosystem'
import Api from '../api'

class EcosystemsMap extends Map<ID, Ecosystem> {
    static Model = Ecosystem;

    constructor() {
        super();
        modelize(this);
    }

    @action async fetch() {
        const data = await this.api.request(Api.fetchEcosystems())
        this.mergeModelData(data);
    }
}

const ecosystemsMap = new EcosystemsMap();

export { Ecosystem, EcosystemsMap };
export default ecosystemsMap;
