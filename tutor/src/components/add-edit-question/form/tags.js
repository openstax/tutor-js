import { React, PropTypes, styled, css, observer } from 'vendor';
import { map } from 'lodash';
// import { useField } from 'formik';
import { Dropdown, ButtonGroup, Button, OverlayTrigger, Popover } from 'react-bootstrap';
import AddEditQuestionFormBlock from './block';
import TutorDropdown from '../../../components/dropdown';
import AddEditQuestionUX from '../ux';
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
        > .tag-bloom, .tag-knowledge {
            flex: 0 1 50%;
            ${fullWidthTablet}
        }
    }
    .tag-time, .tag-difficulty,
        .tag-bloom, .tag-knowledge {
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
                color: #424242;
                padding: 0.5rem 0;
                border-color: #d5d5d5;
                width: 100%;
            }
        }
    }
    .tag-bloom, .tag-knowledge {
        .label-info {
            flex: 0 1 40%;
            svg {
                margin-left: 1rem;
                color: ${colors.bright_blue};
            }
        }
        .dropdown {
            flex: 0 1 55%;
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

const bloomPopover =
  <StyledPopover>
    <p>
        Bloom’s taxonomy is designed to make it easier for
        teachers to classify learning outcomes and write better assessments.
    </p>
    <a href="www.google.com" target="_blank">Learn More</a>
  </StyledPopover>;

const knowledgePopover =
  <StyledPopover>
    <p>
        Depth of Knowledge or DoK is used to identify the level of rigor for
        an assessment and categorize activities according to the level of complexity in thinking.
    </p>
    <a href="www.google.com" target="_blank">Learn More</a>
  </StyledPopover>;
  
const TagForm = observer(({ ux }) => {
  return (
    <StyledTagForm>
      <span className="tag-info">
          This information will help us to organize your question. Optional
      </span>
      <div className="tag-form">
        <div className="tag-time">
          <label>Time</label>
          <ButtonGroup aria-label="Basic example">
            <Button variant="secondary">Short</Button>
            <Button variant="secondary">Medium</Button>
            <Button variant="secondary">Long</Button>
          </ButtonGroup>
        </div>
        <div className="tag-bloom">
          <div className="label-info">
            <label>Bloom's taxonomy</label>
            <OverlayTrigger placement="top" overlay={bloomPopover}>
              <Icon type="question-circle" />
            </OverlayTrigger>
          </div>
          <TutorDropdown
            toggleName={'Select level'}
            dropdownItems={<Dropdown.Item
              key={1}
              value={1}
              eventKey={1}
            >
            bloom nam
            </Dropdown.Item>}
          />
        </div>
        <div className="tag-difficulty">
          <label>Difficulty</label>
          <ButtonGroup aria-label="Basic example">
            <Button variant="secondary">Easy</Button>
            <Button variant="secondary">Medium</Button>
            <Button variant="secondary">Difficult</Button>
          </ButtonGroup>
        </div>
        <div className="tag-knowledge">
          <div className="label-info">
            <label>Depth of knowledge</label>
            <OverlayTrigger placement="bottom" overlay={knowledgePopover}>
              <Icon type="question-circle" />
            </OverlayTrigger>
          </div>
          <TutorDropdown
            toggleName={'Select level'}
            dropdownItems={<Dropdown.Item
              key={1}
              value={1}
              eventKey={1}
            >
            bloom nam
            </Dropdown.Item>}
          />
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
