const Factory = require('object-factory-bot');

module.exports = {
    resetState() {
        // no state, nothing to reset
    },

    setRole(){ },

    route(server) {
        server.post('/api/user/suggest', (req, res) => {
            return res.json({});
        });
    },

};
