import { React, PropTypes, styled, css, observer } from 'vendor';
import { map } from 'lodash';
// import { useField } from 'formik';
import { Dropdown } from 'react-bootstrap';
import AddEditQuestionFormBlock from './block';
import TutorDropdown from '../../../components/dropdown';
import AddEditQuestionUX from '../ux';
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
    display: flex;
    span {
      color: ${colors.neutral.darker};
      font-weight: 700;
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
  label) => {
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
      <div><span>{label}</span></div>
      <TutorDropdown
        toggleName={selectedNode
          ? selectedNode.titleWithSection: `Select ${label}`}
        dropdownItems={nodes}
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
        'Section') }
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
      formContentRenderer={() => <TopicForm ux={ux}/>}
    />
  );
});
Topic.propTypes = {
  ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

export default Topic;
