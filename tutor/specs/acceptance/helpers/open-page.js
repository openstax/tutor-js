const DEFAULT_VIEWPORT = { width: 1280, height: 1024 };
import setRole from './set-role';

export default async function openPage(
    path, {
        role,
        viewport = DEFAULT_VIEWPORT,
    } = {}
) {
    if (role) {
        await setRole(role);
    }
    // globals are from ./jest-environment.js
    const url = `${global.__SERVER__.url}${path}`;
    const page = await global.__BROWSER__.newPage();
    page.setViewport(viewport);
    await page.goto(url, { waitUntil: 'networkidle' });
    await page.waitForSelector('#ox-react-root-container');
    return page;
}
