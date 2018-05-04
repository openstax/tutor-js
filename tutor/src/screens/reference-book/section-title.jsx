import React from 'react';
import { observer } from 'mobx-react';
import ChapterSection from '../../components/task-plan/chapter-section';

const SectionTitle = observer(({ ux }) =>
  ux.page ? (
    <div className="section-title">
      <span>
        <ChapterSection section={ux.page.chapter_section.asArray} />
      </span>
      <span className="title">
        {ux.page.title}
      </span>
    </div>
  ) : null
);

export default SectionTitle;
