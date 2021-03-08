require('../../../specs/factories/book');
const GUIDE = require('../../../api/courses/1/guide.json');

let ROLE = 'teacher';


module.exports = {
    resetState() {
        // no state is modified, so nothing to reset
    },

    setRole(role) {
        ROLE = role;
    },

    handler(req, res) {
        return res.json(GUIDE);
    },

};
