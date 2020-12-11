import { React, PropTypes, styled, css, observer } from 'vendor';
import { partial } from 'lodash';
import { Dropdown, Button } from 'react-bootstrap';
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

const checkboxes = css`
  span label {
    font-weight: normal;
    font-size: 1.6rem;
  }
  span:first-child {
    margin-bottom: 1rem;
  }
  svg {
    top: 2px !important;
    &[data-icon="check-square"] {
      color: ${colors.neutral.std};
    }
  }
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

    .authors-info {
      span {
        margin: auto 1rem;
        color: ${colors.neutral.thin};
      }
    }

    .sharing-info {
      margin-bottom: 2rem !important;
      > label {
        margin: 0;
      }
      > div {
        display: flex;
        flex-flow: column wrap;
        ${checkboxes}
      }
    }

    .exclude-original-info {
      > label {
        margin: 0;
      }
      ${checkboxes}
      .exclude-more-info {
        font-size: 1.4rem;
        color: ${colors.neutral.thin};
      }
    }
`;
  
const GeneralForm = observer(({ ux }) => {

  const excludeOriginalInfo = () => {
    if(!ux.fromExercise || ux.isUserGeneratedQuestion) {
      return null;
    }
    return (
      <div className="exclude-original-info">
        <label>Exclude Original?</label>
        <CheckboxInput
          onChange={ux.changeExcludeOriginal}
          label={
            <>
              <span>Exclude the original question from my Question Library. </span>
              <span className="exclude-more-info">(exclusions apply only to future assignments)</span>
            </>
          }
          checked={ux.excludeOriginal}
          standalone
        />
      </div>
    );
  };

  return (
    <StyledGeneralForm>
      <AddEditFormTextInput
        plainText
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
          disabled={!!ux.fromExercise}
          dropdownItems={ux.authors.map(tp => (
            <Dropdown.Item
              key={tp.id}
              value={tp.id}
              eventKey={tp.id}
              onSelect={ux.changeAuthor}
            >
              {tp.name}
            </Dropdown.Item>))}
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
                <Button variant="link" onClick={() => ux.showTermsOfUse = true}>Learn more.</Button>
              </>
            }
            checked={ux.allowOthersCopyEdit}
            standalone
          />
          <CheckboxInput
            onChange={ux.changeAnonymize}
            label="Anonymize my name on the question."
            checked={ux.anonymize}
            standalone
          />
        </div>
      </div>
      {excludeOriginalInfo()}
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
