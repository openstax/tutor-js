import { orderBy, sortBy, find } from 'lodash';
import { action, observable, computed } from 'mobx';
import { modelize } from 'shared/model';
import Course from '../../course';
import Courses from '../../courses-map';
import Offerings from './index';
import CourseCreate from '../create';

export { PreviewCourseOffering };

class PreviewCourseOffering extends Course {

    @observable offering;
    @observable courseCreate;

    constructor(offering) {
        super({
            id: `preview-${offering.id}`,
            offering_id: offering.id,
            name: offering.title,
            appearance_code: offering.appearance_code,
            is_preview: true,
            roles: [ { type: 'teacher' } ],
        });
        modelize(this);
        this.offering = offering;
    }

    // This property is called to determine if the preview course already exists
    // We return false if shouldReusePreview is false so we get an updated course
    @computed get isCreated() {
        return !!(this.previewCourse && this.previewCourse.should_reuse_preview);
    }

    // To avoid errors, this method needs to accept any course returned by build()
    @computed get previewCourse() {
        return find(
            orderBy(Courses.preview.active.teaching.array, 'should_reuse_preview', 'desc'),
            { offering_id: this.offering_id }
        );
    }

    @computed get isBuilding() {
        return !!(this.courseCreate && this.courseCreate.api.isPending);
    }

    @action build() {
        if (this.isBuilding) { return Promise.resolve(this.courseCreate); }
        this.courseCreate = new CourseCreate({
            name: this.name,
            is_preview: true,
            offering_id: this.offering_id,
            term: this.offering.currentTerm,
        });
        return this.courseCreate.save();
    }

}


const Previews = {

    fetch() {
        Offerings.fetched;
    },

    get all() {
        const tutor = sortBy(Offerings.fetched.previewable.array, 'title');
        return tutor.map(o => new PreviewCourseOffering(o));
    },

};

modelize(Previews, {
    fetch: action,
    all: computed,
});

export default Previews;
