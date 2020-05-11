import { React, PropTypes, styled, observer, useRef, useEffect } from 'vendor';
import { SplitRow, Label, HintText, TextInput, TextArea, Body } from './builder';
import RadioInput from '../../components/radio-input';
import PreviewTooltip from './preview-tooltip';
import NewTooltip from './new-tooltip';
import Tasking from './tasking';
import ConfirmTemplateModal from './confirm-template-modal';
import { OverlayTrigger, Tooltip, Dropdown } from 'react-bootstrap';
import ChangeTimezone from './change-timezone';
import { colors } from '../../theme';
import * as EDIT_TYPES from '../grading-templates/editors';
import { isEmpty } from 'lodash';
import isUrl from 'validator/lib/isURL';

const isRequired = (value) => isEmpty(value) && 'Cannot be blank';
const isValidUrl = (value) => !isUrl(value) && 'A valid URL is required';

const RowLabel = styled(Label)`
  max-width: 27rem;
  margin-right: 8rem;
`;

const FullWidthCol = styled.div`
  flex-basis: auto;
`;

const SectionRow = styled.div`
  margin-bottom: 2rem;
`;

const StyledTextInput = styled(TextInput)`
  max-width: 48rem;
`;

const StyledDropdown = styled(Dropdown)`
  display: inline-flex;
`;

const StyledToggle = styled(Dropdown.Toggle)`
  &&& {
    border: 1px solid ${colors.forms.borders.light};
    color: ${colors.neutral.darker};
    background: #fff;
    height: 3.4rem;
    width: 25rem;
    text-align: left;
    padding: 0 1rem;
    font-size: 1.6rem;
    display: inline-flex;
    align-items: center;
    justify-content: space-between;
    appearance: none;
    border-radius: 0.4rem;

    &:focus {
      border-color: ${colors.forms.borders.focus};
      box-shadow: 0 0 4px 0 ${colors.forms.borders.focusShadow};
    }

    &:after {
      color: ${colors.neutral.std};
      flex-basis: 0;
    }
  }
`;

const StyledMenu = styled(Dropdown.Menu)`
  && {
    width: 100%;
    border-radius: 0.4rem;

    .dropdown-item {
      padding: 0.8rem 1rem;
      font-size: 1.6rem;
      color: ${colors.neutral.darker};
    }
  }
`;

const StyledAddItem = styled(Dropdown.Item)`
  &&& {
    color: ${colors.link};
    padding: 0.8rem 1rem;
    font-size: 1.6rem;
    /* display: block; */
    font-weight: 400;
    background-color: transparent;
    border: 0;
  }
`;

const EditModal = observer(({ ux }) => {
  const Edit = EDIT_TYPES[ux.plan.type];
  const template = ux.course.gradingTemplates.newTemplate({ task_plan_type: ux.plan.type });

  if (Edit) {
    return (
      <Edit
        template={template}
        onComplete={ux.onHideAddTemplate}
      />
    );
  } else {
    return null;
  }
});

const TemplateField = observer(({ ux }) => {
  return (
    <SplitRow>
      <RowLabel htmlFor="">
        <NewTooltip>
          <span>Grading template</span>
        </NewTooltip>
        <HintText>(Apply a pre-set submission and grading policy template)</HintText>
      </RowLabel>
      <div>
        <StyledDropdown data-test-id="grading-templates">
          <StyledToggle variant="outline" data-test-id="selected-grading-template">
            {ux.gradingTemplate.name}
          </StyledToggle>
          <StyledMenu>
            {ux.gradingTemplates.map(t =>
              <Dropdown.Item
                key={t.id}
                value={t.id}
                eventKey={t.id}
                onSelect={k => ux.onSelectTemplate(k)}
                data-test-id={`${t.name}`}
              >
                {t.name}
              </Dropdown.Item>)}
            {ux.canAddTemplate &&
              <StyledAddItem as="button" onClick={ux.onShowAddTemplate} data-test-id="add-template">
                + Add new template
              </StyledAddItem>}
          </StyledMenu>
        </StyledDropdown>
        <PreviewTooltip template={ux.gradingTemplate} />
      </div>
    </SplitRow>
  );
});
TemplateField.propTypes = {
  ux: PropTypes.object.isRequired,
};

const ExternalUrlField = () => {
  return (
    <SplitRow>
      <RowLabel htmlFor="externalUrl">Assignment URL</RowLabel>
      <StyledTextInput
        name="settings.external_url"
        id="externalUrl"
        validate={isValidUrl}
      />
    </SplitRow>
  );
};

const DetailsBody = observer(({ ux }) => {
  const nameInputField = useRef();
  // assigment name is the first field, so it should first focused/
  // PS: useEffect is needed, with [], to run once the autofocus of the field
  // otherwise it will keep focusing the field because of the `haserror` prop that updates to check if the field is invalid
  useEffect(() => nameInputField.current && nameInputField.current.focus(), []);
  return (
    <Body>
      <SplitRow>
        <RowLabel htmlFor="title">
          Assignment name
          <HintText>(This will show on the student dashboard)</HintText>
        </RowLabel>
        <StyledTextInput
          name="title"
          id="title"
          validate={isRequired}
          data-test-id="edit-assignment-name"
          
          innerRef={nameInputField}
          haserror={Boolean(ux.form.touched.title && ux.form.errors.title)}
        />
      </SplitRow>
      <SplitRow>
        <RowLabel htmlFor="description">
          Additional note or instructions
          <HintText>(Optional)</HintText>
        </RowLabel>
        <TextArea
          name="description"
          id="description"
          data-test-id="assignment-note"
        />
      </SplitRow>
      {ux.canSelectTemplates && <TemplateField ux={ux} />}
      {ux.canInputExternalUrl && <ExternalUrlField ux={ux} />}
      <SplitRow>
        <RowLabel htmlFor="">
          Assign
          <HintText>
            Course Time Zone:<br/>
            <OverlayTrigger
              placement="top"
              overlay={<Tooltip>Click to change course time zone</Tooltip>}
            >
              <ChangeTimezone course={ux.course} />
            </OverlayTrigger>
            <HintText>
              (To immediately open an assignment, select ‘Now’ in the calendar.)
            </HintText>
          </HintText>
        </RowLabel>

        <FullWidthCol>
          <SectionRow>
            <RadioInput
              name="assignto"
              value="all"
              label="All sections"
              labelSize="lg"
              checked={!ux.isShowingPeriodTaskings}
              onChange={ux.togglePeriodTaskingsEnabled}
            />
            {!ux.isShowingPeriodTaskings && <Tasking ux={ux} />}
          </SectionRow>

          <SectionRow>
            <RadioInput
              name="assignto"
              value="periods"
              label="Select sections"
              labelSize="lg"
              checked={ux.isShowingPeriodTaskings}
              onChange={ux.togglePeriodTaskingsEnabled}
            />
            {ux.isShowingPeriodTaskings && ux.course.periods.map(p => <Tasking key={p.id} period={p} ux={ux} />)}
          </SectionRow>
        </FullWidthCol>
      </SplitRow>
      {ux.isShowingAddTemplate && <EditModal ux={ux} />}
      {ux.isShowingConfirmTemplate &&
        <ConfirmTemplateModal
          onConfirm={ux.onConfirmTemplate}
          onCancel={ux.onCancelConfirmTemplate}
        />}
    </Body>
  );
});

DetailsBody.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default DetailsBody;
