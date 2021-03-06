import { isString } from 'lodash';

const percent = (num, total) => Math.round((num / total) * 100) || 0;

const getSortValue = function(student, key, dataType, displayAs) {
    // reading a property directly from student model
    if (isString(key)) {
        // if value is a string, normalize it
        if(isString(student[key])) {
            return student[key].toLowerCase();
        } else {
            return student[key]
        }
    }
    const task = student.data[key];
    if (!task) { return -1; }
    let score;
    switch (task.type) {
        case 'reading':
            var progress = task.completed_on_time_step_count;
            return percent(progress, task.step_count);
        case 'homework':
            switch (dataType) {
                case 'score':
                    score = task.published_score;
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


const StudentDataSorter = {
    rows({ sort, displayAs }) {
        return score => getSortValue(score, sort.key, sort.dataType, displayAs);
    },
    columns: {
        points: {
            tasks(task) { return task.available_points; },
            headings(heading){ return heading.available_points; },
        },
        type: {
            tasks(task) { return task.type; },
            headings(heading){ return heading.type; },
        },
        type_and_points: {
            tasks(task) { return [
                StudentDataSorter.columns.type.tasks(task), StudentDataSorter.columns.points.tasks(task),
            ]; },
            headings(heading) { return [
                StudentDataSorter.columns.type.headings(heading), StudentDataSorter.columns.points.headings(heading),
            ]; },
        },
        default: {
            tasks() { return null; },
            headings() { return null; },
        },
    },
};

export default StudentDataSorter;
