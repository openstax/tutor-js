import PreviewAddCourseBtn from '../../../src/components/navbar/preview-add-course-btn';
import TourContext from '../../../src/models/tour/context';
import { C, Factory } from '../../helpers';

describe('Preview Add Course Button', () => {
    it('renders and matches snapshot', () => {
        expect.snapshot(
            <C withTours={new TourContext({ isEnabled: true })}>
                <PreviewAddCourseBtn course={Factory.course()} />
            </C>).toMatchSnapshot();
    });
});
