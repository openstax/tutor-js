const Factory = require('object-factory-bot');

module.exports = {

    handler(req, res) {
        return res.json( Factory.create('User') )
    },

};
