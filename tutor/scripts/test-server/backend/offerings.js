const Factory = require('object-factory-bot');
require('../../../specs/factories/offering');

const teacher = {
    total_count: 4,
    items: [
        'biology', 'physics', 'sociology', 'apush',
    ].map((type) => Factory.create('Offering', { type })),
};

const student = { total_count: 0, items: [] };

let ROLE = 'teacher';

const PAYLOADS = {
    student, teacher,
};

module.exports = {
    resetState() {
        // no state is modified, so nothing to reset
    },

    setRole(role) {
        ROLE = role;
    },

    handler(req, res) {
        res.json(PAYLOADS[ROLE]);
    },

};
