import React from 'react';
import { observer } from 'mobx-react';
import BookPartTitle from '../../components/book-part-title';

const SectionTitleWrapper = observer(({ ux: { page } }) => {
  if (!page) { return null; }

  return (
    <div className="section-title">
      <BookPartTitle className="title" part={page} displayChapterSection />
    </div>
  );
});

export default SectionTitleWrapper;
