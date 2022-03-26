const WORDS_LIST = "thus, for example, for instance, namely, to illustrate, in particular, specifically, such as, on the contrary, contrarily, notwithstanding, but, however, nevertheless, in spite of, despite, in contrast, yet, on one hand, on the other hand, rather, or, nor, conversely, although, though, even though, in addition, furthermore, moreover, besides, also, first, firstly, second, secondly, what is more, finally, last but not least, as well as, likewise, similarly, in fact, as a result, consequently, in the same way, however, on the other hand, on the one hand, therefore, otherwise, besides, at the same time, subsequently, eventually, still, above all, truly, of course, certainly, surely, in fact, particularly, namely, including, specifically, especially, as far as I am concerned, in my opinion, in my view, to my mind, from where I stand, to illustrate, in other words, so that, as a result, hence, according to, accordingly, for this reason, this is why, so, because, due to, undoubtedly, it should be noted, clearly, without doubt, in addition to this, apart from, unlike, whereas, while, nonetheless, first and foremost, additionally, along with, on the contrary, in conclusion, to conclude, personally, to sum up, I believe, I strongly believe, I am absolutely sure, I am absolutely certain, from my point of view, it seems to me that, one reason for, another reason for, it is widely known that, it is common knowledge that, lastly, in order to, so as to, in general, on the whole, all in all, overall, by and large, in brief, generally speaking, frankly speaking, to be honest, honestly, all things considered, as a rule, basically, in a way, to some extent, as long as, provided that, providing that, to begin with, unless, in case, to put it simply, to put it briefly, coupled with, indeed, as a matter of fact, for that matter, with this in mind, as noted, to summarise, to summarize";

const listOfWords = WORDS_LIST.split(', ');
const WORDS = listOfWords.filter((item, pos) => listOfWords.indexOf(item) === pos);

function getIndicesOf(searchStr, str) {
    const searchStrLen = searchStr.length;
    if (searchStrLen === 0) {
        return [];
    }
    let startIndex = 0, index, indices = [];
    while ((index = str.indexOf(searchStr, startIndex)) > -1) {
        indices.push(index);
        startIndex = index + searchStrLen;
    }
    return indices;
}

module.exports = function (text, annotations) {
    let i = 0;
    const body = [{
        purpose: 'commenting',
        type: 'TextualBody',
        value: 'Проверьте, правильно ли используется связующий оборот. Удалите тэг keyword, если оборот используется неправильно.'
    }, {
        purpose: 'tagging',
        type: 'TextualBody',
        value: 'keyword'
    }];
    WORDS.forEach((word) => {
        var regex = new RegExp(`([^\\w]${word}[^\\w])|(^${word}[^\\w])|([^\\w]${word}$)|(^${word}$)`, "gi");
        let result;
        let indices = [];
        while ((result = regex.exec(text))) {
            indices.push(result.index);
        }
        // const indicies = getIndicesOf(word, textLower);
        const len = word.length;
        if (indices.length && len) {
            indices.forEach((start) => {
                i++;
                start = start + 1;
                const end = start + len;
                annotations.push({
                    '@context': 'http://www.w3.org/ns/anno.jsonld',
                    body,
                    id: 'w' + i,
                    type: 'Annotation',
                    target: {
                        selector: [{
                            exact: text.substring(start, end),
                            type: 'TextQuoteSelector'
                        }, {
                            type: 'TextPositionSelector',
                            start,
                            end
                        }]
                    }
                });
            });
        }
    });
}
