import { Factory, C, ApiMock } from '../../helpers';
import LmsPair from '../../../src/screens/lms-pair';
import UX from '../../../src/screens/lms-pair/ux';

describe('pairing a course', () => {

    let props;
    let courses;

    ApiMock.intercept({
        'offerings': { items: [Factory.data('Offering', { id: 1, title: 'Test Offering' })] },
    })

    beforeEach(() => {
        courses = Factory.coursesMap({ is_teacher: true });
        props = {
            ux: new UX({
                router: { match: { params: {} } },
                courses,
            }),
        };
    });

    it('displays only create when no courses', () => {
        expect.snapshot(<C><LmsPair {...props} /></C>).toMatchSnapshot();
    });

    it('displays find or create when existing courses', () => {
        props.ux.courses = Factory.coursesMap();
        expect.snapshot(<C><LmsPair {...props} /></C>).toMatchSnapshot();
    });

    it('displays course listing', () => {
        props.ux.newOrExisting = 'existing';
        props.ux.stage = 1;
        const pair = mount(<C><LmsPair {...props} /></C>);
        expect(pair).toHaveRendered('Listing');
    });

    it('displays create course', () => {
        props.ux.courses = Factory.coursesMap();
        props.ux.newOrExisting = 'new';
        props.ux.stage = 1;
        expect.snapshot(<C><LmsPair {...props} /></C>).toMatchSnapshot();
    });

});
