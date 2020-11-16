import { React, PropTypes, styled, css, observer } from 'vendor';
import { map } from 'lodash';
// import { useField } from 'formik';
import { Dropdown } from 'react-bootstrap';
import AddEditQuestionFormBlock from './block';
import TutorDropdown from '../../../components/dropdown';
import { colors } from 'theme';

const lineHeight = css`
  line-height: 3.2rem;
`;

const StyledAddEditQuestionFormBlock = styled(AddEditQuestionFormBlock)`
  .label-wrapper span {
    ${lineHeight}
  }
`;

const StyledTopicForm = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 15rem;
  .dropdown-wrapper {
    span {
      color: ${colors.neutral.darker};
      font-weight: 700;
    }
    .dropdown {
      margin-left: 2rem;
    }
  }
  .book-link a {
    ${lineHeight}
  }
`;

const TopicForm = observer(({ ux }) => {
  const chapters = map(ux.preSelectedChapters, psc => 
    <Dropdown.Item
      key={psc.uuid}
      value={psc.uuid}
      eventKey={psc.uuid}
      onSelect={ux.setSelectedChapterByUUID}>
      {psc.titleWithSection}
    </Dropdown.Item>
  );
  const chapterSections = map(ux.preSelectedChapterSections, pscs =>
    <Dropdown.Item
      key={pscs.uuid}
      value={pscs.uuid}
      eventKey={pscs.uuid}
      onSelect={ux.setSelectedChapterSectionByUUID}>
      {pscs.titleWithSection}
    </Dropdown.Item>
  );
  return (
    <StyledTopicForm>
      <div className="dropdown-wrapper">
        <span>Chapter</span>
        <TutorDropdown
          toggleName={ux.selectedChapter
            ? ux.selectedChapter.titleWithSection: ' '}
          dropdownItems={chapters}
        />
      </div>
      <div className="dropdown-wrapper">
        <span>Section</span>
        <TutorDropdown
          toggleName={ux.selectedChapterSection
            ? ux.selectedChapterSection.titleWithSection: ' '}
          dropdownItems={chapterSections}
        />
      </div>
      <div className="book-link">
        <a
          aria-label="Browse the book"
          href={`/book/${1}`}
          target="_blank">
            Browse the book
        </a>
      </div>
    </StyledTopicForm>
  );
});

const Topic = observer(({ ux }) => {
  return (
    <StyledAddEditQuestionFormBlock
      label="Topic"
      formContentRenderer={() => <TopicForm ux={ux}/>}
    />
  );
});

Topic.propTypes = {

};

export default Topic;
