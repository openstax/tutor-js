import { openPage, snapshotPage, setRole } from './helpers';

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

});
