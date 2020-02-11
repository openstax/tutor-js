import { React, PropTypes, styled, observer } from 'vendor';
import { isEmpty } from 'lodash';
import { AssignmentBuilder, SplitRow, Label, HintText, TextInput, Setting, Body } from './builder';
import Select from '../../components/select';
import RadioInput from '../../components/radio-input';
import PreviewTooltip from './preview-tooltip';
import Tasking from './tasking';

const isRequired = (value) => isEmpty(value) && 'Cannot be blank';

const DetailsBody = styled(Body)`
  padding-left: 10.4rem;
`;

const Details = observer(({ ux }) => {
  return (
    <AssignmentBuilder
      title="Add Details"
      ux={ux}
    >
      <DetailsBody>
        <SplitRow>
          <Label htmlFor="">
            Assignment name
            <HintText>(This will show on the student dashboard)</HintText>
          </Label>
          <TextInput
            name="title"
            validate={isRequired}
          />
        </SplitRow>
        <SplitRow>
          <Label htmlFor="">
            Additional note or instructions
            <HintText>(Optional)</HintText>
          </Label>
          <TextInput
            name="description"
          />
        </SplitRow>
        <SplitRow>
          <Label htmlFor="">
            Grading template
            <HintText>(Apply a pre-set submission and grading policy template)</HintText>
          </Label>
          <div>
            <Select name="grading_template_id">
              {ux.gradingTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
            </Select>
            <PreviewTooltip template={ux.gradingTemplate} />
          </div>
        </SplitRow>
        <SplitRow>
          <Label htmlFor="">
            Assign
            <HintText>
              Course Time Zone:<br/>
              <a href="">Central Time - US & Canada</a>
              <HintText>
                (To immediately open an assignment, set
                Open Date to today's date & current time.)
              </HintText>
            </HintText>
          </Label>


          <div>
            <div>
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
            </div>
          </div>
        </SplitRow>

      </DetailsBody>
    </AssignmentBuilder>
  );
});

Details.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Details;
