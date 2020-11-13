import { React, PropTypes, styled, css } from 'vendor';
import { map } from 'lodash';
import { useField } from 'formik';
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

const renderTopicForm = ({ ux }) => {
  const [field, meta, errors] = useField({ name: 'chapter' });
  const dropdownItems = map(ux.preSelectedChapters, psc => 
    <Dropdown.Item
      eventKey={psc.uuid}
      onSelect={k => ux.selectedChapterUUID = k}>
      {`${psc.chapter_section.chapter}. ${psc.titleText}`}
    </Dropdown.Item>
  );
  return (
    <StyledTopicForm>
      <div className="dropdown-wrapper">
        <span>Chapter</span>
        <TutorDropdown
          toggleName='3. Culture'
          dropdownItems={dropdownItems}
        />
      </div>
      <div className="dropdown-wrapper">
        <span>Section</span>
        <TutorDropdown
          toggleName='3. Culture'
          dropdownItems={dropdownItems}
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
};

const Topic = ({ ux }) => {
  return (
    <StyledAddEditQuestionFormBlock
      label="Topic"
      formContentRenderer={(props) => renderTopicForm({ ux, ...props })}
    />
  );
};

Topic.propTypes = {

};

export default Topic;
