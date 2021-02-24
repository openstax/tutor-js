import { openPage, snapshotPage } from './helpers';

describe('Research Survey', () => {
    let page;
    let role = 'student';

    beforeEach(() => openPage('/surveys/1/1', { role }).then((pg) => page = pg));
    afterEach(() => page.close());

    it('matches snapshot for survey', async () => {
        const snapshot = await snapshotPage(page, 'survey');
        expect(snapshot).toMatchPreviousPage();
    });

});
