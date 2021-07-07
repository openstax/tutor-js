import React from 'react'
import CourseDetails from '../../../src/screens/course-settings/course-details';
import { TimeMock, Factory } from '../../helpers'
import type { Course } from '../../../src/models'
import { mount } from 'enzyme'

describe('Course Settings, course details', () => {
    let props: any;
    let course: Course;

    TimeMock.setTo('2021-01-15T12:00:00.000Z');

    beforeEach(() => {
        course = Factory.course()
        props = {
            history: {},
            course,
        };
    });

    it('matches snapshot', () => {
        expect.snapshot(<CourseDetails {...props} />).toMatchSnapshot();
    })
    it('renders with correct dates', () => {
        const settings = mount(<CourseDetails {...props} />);
        expect(settings).toHaveRendered(
            `input[name="startDate"][value="${course.starts_at.toLocaleString('DATE_MED')}"]`
        )
        expect(settings).toHaveRendered(
            `input[name="endDate"][value="${course.ends_at.toLocaleString('DATE_MED')}"]`
        )
        settings.unmount()
    });

})
