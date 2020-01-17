import { React, PropTypes } from 'vendor';
import { isEmpty } from 'lodash';
import { AssignmentBuilder, SplitRow, Label, HintText, TextInput, Setting } from './builder';
import AssignmentUX from './ux';
import Select from '../../components/select';
import RadioInput from '../../components/radio-input';

const isRequired = (value) => isEmpty(value) && 'Cannot be blank';

const Details = ({ ux }) => {
  return (
    <AssignmentBuilder
      title="Add Details"
      ux={ux}
    >
      <>
        <SplitRow>
          <Label htmlFor="">
            Assignment name
            <HintText>(This will show on the student dashboard)</HintText>
          </Label>
          <TextInput
            name="assignment_name"
            id="assignment_name"
            validate={isRequired}
          />
        </SplitRow>
        <SplitRow>
          <Label htmlFor="">
            Additional note or instructions
            <HintText>(Optional)</HintText>
          </Label>
          <TextInput
            name="additional_note"
            id="additional_note"
          />
        </SplitRow>
        <SplitRow>
          <Label htmlFor="">
            Grading template
            <HintText>(Apply a pre-set submission and grading policy template)</HintText>
          </Label>
          <div>
            <Select>
              <option>OpenStax Homework</option>
              <option>Other template</option>
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
                name="assignto" // TODO: Match names with normal form
                label="All sections"
                defaultChecked={true}
              />
            </Setting>
            <Setting>
              <RadioInput
                name="assignto"
                label="Select sections"
              />
            </Setting>
          </div>
        </SplitRow>
      </>
    </AssignmentBuilder>
  );
};

Details.propTypes = {
  ux: PropTypes.instanceOf(AssignmentUX).isRequired,
};

export default Details;
