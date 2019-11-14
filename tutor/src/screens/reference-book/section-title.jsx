import React from 'react';
import { observer } from 'mobx-react';
import ChapterSection from '../../components/chapter-section';
import BookPartTitle from '../../components/book-part-title';

const SectionTitleWrapper = observer(({ ux: { page } }) => {
  if (!page) { return null; }

  return (
    <div className="section-title">
      <ChapterSection chapterSection={page.chapter_section} />
      <BookPartTitle className="title" title={page.title} />
    </div>
  );
});

export default SectionTitleWrapper;
