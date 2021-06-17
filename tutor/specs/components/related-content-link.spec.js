import { Factory, hydrateModel } from '../helpers';
import { ChapterSection, RelatedContent } from '../../src/models';
import RelatedContentLink from '../../src/components/related-content-link';

describe('Related Content Link', () => {
    const content = [
        hydrateModel(RelatedContent, {
            title: 'Intro',
            page: { id: 42 },
            chapter_section: hydrateModel(ChapterSection, [1, 0]),
        }),
    ];
    const noChapterSectionContent = [
        hydrateModel(RelatedContent, {
            title: 'Intro',
            page: { id: 42 },
            chapter_section: hydrateModel(ChapterSection, [undefined, undefined]),
        }),
    ];

    it('renders and matches snapshot with chapter_section', () => {
        expect.snapshot(
            <RelatedContentLink course={Factory.course()} content={content} />
        ).toMatchSnapshot();
    });

    it('renders and matches snapshot without chapter_section', () => {
        expect.snapshot(
            <RelatedContentLink course={Factory.course()} content={noChapterSectionContent} />
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
