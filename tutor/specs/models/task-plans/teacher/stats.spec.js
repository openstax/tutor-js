import Factory from '../../../factories';

describe('Task Plan Stats', () => {

  let stat, course;

  beforeEach(() => {
    course = Factory.course();
    stat = Factory.taskPlanStat({ course });
  });

  it('generats stats for periods', () => {
    expect(stat.stats.length).toEqual(course.periods.length);
  });

});
