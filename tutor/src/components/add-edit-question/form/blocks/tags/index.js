import { React, PropTypes, styled, css, observer, cn } from 'vendor';
import { map, startCase } from 'lodash';
// import { useField } from 'formik';
import { Dropdown, ButtonGroup, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import AddEditQuestionFormBlock from '../shared';
import TutorDropdown from '../../../../dropdown';
import AddEditQuestionUX from '../../../ux';
import { TAG_TIMES, TAG_DIFFICULTIES, TAG_BLOOMS, TAG_DOKS } from './constants';
import { colors, breakpoint } from 'theme';
import { Icon } from 'shared';

const fullWidthTablet = css`
    ${breakpoint.tablet`
        flex: 0 1 100%;
    `}
`;

const StyledTagForm = styled.div`
    .tag-info {
        color: ${colors.neutral.thin};
    }
    .tag-form {
        display: flex;
        flex-flow: row wrap;
        > div {
            margin-top: 2.4rem;
        }
        > .tag-time, .tag-difficulty {
            flex: 0 1 45%;
            ${fullWidthTablet}
        }
        > .tag-bloom, .tag-dok {
            flex: 0 1 50%;
            ${fullWidthTablet}
        }
    }
    .tag-time, .tag-difficulty,
        .tag-bloom, .tag-dok {
        display: flex;
        flex-flow: row wrap;
        label, .label-info {
            margin: auto 0;
        }
        label {
            font-weight: 700;
            color: ${colors.neutral.darker};
        }
    }
    .tag-time, .tag-difficulty {
        label {
            flex: 0 1 20%;
        }
        .btn-group {
            flex: 0 1 70%;
            ${fullWidthTablet}
            .btn {
                background: white;
                color: ${colors.neutral.darker};
                padding: 0.5rem 0;
                border-color: ${colors.neutral.pale};
                width: 100%;
                &.selected {
                    background-color: ${colors.neutral.pale};
                }
                :active {
                    color: initial;
                    background-color: initial;
                    border-color: ${colors.neutral.pale};
                }
            }
        }
    }
    .tag-bloom, .tag-dok {
        .label-info {
            flex: 0 1 35%;
            svg {
                margin-left: 1rem;
                color: ${colors.bright_blue};
            }
        }
        .dropdown {
            flex: 0 1 60%;
            ${fullWidthTablet}
            .btn {
                width: 100%;
            }
        }
    }
`;

const StyledPopover = styled(Popover)`
  padding: 1.5rem;
  font-size: 1.4rem;
  p {
    color: ${colors.neutral.darker};
  }
  a {
    font-weight: 500;
  }
`;

// popovers info
const bloomPopover =
  <StyledPopover>
    <p>
        Bloom’s taxonomy is designed to make it easier for
        teachers to classify learning outcomes and write better assessments.
    </p>
    <a href="www.google.com" target="_blank">Learn More</a>
  </StyledPopover>;

const dokPopover =
  <StyledPopover>
    <p>
        Depth of Knowledge or DoK is used to identify the level of rigor for
        an assessment and categorize activities according to the level of complexity in thinking.
    </p>
    <a href="www.google.com" target="_blank">Learn More</a>
  </StyledPopover>;

// dropdown for bloom and dok tags
const dropDownTags = (
  tags,
  selectedTag,
  onSelect
) => {
  const tagItems = map(tags, t => 
    <Dropdown.Item
      key={t.value}
      value={t.value}
      eventKey={t.value}
      onSelect={onSelect}>
      {t.text}
    </Dropdown.Item>
  );
  return (
    <TutorDropdown
      toggleName={selectedTag
        ? selectedTag.text : 'Select level'}
      dropdownItems={tagItems}
    />
  );
};

const buttonTags = (tags, selectedTag, onClick, ariaLabel) => {
  return (
    <ButtonGroup aria-label={ariaLabel}>
      {map(tags, t => 
        <Button
          variant="secondary"
          className={cn({ 'selected': selectedTag === t })}
          value={t}
          onClick={onClick}>
          {startCase(t)}
        </Button>
      )}
    </ButtonGroup>
  );
};
  
const TagForm = observer(({ ux }) => {
  return (
    <StyledTagForm>
      <span className="tag-info">
          This information will help us to organize your question. Optional
      </span>
      <div className="tag-form">
        <div className="tag-time">
          <label>Time</label>
          {buttonTags(TAG_TIMES, ux.tagTime, ux.changeTimeTag, 'Tag times')}
        </div>
        <div className="tag-bloom">
          <div className="label-info">
            <label>Bloom's taxonomy</label>
            <OverlayTrigger placement="top" overlay={bloomPopover}>
              <Icon type="question-circle" />
            </OverlayTrigger>
          </div>
          {dropDownTags(TAG_BLOOMS, ux.tagBloom, ux.changeBloomTag)}
        </div>
        <div className="tag-difficulty">
          <label>Difficulty</label>
          {buttonTags(TAG_DIFFICULTIES, ux.tagDifficulty, ux.changeDifficultyTag, 'Tag difficulties')}
        </div>
        <div className="tag-dok">
          <div className="label-info">
            <label>Depth of knowledge</label>
            <OverlayTrigger placement="bottom" overlay={dokPopover}>
              <Icon type="question-circle" />
            </OverlayTrigger>
          </div>
          {dropDownTags(TAG_DOKS, ux.tagDok, ux.changeDokTag)}
        </div>
      </div>
    </StyledTagForm>
  );
});
TagForm.propTypes = {
  ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

const Tag = observer(({ ux }) => {
  return (
    <AddEditQuestionFormBlock
      label="Tags"
      showGrayBackground={true}
      formContentRenderer={() => <TagForm ux={ux}/>}
    />
  );
});
Tag.propTypes = {
  ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

export default Tag;
