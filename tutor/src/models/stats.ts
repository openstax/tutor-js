import { BaseModel } from 'shared/model';

export default class Stats extends BaseModel {

    // called by API
    fetch() {}
    onLoaded({ data }) {
        this.data = data.map(r => ({
            ...r,
            ends_at: Date.parse(r.ends_at),
            starts_at: Date.parse(r.starts_at),
        }));
    }

}
