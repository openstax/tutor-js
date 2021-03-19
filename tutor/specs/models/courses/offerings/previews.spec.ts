import OfferingsMap from '../../../../src/models/course/offerings';
import CoursesMap from '../../../../src/models/courses-map';
import Previews from '../../../../src/models/course/offerings/previews';

describe('Offering Previews Model', () => {
    describe('when the offering has previews disabled', () => {
        const OFFERINGDATA = { id: 42, is_preview_available: false }
        const COURSEDATA = {
            id: 21,
            offering_id: OFFERINGDATA.id,
            is_active: true,
            is_preview: true,
            should_reuse_preview: true,
            roles: [ { type: 'teacher' } ],
        }
        beforeAll(
            () => {
                OfferingsMap.onLoaded({ data: { items: [ OFFERINGDATA ] } });
                CoursesMap.onLoaded({ data: [ COURSEDATA ] });
            }
        );

        it('returns no preview offerings', () => {
            expect(Previews.all).toEqual([]);
        });
    });

    describe('when the offering has previews enabled', () => {
        const OFFERINGDATA = { id: 42, is_preview_available: true }
        beforeAll(() => OfferingsMap.onLoaded({ data: { items: [ OFFERINGDATA ] } }));

        describe('when the user has no courses', () => {
            beforeAll(() => CoursesMap.reset());

            it('returns a preview offering with no existing courses', () => {
                expect(Previews.all[0].isCreated).toBe(false);
                expect(Previews.all[0].previewCourse).toBeUndefined();
            });
        });

        describe('when the course has the wrong offering_id', () => {
            const COURSEDATA = {
                id: 21,
                offering_id: 84,
                is_active: true,
                is_preview: true,
                should_reuse_preview: true,
                roles: [ { type: 'teacher' } ],
            }
            beforeAll(() => CoursesMap.onLoaded({ data: [ COURSEDATA ] }));

            it('returns a preview offering with no existing courses', () => {
                expect(Previews.all[0].isCreated).toBe(false);
                expect(Previews.all[0].previewCourse).toBeUndefined();
            });
        });

        describe('when the course is not a preview course', () => {
            const COURSEDATA = {
                id: 21,
                offering_id: OFFERINGDATA.id,
                is_active: true,
                is_preview: false,
                should_reuse_preview: true,
                roles: [ { type: 'teacher' } ],
            }
            beforeAll(() => CoursesMap.onLoaded({ data: [ COURSEDATA ] }));

            it('returns a preview offering with no existing courses', () => {
                expect(Previews.all[0].isCreated).toBe(false);
                expect(Previews.all[0].previewCourse).toBeUndefined();
            });
        });

        describe('when the course is not active', () => {
            const COURSEDATA = {
                id: 21,
                offering_id: OFFERINGDATA.id,
                is_active: false,
                is_preview: true,
                should_reuse_preview: true,
                roles: [ { type: 'teacher' } ],
            }
            beforeAll(() => CoursesMap.onLoaded({ data: [ COURSEDATA ] }));

            it('returns a preview offering with no existing courses', () => {
                expect(Previews.all[0].isCreated).toBe(false);
                expect(Previews.all[0].previewCourse).toBeUndefined();
            });
        });

        describe('when the user is not teaching the course', () => {
            const COURSEDATA = {
                id: 21,
                offering_id: OFFERINGDATA.id,
                is_active: true,
                is_preview: true,
                should_reuse_preview: true,
                roles: [ { type: 'teacher_student' } ],
            }
            beforeAll(() => CoursesMap.onLoaded({ data: [ COURSEDATA ] }));

            it('returns a preview offering with no existing courses', () => {
                expect(Previews.all[0].isCreated).toBe(false);
                expect(Previews.all[0].previewCourse).toBeUndefined();
            });
        });

        describe('when the course is not reusable', () => {
            const COURSEDATA = {
                id: 21,
                offering_id: OFFERINGDATA.id,
                is_active: true,
                is_preview: true,
                should_reuse_preview: false,
                roles: [ { type: 'teacher' } ],
            }
            beforeAll(() => CoursesMap.onLoaded({ data: [ COURSEDATA ] }));

            it('isCreated is false but returns the existing preview course', () => {
                expect(Previews.all[0].isCreated).toBe(false);
                expect(Previews.all[0].previewCourse.id).toBe(COURSEDATA.id);
            });
        });

        describe(
            'when the user is teaching an active reusable preview course with the correct offering_id',
            () => {
                const COURSEDATA = {
                    id: 21,
                    offering_id: OFFERINGDATA.id,
                    is_active: true,
                    is_preview: true,
                    should_reuse_preview: true,
                    roles: [ { type: 'teacher' } ],
                }
                beforeAll(() => CoursesMap.onLoaded({ data: [ COURSEDATA ] }));

                it('isCreated is true and returns the existing preview course', () => {
                    expect(Previews.all[0].isCreated).toBe(true);
                    expect(Previews.all[0].previewCourse.id).toBe(COURSEDATA.id);
                });
            }
        );
    });
});
