const Factory = require('object-factory-bot');
require('../../../specs/factories/book');

let ROLE = 'teacher';

module.exports = {
    resetState() {
        // no state is modified, so nothing to reset
    },

    setRole(role) {
        ROLE = role;
    },

    getPage(req, res) {
        res.json(Factory.create('Page'));
    },

    getHighlightSections(req, res) {
        res.json({pages: []});
    },

    getNotes(req, res) {
        res.json([]);
    },

    route(server) {
        server.get('/api/ecosystems/:ecosystemId/pages/:pageId', this.getPage);
        server.get('/api/books/:bookId/highlighted_sections', this.getHighlightSections);
        server.get('/api/pages/:pageId/notes', this.getNotes);
    },

};
