import { React, PropTypes, styled, css, observer } from 'vendor';
import { Form, Dropdown } from 'react-bootstrap';
import AddEditQuestionFormBlock from './shared';
import TutorDropdown from '../../dropdown';
import AddEditQuestionUX from '../ux';
import CheckboxInput from '../../../components/checkbox-input';
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
            color: ${colors.neutral.darker};
            font-weight: 700;
        }
    }

    .question-info {
      > .form-control {
          flex: 0 1 50%;
          ${fullWidthTablet}
      }
      > input {
          color: ${colors.neutral.darker};
          &::placeholder {
              font-size: 1.4rem;
              color: ${colors.neutral.thin};
          }
          &:focus {
              background-color: white;
          }
      }
    }

    .sharing-info {
      > label {
        margin: 0;
      }
      > div {
        display: flex;
        flex-flow: column wrap;
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
  return (
    <StyledGeneralForm>
      <Form.Group controlId="questionName" className="question-info">
        <Form.Label>Name</Form.Label>
        <Form.Control
          type="text"
          onChange={ux.changeQuestionName}
          value={ux.questionName}
          placeholder="Enter question name. Optional."
        />
      </Form.Group>
      {/** TODO: get teachers name and make this controlled in UX */}
      <div className="authors-info">
        <label>Author</label>
        <TutorDropdown
          toggleName={'Teacher\'s name'}
          dropdownItems={
            <>
              <Dropdown.Item
                key={1}
                value={1}
                eventKey={1}
                onSelect={() => console.log('changed author name')}>
        Co-teacher's name
              </Dropdown.Item>
              <Dropdown.Item
                key={2}
                value={2}
                eventKey={2}
                onSelect={() => console.log('changed teaching assitant name')}>
        Teaching Assistant’s name
              </Dropdown.Item>
            </>}
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
      formContentRenderer={() => <GeneralForm ux={ux}/>}
    />
  );
});
General.propTypes = {
  ux: PropTypes.instanceOf(AddEditQuestionUX).isRequired,
};

export default General;
