import { React, PropTypes, styled, observer } from 'vendor';
import { isEmpty } from 'lodash';
import { AssignmentBuilder, SplitRow, Label, HintText, TextInput, Setting, Body } from './builder';
import Select from '../../components/select';
import RadioInput from '../../components/radio-input';
import PreviewTooltip from './preview-tooltip';
import NewTooltip from './new-tooltip';
import Tasking from './tasking';

const isRequired = (value) => isEmpty(value) && 'Cannot be blank';

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

const Details = observer(({ ux }) => {
  return (
    <AssignmentBuilder
      title="Add Details"
      ux={ux}
    >
      <DetailsBody>
        <SplitRow>
          <RowLabel htmlFor="">
            Assignment name
            <HintText>(This will show on the student dashboard)</HintText>
          </RowLabel>
          <TextInput
            name="title"
            validate={isRequired}
          />
        </SplitRow>
        <SplitRow>
          <RowLabel htmlFor="">
            Additional note or instructions
            <HintText>(Optional)</HintText>
          </RowLabel>
          <TextInput
            name="description"
          />
        </SplitRow>
        <SplitRow>
          <RowLabel htmlFor="">
            <NewTooltip>
              <span>Grading template</span>
            </NewTooltip>
            <HintText>(Apply a pre-set submission and grading policy template)</HintText>
          </RowLabel>
          <div>
            <Select name="grading_template_id">
              {ux.gradingTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
            <PreviewTooltip template={ux.gradingTemplate} />
          </div>
        </SplitRow>
        <SplitRow>
          <RowLabel htmlFor="">
            Assign
            <HintText>
              Course Time Zone:<br/>
              <a href="">Central Time - US & Canada</a>
              <HintText>
                (To immediately open an assignment, set
                Open Date to today's date & current time.)
              </HintText>
            </HintText>
          </RowLabel>

          <FullWidthCol>
            <Setting>
              <RadioInput
                name="assignto"
                value="all"
                label="All sections"
                checked={!ux.isShowingPeriodTaskings}
                onChange={ux.togglePeriodTaskingsEnabled}
              />
              {!ux.isShowingPeriodTaskings && <Tasking ux={ux} />}
            </Setting>

            <Setting>
              <RadioInput
                name="assignto"
                value="periods"
                label="Select sections"
                checked={ux.isShowingPeriodTaskings}
                onChange={ux.togglePeriodTaskingsEnabled}
              />
              {ux.isShowingPeriodTaskings && ux.course.periods.map(p => <Tasking key={p.id} period={p} ux={ux} />)}
            </Setting>
          </FullWidthCol>
        </SplitRow>

      </DetailsBody>
    </AssignmentBuilder>
  );
});

Details.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Details;
