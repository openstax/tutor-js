import { ID, Map, modelize, action }  from 'shared/model'
import { Ecosystem } from '../models'
import urlFor from '../api'

export class EcosystemsMap extends Map<ID, Ecosystem> {
    static Model = Ecosystem;

    constructor() {
        super();
        modelize(this);
    }

    @action async fetch() {
        const data = await this.api.request(urlFor('fetchEcosystems'))
        this.mergeModelData(data);
    }
}

export const currentEcosystems = new EcosystemsMap();
