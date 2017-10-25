import Stats from '../../../src/models/task-plan/stats';
import data from '../../../api/plans/1/stats.json';

describe('Task Plan Stats', () => {

  let stats;

  beforeEach(() => {
    stats = new Stats();
    stats.onApiRequestComplete({ data });
  });

  it('parses data', () => {
    expect(stats.stats).toHaveLength(7);
    expect(stats.stats[0].current_pages).toHaveLength(2);
    const page = stats.stats[0].current_pages[0];
    expect(page.title).toEqual('Introduction');
    expect(page.chapter_section.chapter).toEqual(1);
    expect(page.chapter_section.section).toEqual(2);
  });

});
