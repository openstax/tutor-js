import { isNumber } from 'lodash';

const percent = (num, total) => Math.round((num / total) * 100) || 0;

const getSortValue = function(student, index, dataType, displayAs) {

  let result;
  if (!isNumber(index)) { return (student.last_name || student.name).toLowerCase(); }
  const record = student.data[index];
  if (!record) { return -1; }

  return result = (() => {
    let score;
    switch (record.type) {
    case 'reading':
      var progress =
        record.is_late_work_accepted ?
          record.completed_step_count
          :
          record.completed_on_time_step_count;
      return percent(progress, record.step_count);
    case 'homework':
      switch (dataType) {
      case 'score':
        score =
            record.is_late_work_accepted ?
              record.correct_exercise_count
              :
              record.correct_on_time_exercise_count;
        if (displayAs === 'number') {
          return score || 0;
        } else {
          return percent(score, record.exercise_count);
        }
      case 'completed':
        progress =
            record.is_late_work_accepted ?
              record.completed_exercise_count
              :
              record.completed_on_time_exercise_count;
        return percent(progress, record.exercise_count);
      }
      break;
    case 'concept_coach':
      switch (dataType) {
      case 'score':
        score = record.correct_exercise_count;
        if (displayAs === 'number') {
          return score || 0;
        } else {
          return percent(score, record.exercise_count) || 0;
        }
      case 'completed':
        progress = record.completed_exercise_count;
        return percent(progress, record.exercise_count);
      }
      break;
    default: // default to using record status for external and other type of events
      return record.status;
    }
  })();
};


const StudentDataSorter = ({ sort, displayAs }) =>
  score => getSortValue(score, sort.key, sort.dataType, displayAs);

export default StudentDataSorter;
