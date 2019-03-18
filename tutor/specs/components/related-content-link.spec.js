import { Factory } from '../helpers';
import ChapterSection from '../../src/models/chapter-section';
import RelatedContentLink from '../../src/components/related-content-link';
import RelatedContent from '../../src/models/related-content';

describe('Related Content Link', () => {

  it('renders and matches snapshot', () => {
    const content = [
      new RelatedContent({
        title: 'Intro', chapter_section: new ChapterSection([1,0])
      }),
      new RelatedContent({
        title: 'First', chapter_section: new ChapterSection([1,1])
      }),
    ];
    expect.snapshot(
      <RelatedContentLink course={Factory.course()} content={content} />
    ).toMatchSnapshot();
  });

});
