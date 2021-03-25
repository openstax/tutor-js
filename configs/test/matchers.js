import React from 'react';
import { get } from 'lodash';
import Renderer from 'react-test-renderer';

jasmine.addMatchers({
    toHaveRendered: function() {
        return {
            compare: function(wrapper, selector) {
                let matchCount, result;
                wrapper.update(); // needed bc enzyme stopped updating
                matchCount = wrapper.find(selector).length;
                result = {
                    pass: matchCount >= 1,
                };
                if (result.pass) {
                    result.message = function() {
                        return `${selector} was found`;
                    };
                } else {
                    result.message = function() {
                        return `Expected wrapper to contain \`${selector}\`, but it was not found`;
                    };
                }
                return result;
            },
        };
    },
});

expect.extend({
    toHaveChanged: function(fn, tests) {
        let expected, failures, i, j, k, len, len1, test, testValue, utils;
        failures = [];
        utils = this.utils;
        testValue = function(i, test, type, expected) {
            let actual, hint, name, pass;
            actual = get(test.object, test.property, typeof test.value === 'function' ? test.value() : void 0);
            if (typeof actual !== 'number') {
                actual = parseFloat(actual);
            }
            if (test.precision) {
                utils.ensureNumbers(actual, expected, `test index ${i}`);
                pass = Math.abs(expected - actual) < Math.pow(10, -test.precision) / 2;
                hint = utils.matcherHint('.toBeCloseTo');
            } else {
                pass = expected === actual;
                hint = utils.matcherHint('.toEqual');
            }
            name = test.property || i;
            if (!pass) {
                return failures.push(`${name}: ${type} ${hint}: ${utils.printExpected(expected)}, received ${utils.printReceived(actual)}`);
            }
        };
        for (i = j = 0, len = tests.length; j < len; i = ++j) {
            test = tests[i];
            testValue(i, test, 'from value', test.from);
        }
        fn();
        for (i = k = 0, len1 = tests.length; k < len1; i = ++k) {
            test = tests[i];
            expected = test.by != null ? test.from + test.by : test.to;
            testValue(i, test, 'changed value', expected);
        }
        if (failures.length) {
            return {
                pass: false,

                message: function() {
                    return failures.join('\n');
                },
            };
        } else {
            return {
                pass: true,

                message: function() {
                    return 'all matched';
                },
            };
        }
    },

    toBeEmptyRender(enzymeWrapper) {
        return {
            pass: enzymeWrapper.isEmptyRender(),
            message() { return `Found ${enzymeWrapper.html().substr(0, 100)} …`; },
        };
    },

});


global.expect.snapshot = (obj) => {
    let json;
    let reactEl;
    if (React.isValidElement(obj)) {
        reactEl = Renderer.create(obj);
        json = reactEl.toJSON();
    } else {
        json = obj;
    }
    const chain = global.expect(json);
    if (reactEl) {
        const tmss = chain.toMatchSnapshot;
        chain.toMatchSnapshot = function(...args) {
            const result = tmss.apply(this, args);
            reactEl.unmount();
            return result;
        };
    }
    return chain;

};
