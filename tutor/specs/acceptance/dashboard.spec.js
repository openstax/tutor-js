import { openPage, snapshotPage } from './helpers';

const DASHBOARDS = {
  student: '.progress-guide',
  teacher: '.course-page',
};

describe('Course Dashboard', () => {
  let page;

  ['teacher', 'student'].forEach((role) => {

    describe(`as a ${role}`, () => {

      beforeEach(() => openPage('/dashboard', { role }).then((pg) => page = pg));

      afterEach(() => page.close());

      it(`matches snapshot for ${role}`, async () => {
        await page.click('.my-courses-item-wrapper a');
        await page.waitForSelector(DASHBOARDS[role]);
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

        if (role === 'student') {
          await page.click('.nav-tabs li:last-child a');
          snapshot = await snapshotPage(page, 'dashboard-past-work');
          expect(snapshot).toMatchPreviousPage();
        }
      });
    });
  });

});
