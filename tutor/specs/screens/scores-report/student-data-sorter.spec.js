import { first, last, sortBy, map, shuffle } from 'lodash';
import StudentDataSorter from '../../../src/screens/scores-report/student-data-sorter';

import DATA from '../../../api/courses/1/performance';


describe('Student Scores Data Sorter', function() {
  let students;
  let args;

  beforeEach(function() {
    students = shuffle(DATA[0].students);
    args = {
      sort: {
        key: 'name',
        asc: true,
        dataType: 'score',
      },
      displayAs: 'percentage',
    };
  });

  it('defaults to sorting by name', () => {
    const names = map(sortBy(students, StudentDataSorter(args)), 'last_name');
    expect(names).to.deep.equal([
      'Angstrom', 'Bloom', 'Glass', 'Hackett', 'Jaskolski', 'Kirlin', 'Lowe', 'Reilly', 'Tromp',
    ]);
  });

  it('can sort by homework score', function() {
    args.sort.key = 0;
    args.sort.asc = false;
    const scores = map(sortBy(students, StudentDataSorter(args)), s => s.data[0].correct_on_time_exercise_count);
    expect(scores).to.deep.equal([0, 0, 0, 0, 1, 2, 2, 3, 4]);
  });

  it('can sort by reading progress', function() {
    args.sort.key = 1;
    args.sort.asc = false;
    const steps = map(sortBy(students, StudentDataSorter(args)), s => s.data[1].completed_on_time_step_count);
    expect(steps).to.deep.equal([ 0, 0, 0, 0, 0, 0, 4, 4, 29]);
    expect(first(steps)).to.equal(0);
    expect(last(steps)).to.equal(29);
  });

  return it('sorts external events', function() {
    args.sort.key = 2;
    args.sort.asc = false;
    const steps = map(sortBy(students, StudentDataSorter(args)), s => s.data[2].status);
    expect(first(steps)).to.equal('completed');
    expect(last(steps)).to.equal('not_started');
    expect(steps).to.deep.equal([
      'completed', 'completed', 'completed', 'not_started',
      'not_started', 'not_started', 'not_started', 'not_started', 'not_started']);
  });
});
