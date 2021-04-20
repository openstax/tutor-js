import { ChapterSection } from '../../../src/models';
import SectionTitle from '../../../src/screens/reference-book/section-title';

jest.mock('../../../src/models/student-tasks/task');

describe('Section Title Component', () => {
    let props;

    beforeEach(() => {
        props = {
            ux: {
                page: {
                    chapter_section: new ChapterSection('1.2'),
                    title: 'A good chapter section',
                },
            },
        };
    });

    it('renders section', () => {
        const t = mount(<SectionTitle {...props} />);
        expect(t.text()).toContain(props.ux.page.chapter_section.asString);
        expect(t.text()).toContain(props.ux.page.title);
        t.unmount();
    });

    it('renders and matches snapshot', () => {
        expect(<SectionTitle {...props} />).toMatchSnapshot();
    });

});
