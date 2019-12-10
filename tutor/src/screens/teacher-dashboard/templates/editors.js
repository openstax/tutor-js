import { React, PropTypes, observer } from 'vendor';
import { GradingTemplate } from '../../../models/grading/templates';

const propTypes = {
  template: PropTypes.instanceOf(GradingTemplate).isRequired,
};

const reading = observer(({ template }) => {
  return (
    <p>reading: {template.name}</p>
  );
});
reading.displayName = 'ReadingTemplateEditForm';
reading.propTypes = propTypes;


const homework = observer(({ template }) => {
  return (
    <p>homework: {template.name}</p>
  );
});
homework.displayName = 'HomeworkTemplateEditForm';
homework.propTypes = propTypes;


export { reading, homework };
