var ObjectId = require('mongodb').ObjectId;

module.exports = function (app, db) {
    app.post('/notes', (req, res) => {
        console.log(req.body);
        // Здесь будем создавать заметку.
        db.collection('notes').insert(req.body, (err, results) => {
            console.log('err: ', err);
            console.log('results: ', results);
            console.log('id: ', results.insertedIds['0'].toString());
            res.send('Hello');
        });
    });

    app.get('/notes/:id', (req, res) => {
        const id = req.params.id;
        const details = { '_id': new ObjectId(id) };
        db.collection('notes').findOne(details, (err, item) => {
            if (err) {
            res.send({'error':'An error has occurred'});
        } else {
            res.send(item);
        }
        });
    });
};
