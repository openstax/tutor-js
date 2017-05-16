import { filter, pick, sortBy } from 'lodash';
import {
  BaseModel, identifiedBy, session, identifier, field, belongsTo, computed,
} from '../../base';
import Course from '../../course';
import Courses from '../../courses-map';
import Offerings from './index';

@identifiedBy('course/offerings/preview')
export class PreviewCourseOffering extends Course {

  // @identifier id;
  // @session title;

  constructor(offering) {
    super({
      id: `preview-${offering.id}`,
      offering_id: offering.id,
      name: offering.title,
      appearance_code: offering.appearance_code,
      is_preview: true,
      roles: [ { type: 'teacher' }],
    });
  }


}


const preview = {

  @computed get all() {
    const tutor = sortBy(filter(Offerings.fetched.array, 'is_tutor'), 'title');
    return tutor.map(o => new PreviewCourseOffering(o));
  },

};

export default preview;
