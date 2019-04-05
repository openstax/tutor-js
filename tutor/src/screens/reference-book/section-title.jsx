import React from 'react';
import { observer } from 'mobx-react';
import ChapterSection from '../../components/chapter-section';

const SectionTitle = observer(({ ux }) => (
  <React.Fragment>
    <span>
      <ChapterSection chapterSection={ux.page.chapter_section} />
    </span>
    <span className="title">
      {ux.page.title}
    </span>
  </React.Fragment>
));

const BakedSectionTitle = observer(({ ux }) => (
  <span dangerouslySetInnerHTML={{ __html: ux.page.title }} />
));

const SectionTitleWrapper = observer(({ ux }) => {
  if (!ux.page) { return null; }

  const Inner = ux.isCollated ? BakedSectionTitle : SectionTitle;

  return (
    <div className="section-title">
      <Inner ux={ux} />
    </div>
  );
});

export default SectionTitleWrapper;
