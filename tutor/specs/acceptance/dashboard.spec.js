import { openPage, snapshotPage, setRole } from './helpers';

describe('Course Dashboard', () => {
  let page;

  let role = 'student';

  beforeEach(() => openPage('/dashboard', { role }).then((pg) => page = pg));

  afterEach(() => page.close());

  it(`matches welcome snapshot for ${role}`, async () => {
    await page.click('.my-courses-item-wrapper a');
    await page.waitForSelector('.progress-guide');
    let tip = await page.$('.joyride-tooltip__button--primary');
    let i = 1;
    while(tip) {
      await snapshotPage(page, `dashboard-tip-${i}`);
      i += 1;
      await page.click('.joyride-tooltip__button--primary');
      tip = await page.$('.joyride-tooltip__button--primary');
    }
    let snapshot = await snapshotPage(page, 'dashboard');
    expect(snapshot).toMatchPreviousPage();

    await page.click('.nav-tabs li:last-child a');
    snapshot = await snapshotPage(page, 'dashboard-past-work');
    expect(snapshot).toMatchPreviousPage();
  });

});
