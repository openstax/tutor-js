import { isNumber } from 'lodash';

const percent = (num, total) => Math.round((num / total) * 100) || 0;

const getSortValue = function(student, index, dataType, displayAs) {

  if (!isNumber(index)) { return (student.last_name || student.name).toLowerCase(); }
  const task = student.data[index];
  if (!task) { return -1; }

  let score;
  switch (task.type) {
    case 'reading':
      var progress = task.is_late_work_accepted ?
        task.completed_step_count : task.completed_on_time_step_count;
      return percent(progress, task.step_count);
    case 'homework':
      switch (dataType) {
        case 'score':
          score =
            task.is_late_work_accepted ?
              task.correct_exercise_count : task.correct_on_time_exercise_count;
          if (displayAs === 'number') {
            return score || 0;
          } else {
            return percent(score, task.exercise_count);
          }
        case 'completed':
          return task.completedPercent;
      }
      break;
  }

  // default to using task status for external and other type of events
  return task.status;
};


const StudentDataSorter = ({ sort, displayAs }) =>
  score => getSortValue(score, sort.key, sort.dataType, displayAs);

export default StudentDataSorter;
