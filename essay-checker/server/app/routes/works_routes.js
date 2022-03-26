const ObjectId = require('mongodb').ObjectId;
const axios = require('axios');
const keyWords = require('./helpers/keyWords');

const okWords = ['zetland'];

const trimText = (text) => {
    return text?.split('\n').map((part) => part.trim()).join('\n')
}

module.exports = function (app, db) {
    app.post('/api/works', (req, res) => {
        if (!(req.body?.essay?.text || req.body?.essay?.themeId) || req.body.essay.text.length > 6000) {
            res.send({error: 'An error has occurred'});
            return;
        }
        // Создаём объект эссе
        const essay = {
            text: trimText(req.body.essay.text),
            themeId: req.body.essay.themeId,
            status: 'open',
            date: Date.now()
        }
        db.collection('works').insert(essay, (err, results) => {
            console.log('Created work id: ', results.insertedIds['0'].toString());
            if (results && results.insertedIds['0']) {
                res.send({id: results.insertedIds['0'].toString()});
            } else {
                res.send({error: 'An error has occurred'});
            }
        });
    });

    app.get('/api/works/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectId(id)};
        db.collection('works').findOne(details, (err, item) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send(item);
            }
        });
    });

    app.put('/api/works/check/:id', async (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectId(id)};
        const essay = {
            text: trimText(req.body.essay.text),
            themeId: req.body.essay.themeId,
            status: req.body.essay.status,
            // errors: req.body.essay.errors,
            results: req.body.essay.results,
            annotations: req.body.essay.annotations || []
        };
        const response = await axios.get('http://localhost:8081/v2/check?language=en-US&text=' + encodeURIComponent(essay.text)).catch((error) => {
            return {};
        });
        response.data?.matches?.forEach((item, i) => {
            const start = item.offset;
            const end = start + item.length;
            const body = [{
                purpose: 'commenting',
                type: 'TextualBody',
                value: item.message
            }];
            if (item.replacements?.length) {
                body.push({
                    purpose: 'commenting',
                    type: 'TextualBody',
                    value: (item.replacements?.length > 1 ? 'Replacements: ' : 'Replacement: ') +
                        item.replacements.map((replacement) => '"' + replacement.value + '"').join(', ')
                });
            }
            body.push({
                purpose: 'tagging',
                type: 'TextualBody',
                value: 'mistake'
            });
            const exact = essay.text.substring(start, end);
            if (!okWords.includes(exact.toLowerCase()) &&
                !item.message.includes('British English') &&
                !item.message.includes('Often, this adverbial phrase is redundant.')) {
                essay.annotations.push({
                    '@context': 'http://www.w3.org/ns/anno.jsonld',
                    body,
                    id: 'a' + i,
                    type: 'Annotation',
                    target: {
                        selector: [{
                            exact,
                            type: 'TextQuoteSelector'
                        }, {
                            type: 'TextPositionSelector',
                            start,
                            end
                        }]
                    }
                });
            }
        });
        keyWords(essay.text, essay.annotations);
        // console.log("UPD: ", essay);
        // console.log(response.data.explanation);
        db.collection('works').updateOne(details, {$set: essay}, (err, result) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send({...essay, date: req.body.essay.date});
            }
        });
    });

    app.put('/api/works/:id', (req, res) => {
        const id = req.params.id;
        const details = {'_id': new ObjectId(id)};
        const essay = {
            text: trimText(req.body.essay.text),
            themeId: req.body.essay.themeId,
            status: req.body.essay.status,
            // errors: req.body.essay.errors,
            results: req.body.essay.results,
            annotations: req.body.essay.annotations
        };
        // console.log("UPD: ", essay);
        db.collection('works').updateOne(details, {$set: essay}, (err, result) => {
            if (err) {
                res.send({'error': 'An error has occurred'});
            } else {
                res.send({...essay, date: req.body.essay.date});
            }
        });
    });
};
