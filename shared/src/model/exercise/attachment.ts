import type { Exercise } from '../course'
import {
    BaseModel, identifier, field, belongsTo,
} from '../../model';


export default
    class ExerciseAttachment extends BaseModel {

    @model(Exercise) exercise;

    @field asset;



}
