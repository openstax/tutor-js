/* eslint-disable no-undef */
import { openPage, snapshotPage } from './helpers';

describe('My Courses', () => {
  let page;

  ['teacher', 'student'].forEach((role) => {

    describe(`as a ${role}`, () => {

      beforeEach(() => openPage('/dashboard', { role }).then((pg) => page = pg));
      afterEach(() => page.close());

      it(`matches snapshot for ${role}`, async () => {
        const snapshot = await snapshotPage(page, 'my-courses');
        expect(snapshot).toMatchPreviousPage();
      });

    });
  });

  it('displays pending for non-verified instructor', async () => {
    const page = await openPage('/dashboard', { role: 'teacher' });
    await page.evaluate(() => {
      _MODELS.COURSES.clear();
      _MODELS.USER.self_reported_role = 'instructor';
    });
    const snapshot = await snapshotPage(page, 'my-courses-pending-verification');
    expect(snapshot).toMatchPreviousPage();
  });

});
