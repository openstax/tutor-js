import React from 'react';
import { observer } from 'mobx-react';
import { Form, FormControl, FormGroup, InputGroup } from 'react-bootstrap';
import { find, filter, isEmpty, partial, capitalize } from 'lodash';

import classnames from 'classnames';

import { NewCourseActions, NewCourseStore } from '../../flux/new-course';
import { CourseStore } from '../../flux/course';
import { OfferingsStore } from '../../flux/offerings';
import CourseInformation from '../../flux/course-information';

const MAX_SECTION_COUNT = 12;

@observer
export default class CourseDetails extends React.PureComponent {

  static title = 'Name your course';

  componentWillMount() {
    if (!NewCourseStore.get('num_sections')) { NewCourseActions.set({ num_sections: 1 }); }

    if (!NewCourseStore.get('name')) {
      const offeringId = NewCourseStore.get('offering_id');
      if (!offeringId) { return; }

      const term = NewCourseStore.get('term');
      const { appearance_code } = OfferingsStore.get(offeringId);
      const { title } = CourseInformation.forAppearanceCode(appearance_code);

      NewCourseActions.set({ 'name': `${title}, ${capitalize(term.term)} ${term.year}` });
    }
  }

  updateName(ev) {
    NewCourseActions.set({ name: ev.target.value });
  }

  updateSectionCount(ev) {
    const num_sections = Math.min(parseInt(ev.target.value, 10), MAX_SECTION_COUNT);
    NewCourseActions.set({ num_sections });
  }

  render() {
    return (
      <Form>
        <FormGroup className="course-details-name">
          <FormControl
            autoFocus={true}
            type="text"
            defaultValue={NewCourseStore.get('name') || ''}
            placeholder="Choose a name for your course"
            onChange={this.updateName} />
        </FormGroup>
        <FormGroup className="course-details-sections">
          <InputGroup>
            <InputGroup.Addon>
              Number of sections
            </InputGroup.Addon>
            <FormControl
              type="number"
              min="1"
              max={MAX_SECTION_COUNT}
              value={NewCourseStore.get('num_sections')}
              onChange={this.updateSectionCount} />
          </InputGroup>
          <p className="course-details-sections-note">
            <small>
              <i>
                (You can add or remove sections later)
              </i>
            </small>
          </p>
        </FormGroup>
      </Form>
    );
  }
}
