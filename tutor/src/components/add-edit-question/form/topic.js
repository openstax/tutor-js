import { React, PropTypes, styled, css, observer } from 'vendor';
import { map, startCase, partial } from 'lodash';
import { Dropdown } from 'react-bootstrap';
import { AddEditQuestionFormBlock } from './shared';
import TutorDropdown from '../../dropdown';
import AddEditQuestionUX from '../ux';
import { colors } from 'theme';

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
    .dropdown-button-wrapper {
      margin-left: 2rem;
      p {
        margin-top: 0.5rem;
        color: ${colors.strong_red};
      }
    }
  }
  .book-link a {
    ${lineHeight}
  }
`;

/** 
 * Reference nodes are chapter/sections in a book
*/
const dropDownReferenceNode = ({
  preSelectedNodes,
  selectedNode,
  onSelect,
  label,
  disabled,
  shouldBeFocus,
  onFocus,
  showIsEmpty
  }) => {
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
      <div><label>{startCase(label)}</label></div>
      <div className="dropdown-button-wrapper" onFocus={onFocus}>
        <TutorDropdown
          toggleName={selectedNode
            ? selectedNode.titleWithSection: `Select ${label}`}
          dropdownItems={nodes}
          disabled={disabled}
          shouldBeFocus={shouldBeFocus}
          hasError={showIsEmpty}
        />
        {showIsEmpty && <p>Link question to a {label} in the book</p>}
      </div>
    </div>
  );
};

const TopicForm = observer(({ ux }) => {
  return (
    <StyledTopicForm>
      { dropDownReferenceNode({
        preSelectedNodes: ux.preSelectedChapters,
        selectedNode: ux.selectedChapter,
        onSelect: ux.setSelectedChapterByUUID,
        label:'chapter',
        shouldBeFocus: !ux.selectedChapter,
        showIsEmpty: ux.isEmpty.selectedChapter,
        })}
      { dropDownReferenceNode({
        preSelectedNodes: ux.preSelectedChapterSections,
        selectedNode: ux.selectedChapterSection,
        onSelect: ux.setSelectedChapterSectionByUUID,
        label:'section',
        disabled: !ux.selectedChapter,
        shouldBeFocus: ux.selectedChapter && !ux.selectedChapterSection,
        showIsEmpty: ux.isEmpty.selectedChapterSection,
        })}
      <div className="book-link">
        <a
          aria-label="Browse the book"
          href={ux.browseBookLink}
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
