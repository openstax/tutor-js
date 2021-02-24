import { Factory } from '../helpers';
import ChapterSection from '../../src/models/chapter-section';
import RelatedContentLink from '../../src/components/related-content-link';
import RelatedContent from '../../src/models/related-content';

describe('Related Content Link', () => {
    const content = [
        new RelatedContent({
            title: 'Intro', chapter_section: new ChapterSection([1,0]),
        }),
    ];

    it('renders and matches snapshot', () => {
        expect.snapshot(
            <RelatedContentLink course={Factory.course()} content={content} />
        ).toMatchSnapshot();
    });

    it('customizes preamble and link prefix', () => {
        const rcl = mount(
            <RelatedContentLink preamble='A test' course={Factory.course()} content={content} />,
        );
        expect(rcl.text()).toContain('A test');
        rcl.setProps({ linkPrefix: 'This is linked' });
        expect(rcl.find('BrowseTheBook a').text()).toContain('This is linked');
        rcl.unmount();
    });

    it('hides preamble', () => {
        const rcl = mount(
            <RelatedContentLink preamble='' course={Factory.course()} content={content} />,
        );
        expect(rcl.text()).not.toContain('Comes from');
        rcl.unmount();
    });

});
