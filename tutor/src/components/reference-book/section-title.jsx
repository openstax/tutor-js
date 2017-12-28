import React from 'react';
import { observer } from 'mobx-react';
import ChapterSection from '../task-plan/chapter-section';

const SectionTitle = observer(({ ux }) =>
  ux.activePage ? (
    <div className="section-title">
      <span>
        <ChapterSection section={ux.activePage.chapter_section.asArray} />
      </span>
      <span className="title">
        {ux.activePage.title}
      </span>
    </div>
  ) : null
);

export default SectionTitle;
