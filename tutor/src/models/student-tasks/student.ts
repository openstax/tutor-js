import { BaseModel, field, NEW_ID } from 'shared/model';

export class TaskedStudent extends BaseModel {
    @field role_id = NEW_ID;
    @field name = '';
}
