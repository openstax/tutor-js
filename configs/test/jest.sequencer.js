const Sequencer = require('@jest/test-sequencer').default;

class AssignmentSequencer extends Sequencer {
    sort(tests) {
        const copyTests = Array.from(tests)
        return copyTests.sort((testA, testB) => (
            testA.path.includes('assignment-grade') ? -1 : 1
        ))
    }
}

module.exports = AssignmentSequencer;
