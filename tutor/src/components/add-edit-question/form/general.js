import { React, PropTypes, styled, css, observer } from 'vendor';
import { partial, map } from 'lodash';
import { Dropdown } from 'react-bootstrap';
import { AddEditQuestionFormBlock, AddEditFormTextInput } from './shared';
import TutorDropdown from '../../dropdown';
import AddEditQuestionUX from '../ux';
import CheckboxInput from '../../checkbox-input';
import { colors, breakpoint } from 'theme';

const fullWidthTablet = css`
    ${breakpoint.tablet`
        flex: 0 1 100%;
    `}
`;

const StyledGeneralForm = styled.div`
    > div {
        display: flex;
        flex-flow: row wrap;
        &:not(:last-child) {
          margin-bottom: 3.2rem;
        }
        > label {
            flex: 0 1 9%;
            margin: auto 0;
        }
    }

    .question-info {
      > .form-control {
          flex: 0 1 50%;
          ${fullWidthTablet}
      }
    }

    .sharing-info {
      > label {
        margin: 0;
      }
      > div {
        display: flex;
        flex-flow: column wrap;
        span label {
          font-weight: normal;
        }
        span:first-child {
          margin-bottom: 1rem;
        }
        svg {
          top: 2px;
          &[data-icon="check-square"] {
            color: ${colors.neutral.std};
          }
        }
      }
    }
`;
  
const GeneralForm = observer(({ ux }) => {
  const authors = map(ux.course.teacher_profiles, tp => (
    <Dropdown.Item
      key={tp.id}
      value={tp.id}
      eventKey={tp.id}
      onSelect={ux.changeAuthor}>
      {tp.name}
    </Dropdown.Item>
  ));

  return (
    <StyledGeneralForm>
      <AddEditFormTextInput
        onChange={ux.changeQuestionName}
        value={ux.questionName}
        label='Name'
        placeholder="Enter question name. Optional."
        className="question-info"
      />
      <div className="authors-info">
        <label>Author</label>
        <TutorDropdown
          toggleName={ux.author ? ux.author.name : ' '}
          dropdownItems={authors}
        />
      </div>
      <div className="sharing-info">
        <label>Sharing</label>
        <div>
          <CheckboxInput
            onChange={ux.changeAllowOthersCopyEdit}
            label={
              <>
                <span>Allow other instructors to copy and edit this question under the CC-BY license. </span>
                <a href="www.google.com" target="_blank">Learn more.</a>
              </>
            }
            checked={ux.allowOthersCopyEdit}
            standalone
          />
          <CheckboxInput
            onChange={ux.changeAnnonymize}
            label="Annonymize my name on the question."
            checked={ux.annonymize}
            standalone
          />
        </div>
      </div>
    </StyledGeneralForm>
  );
});
GeneralForm.propTypes = {
  ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

const General = observer(({ ux }) => {
  return (
    <AddEditQuestionFormBlock
      label="General"
      showGrayBackground={true}
      onFocus={partial(ux.checkValidityOfFields, [])}
      formContentRenderer={() => <GeneralForm ux={ux}/>}
    />
  );
});
General.propTypes = {
  ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

export default General;
