import { React, PropTypes, styled, css, observer } from 'vendor';
import { map } from 'lodash';
// import { useField } from 'formik';
import { Dropdown } from 'react-bootstrap';
import { AddEditQuestionFormBlock } from './shared';
import TutorDropdown from '../../dropdown';
import AddEditQuestionUX from '../ux';

const lineHeight = css`
  line-height: 3.2rem;
`;

const StyledAddEditQuestionFormBlock = styled(AddEditQuestionFormBlock)`
  .label-wrapper label {
    ${lineHeight}
  }
`;

const StyledTopicForm = styled.div`
  display: flex;
  justify-content: space-between;
  margin-right: 15rem;
  .dropdown-wrapper {
    display: flex;
    label {
      ${lineHeight}
    }
    .dropdown {
      margin-left: 2rem;
    }
  }
  .book-link a {
    ${lineHeight}
  }
`;

/** 
 * Reference nodes are chapter/sections in a book
*/
const dropDownReferenceNode = (
  preSelectedNodes,
  selectedNode,
  onSelect,
  label,
  disabled = false) => {
  const nodes = map(preSelectedNodes, psc => 
    <Dropdown.Item
      key={psc.uuid}
      value={psc.uuid}
      eventKey={psc.uuid}
      onSelect={onSelect}>
      {psc.titleWithSection}
    </Dropdown.Item>
  );
  return (
    <div className="dropdown-wrapper">
      <div><label>{label}</label></div>
      <TutorDropdown
        toggleName={selectedNode
          ? selectedNode.titleWithSection: `Select ${label}`}
        dropdownItems={nodes}
        disabled={disabled}
      />
    </div>
  );
};

const TopicForm = observer(({ ux }) => {
  return (
    <StyledTopicForm>
      { dropDownReferenceNode(
        ux.preSelectedChapters,
        ux.selectedChapter,
        ux.setSelectedChapterByUUID,
        'Chapter') }
      { dropDownReferenceNode(
        ux.preSelectedChapterSections,
        ux.selectedChapterSection,
        ux.setSelectedChapterSectionByUUID,
        'Section',
        !ux.selectedChapter) }
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
TopicForm.propTypes = {
  ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

const Topic = observer(({ ux }) => {
  return (
    <StyledAddEditQuestionFormBlock
      label="Topic"
      addPadding={false}
      formContentRenderer={() => <TopicForm ux={ux}/>}
    />
  );
});
Topic.propTypes = {
  ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

export default Topic;
