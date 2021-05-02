import { React, PropTypes, styled, observer, useRef, useEffect } from 'vendor';
import {
    SplitRow, Label, HintText, TextInput, TextArea, Body, GreyPopover,
} from './builder';
import RadioInput from '../../components/radio-input';
import PreviewTooltip from './preview-tooltip';
import Tasking from './tasking';
import ConfirmTemplateModal from './confirm-template-modal';
import { OverlayTrigger, Dropdown } from 'react-bootstrap';
import TutorDropdown from '../../components/dropdown';
import { colors } from '../../theme';
import * as EDIT_TYPES from '../grading-templates/editors';
import isUrl from 'validator/lib/isURL';

const lengthLimit = (n) =>
    (v) => (v && v.length > n) && `Cannot be longer than ${n} characters`;
const isRequired = (v) => (!v || !v.match(/\w+/)) && 'Cannot be blank';
const requiredAndLengthLimit = (n) => {
    const lim = lengthLimit(n);
    return (v) => isRequired(v) || lim(v);
};
const isValidUrl = (v = '') => !isUrl(v) && 'A valid URL is required';

const RowLabel = styled(Label)`
  max-width: 27rem;
  margin-right: 4rem;
`;

const FullWidthCol = styled.div`
  flex-basis: auto;
`;

const SectionRow = styled.div`
  margin-bottom: 2rem;
`;

const StyledTextInput = styled(TextInput)`
  font-size: 1.4rem;
  color: ${colors.neutral.darker};
  &[disabled] {
    background: ${colors.neutral.bright};
  }
`;

const StyledTextArea = styled(TextArea)`
  font-size: 1.4rem;
  color: ${colors.neutral.darker};
`;

const StyledAddItem = styled(Dropdown.Item)`
  &&& {
    color: ${colors.link};
    padding: 0.8rem 1rem;
    font-size: 1.4rem;
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
    const dropdownItems = 
    <>
        {
            ux.gradingTemplates.map(t =>
                <Dropdown.Item
                    key={t.id}
                    value={t.id}
                    eventKey={t.id}
                    onSelect={k => ux.onSelectTemplate(k)}
                    data-test-id={`${t.name}`}
                >
                    {t.name}
                </Dropdown.Item>)
        }
        {
            ux.canAddTemplate &&
        <StyledAddItem as="button" onClick={ux.onShowAddTemplate} data-test-id="add-template">
      + Add new template
        </StyledAddItem>
        }
    </>;

    return (
        <SplitRow>
            <RowLabel htmlFor="">
                <span>Grading template</span>
                <HintText>(Apply a pre-set submission and grading policy template)</HintText>
            </RowLabel>
            <div>
                <TutorDropdown
                    toggleName={ux.gradingTemplate.name}
                    dropdownItems={dropdownItems}
                    dropdownTestId="grading-templates"
                    toggleClassname="selected-grading-template"/>
                <PreviewTooltip template={ux.gradingTemplate} />
            </div>
        </SplitRow>
    );
});
TemplateField.propTypes = {
    ux: PropTypes.object.isRequired,
};

const ExternalUrlField = observer(({ ux }) => {
    const input = (
        <StyledTextInput
            name="settings.external_url"
            validate={isValidUrl}
            disabled={!ux.canEditSettings}
        />
    );

    const disabledInput = (
        <OverlayTrigger
            trigger="hover"
            placement="bottom"
            overlay={<GreyPopover>Cannot be edited after assignment is open</GreyPopover>}
        >
            {input}
        </OverlayTrigger>
    );

    return (
        <SplitRow>
            <RowLabel htmlFor="externalUrl">Assignment URL</RowLabel>
            {ux.canEditSettings ? input : disabledInput}
        </SplitRow>
    );
});

const ClonedAssignmentNotes = styled(({ ux, className }) => {
    if (!ux.showPreWRMCloneHelp) { return null; }
    return (
        <div className={className}>
            <div><b>Note</b></div>
            <ul>
                <li>OpenStax Tutor Beta allows you to assign points to questions.</li>
                <li>You can assign Written Response Questions (manually-graded) to students.</li>
                <li>By default, MCQs are worth 1 point, and WRQs are worth 2 points.</li>
                <li>To assign WRQs or to set points, click on Edit other details.</li>
            </ul>
        </div>
    );
})`
  color: ${colors.neutral.dark};
  ul {
    margin: 0;
    padding-left: 3rem;
  }
`;

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
                    {ux.titleTextLabel}
                    <HintText>(This will show on the student dashboard)</HintText>
                </RowLabel>
                <StyledTextInput
                    name="title"
                    id="title"
                    validate={requiredAndLengthLimit(100)}
                    data-test-id="edit-assignment-name"
                    innerRef={nameInputField}
                    hasError={Boolean(ux.form.touched.title && ux.form.errors.title)}
                />
            </SplitRow>
            <SplitRow>
                <RowLabel htmlFor="description">
          Additional note or instructions
                    <HintText>(Optional)</HintText>
                </RowLabel>
                <StyledTextArea
                    name="description"
                    id="description"
                    data-test-id="assignment-note"
                    validate={lengthLimit(500)}
                />
            </SplitRow>
            {ux.canSelectTemplates && <TemplateField ux={ux} />}
            {ux.canInputExternalUrl && <ExternalUrlField ux={ux} />}
            <SplitRow>
                <RowLabel htmlFor="">
          Assign
                    <HintText>
            Course Time Zone:<br/>
                        {ux.course.timezone}
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
                            data-test-id="all-sections"
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
                            data-test-id="select-sections"
                            checked={ux.isShowingPeriodTaskings}
                            onChange={ux.togglePeriodTaskingsEnabled}
                        />
                        {ux.isShowingPeriodTaskings && ux.course.periods.active.map(p => <Tasking key={p.id} period={p} ux={ux} />)}
                    </SectionRow>
                </FullWidthCol>
            </SplitRow>
            <ClonedAssignmentNotes ux={ux} />
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
