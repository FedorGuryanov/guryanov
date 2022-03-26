const noteRoutes = require('./note_routes');
const worksRoutes = require('./works_routes');

module.exports = function(app, db) {
    // noteRoutes(app, db);
    worksRoutes(app, db);
};
