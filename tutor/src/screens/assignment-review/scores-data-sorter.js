import { orderBy } from 'lodash';

const SORTERS = {
  name(student) {
    return [student.last_name.toLowerCase(), student.first_name.toLowerCase()];
  },
  total(student) {
    return student.total_points;
  },
  question(student, { key }) {
    return student.questions[key].points;
  },
};

const rowDataSorter = (sort) => {
  const sortFn = SORTERS[sort.dataType];
  return (row) => sortFn(row, sort);
};

const rowDataOrder = (sort) => sort.asc ? 'asc' : 'desc';

const StudentDataSorter = (rows, sort) => orderBy(rows, rowDataSorter(sort), rowDataOrder(sort));

export default StudentDataSorter;
