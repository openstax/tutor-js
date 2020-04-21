import { React, PropTypes, styled, observer } from 'vendor';
import { isEmpty } from 'lodash';
import { AssignmentBuilder, SplitRow, Label, HintText, TextInput, TextArea, Body } from './builder';
import RadioInput from '../../components/radio-input';
import PreviewTooltip from './preview-tooltip';
import NewTooltip from './new-tooltip';
import Tasking from './tasking';
import { OverlayTrigger, Tooltip } from 'react-bootstrap';
import ChangeTimezone from './change-timezone';
import { Dropdown } from 'react-bootstrap';
import { colors } from '../../theme';
import * as EDIT_TYPES from '../grading-templates/editors';
import isUrl from 'validator/lib/isURL';

const isRequired = (value) => isEmpty(value) && 'Cannot be blank';
const isValidUrl = (value) => !isUrl(value) && 'A valid URL is required';

const DetailsBody = styled(Body)`
  padding-left: 10.4rem;
`;

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
          <StyledToggle variant="outline">
            {ux.gradingTemplate.name}
          </StyledToggle>
          <StyledMenu>
            {ux.gradingTemplates.map(t =>
              <Dropdown.Item
                key={t.id}
                value={t.id}
                eventKey={t.id}
                onSelect={k => {
                  ux.form.setFieldValue('grading_template_id', k);
                  ux.plan.grading_template_id = k;
                }}
                data-test-id={`${t.name}`}
              >
                {t.name}
              </Dropdown.Item>)}
            <StyledAddItem onSelect={ux.onShowAddTemplate} data-test-id="add-template">
              + Add new template
            </StyledAddItem>
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

const Details = observer(({ ux }) => {
  return (
    <AssignmentBuilder
      title="Add Details"
      ux={ux}
    >
      <DetailsBody>
        <SplitRow>
          <RowLabel htmlFor="title">
            Assignment name
            <HintText>(This will show on the student dashboard)</HintText>
          </RowLabel>
          <StyledTextInput
            name="title"
            id="title"
            validate={isRequired}
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
                (To immediately open an assignment, set
                Open Date to today's date & current time.)
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
      </DetailsBody>
      {ux.isShowingAddTemplate && <EditModal ux={ux} />}
    </AssignmentBuilder>
  );
});

Details.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Details;
