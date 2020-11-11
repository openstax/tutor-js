import { BaseModel, identifiedBy, identifier, field, computed } from 'shared/model';
import User from '../user';  

export default
  @identifiedBy('exercises/author')
class ExerciseAuthor extends BaseModel {

    @identifier id;
    @field name;

    // Openstax exercises returns an id of 0;
    @computed get belongsToOpenStax() { return this.id === '0'; }
    @computed get belongsToCurrentUser() { return this.id === User.profile_id; }
    @computed get belongsToOtherAuthors() { return this.id !== User.profile_id; }
  }
