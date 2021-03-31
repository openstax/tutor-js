import { BaseModel, field, modelize } from 'shared/model';

export default class ViewedTourStat extends BaseModel {
    @field id:string = ''
    @field view_count = 1

    constructor() {
        super();
        modelize(this);
    }

}
