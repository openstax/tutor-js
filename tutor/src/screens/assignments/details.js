import { React, PropTypes } from 'vendor';
import { isEmpty } from 'lodash';
import { AssignmentBuilder, SplitRow, Label, HintText, TextInput, Setting } from './builder';
import Select from '../../components/select';
import RadioInput from '../../components/radio-input';
import DatePicker from '../../components/date-time-input';

const isRequired = (value) => isEmpty(value) && 'Cannot be blank';

const Details = ({ ux }) => {

  return (
    <AssignmentBuilder
      title="Add Details"
      ux={ux}
    >
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
          <Select name="grading_template">
            {ux.gradingTemplates.map(t => <option key={t.id} value={t.id}>{t.name}</option>)}
          </Select>
          <a href="">Preview</a>
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
          <Setting>
            <RadioInput
              name="assignto"
              value="all"
              label="All sections"
              defaultChecked={true}
            />
          </Setting>
          <Setting>
            <RadioInput
              name="assignto"
              value="sections"
              label="Select sections"
            />
          </Setting>
        </div>
      </SplitRow>
      <SplitRow>
        <Label htmlFor="">
          Due at
        </Label>
        <Setting>
          <DatePicker name="first_published_at" />
        </Setting>
      </SplitRow>

    </AssignmentBuilder>
  );
};

Details.propTypes = {
  ux: PropTypes.object.isRequired,
};

export default Details;
