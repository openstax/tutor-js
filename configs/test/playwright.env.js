const PlaywrightEnvironment = require('jest-playwright-preset/lib/PlaywrightEnvironment').default;
const playwright = require('playwright');
const chalk = require('chalk');


const createDataTestIdEngine = () => {

    const toTestSelector = (sel) => {
        const quoted = sel.match(/^".*"$/) ? sel : `"${sel}"`;
        return `[data-test-id=${quoted}]`;
    };

    return {
    // Creates a selector that matches given target when queried at the root.
    // Can return undefined if unable to create one.
        create(root, target) {
            const testId = target.getAttribute('data-test-id');
            return (testId && root.querySelector(toTestSelector(testId)) === target) ? testId : undefined;
        },

        // Returns the first element matching given selector in the root's subtree.
        query(root, selector) {
            return root.querySelector(toTestSelector(selector));
        },

        // Returns all elements matching given selector in the root's subtree.
        queryAll(root, selector) {
            return Array.from(root.querySelectorAll(toTestSelector(selector)));
        },
    };
};

class CustomEnvironment extends PlaywrightEnvironment {

    async setup() {
        await super.setup();
        await playwright
            .selectors
            .register('testEl', createDataTestIdEngine)
            .catch((e) => {
                if (!e.toString().includes('has been already')) {
                    throw e;
                }
            });
    }

    async teardown() {
        await super.teardown();
    }

    async handleTestEvent(event) {
        if (event.name === 'test_done' && event.test.errors.length > 0) {
            const parentName = event.test.parent.name.replace(/\W/g, '-');
            const specName = event.test.name.replace(/\W/g, '-');
            const path = `screenshots/tutor/${parentName}_${specName}.png`;
            // eslint-disable-next-line no-console
            console.log(chalk.red(`writing screenshot to: ${path}`));
            await this.global.page.screenshot({ path });
        }
    }
}


module.exports = CustomEnvironment;
