import React, {useCallback, useEffect, useState} from 'react';
import './Check.scss';
import EtSelectBox from '../common/select-box/SelectBox';
import {EtPointOption, POINTS_ARRAY} from '../../constants/points';
import EtButton from '../common/button/Button';
import EtHeader from '../common/header/Header';
import {useDispatch, useSelector} from 'react-redux';
import {useHistory} from 'react-router-dom';
import {getEssayPendingSaveSelector, getEssaySelector} from '../../store/essay/selectors';
import {statusNavigate} from '../../helpers/redirect';
import {
    fetchEssayRequest,
    fetchEssaySuccess,
    updateCheckEssayRequest,
    updateEssayRequest
} from '../../store/essay/actions';
import {getTextWords, textWordNotEmpty} from '../../helpers/text';
import '@recogito/recogito-js/dist/recogito.min.css';
import {Essay} from '../../store/essay/types';
import {throttle} from 'lodash';
import {THEMES_TEXT_MAP} from '../../constants/themes';

const Recogito = require('@recogito/recogito-js');

const MIN_WORDS_COUNT = 180;
const MAX_WORDS_COUNT = 275;

interface EtCheckProps {
    match: {
        params: {
            id: string;
        }
    }
}

const checkFormatter = (annotation: any) => {
    if (annotation.bodies?.find((item: any) => item.purpose === 'tagging' && (item.value === 'auto' || item.value === 'mistake'))) {
        return '_is-auto';
    }
    if (annotation.bodies?.find((item: any) => item.purpose === 'tagging' && item.value === 'keyword')) {
        return '_is-key';
    }
    return '';
};

function EtCheck({match: {params: {id}}}: EtCheckProps) {
    const dispatch = useDispatch();
    const history = useHistory();

    const essay = useSelector(getEssaySelector);

    const pendingSave = useSelector(getEssayPendingSaveSelector);

    useEffect(() => {
        statusNavigate(essay, history);
    }, [essay, history]);

    useEffect(() => {
        dispatch(fetchEssayRequest({id}));
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    // const [units] = React.useState(UNITS_CONST);
    const [marks, setMarks] = React.useState(POINTS_ARRAY);
    const [total, setTotal] = React.useState(0);
    const [ready, setReady] = React.useState(false);
    const [readOnly, setReadOnly] = React.useState(false);
    const [recogito, setRecogito] = React.useState<typeof Recogito.Recogito>();

    useEffect(() => {
        if (!readOnly && recogito && essay?.status === 'closed') {
            recogito.destroy();
            console.log('Recogito Updated...');
            // @ts-ignore
            const r = new Recogito.Recogito({
                content: 'essay-content',
                readOnly: true,
                formatter: checkFormatter,
                editorAutoPosition: true,
                locale: 'it'
            });
            setReadOnly(true);
            setRecogito(r);
            if (essay.annotations) {
                r.setAnnotations(essay.annotations);
            }
        }
    }, [readOnly, setReadOnly, recogito, essay]);

    const resultsChange = useCallback((results: number[]) => {
        if (essay) {
            const newEssay = {...essay, results};
            dispatch(fetchEssaySuccess({essay: newEssay}));
            dispatch(updateEssayRequest(newEssay));
        }
    }, [dispatch, essay]);

    const annotationsChange = useCallback(() => {
        if (essay && recogito) {
            const newEssay = {...essay, annotations: recogito.getAnnotations()};
            dispatch(updateEssayRequest(newEssay));
        }
    }, [dispatch, essay, recogito]);

    useEffect(() => {
        if (essay && essay.status === 'ready') {
            const newEssay: Essay = {...essay, status: 'checked'};
            dispatch(updateCheckEssayRequest(newEssay));
        }
    }, [dispatch, essay]);


    const finishClick = useCallback(() => {
        if (essay) {
            const newEssay: Essay = {...essay, status: 'closed'};
            dispatch(updateEssayRequest(newEssay));
        }
    }, [dispatch, essay]);

    const selectOptionCallback = useCallback((i: number, unit, selectedI: number) => {
        const newResults = [...(essay?.results || new Array(POINTS_ARRAY.length).fill(-1))];
        newResults[i] = selectedI;
        if (i === 0) {
            if (selectedI === 0) {
                let newMarks = JSON.parse(JSON.stringify(marks));
                for (let j = 1; j < newMarks.length; j++) {
                    newMarks[j].options = [newMarks[j].options[0]];
                    newResults[j] = 0;
                }
                setMarks(newMarks);
            } else {
                setMarks(POINTS_ARRAY);
            }
        }
        resultsChange(newResults);
    }, [essay, marks, resultsChange]);

    useEffect(() => {
        const count = essay?.text ? essay?.text.split(/\s/).filter((item: string) => !!item).length : 0;
        if (count > 0 && count < MIN_WORDS_COUNT && essay?.results?.[0] !== 0) {
            selectOptionCallback(0, marks[0].options[0], 0);
        }
    }, [essay, marks, selectOptionCallback]);

    useEffect(() => {
        if (essay?.text && essay?.status !== 'ready' && !recogito) {
            console.log('Recogito Initialized');
            const ro = essay?.status === 'closed';
            // @ts-ignore
            const r = new Recogito.Recogito({
                content: 'essay-content',
                readOnly: ro,
                formatter: checkFormatter,
                editorAutoPosition: true,
                locale: 'it'
            });
            setReadOnly(ro);
            setRecogito(r);
            if (essay.annotations) {
                r.setAnnotations(essay.annotations);
            }
        }
    }, [essay, recogito])

    useEffect(() => {
        if (recogito) {
            recogito.off('deleteAnnotation');
            recogito.off('createAnnotation');
            recogito.off('updateAnnotation');

            recogito.on('deleteAnnotation', annotationsChange);
            recogito.on('createAnnotation', annotationsChange);
            recogito.on('updateAnnotation', annotationsChange);
        }
    }, [recogito, annotationsChange]);

    useEffect(() => {
        // @ts-ignore
        window['recogit'] = recogito;
    }, [recogito]);

    useEffect(() => {
        let points = 0;
        let ok = !!essay?.results;
        (essay?.results || new Array(POINTS_ARRAY.length).fill(-1)).forEach((item, i) => {
            if (item >= 0) {
                points += marks[i].options[item].points;
            } else {
                ok = false;
            }
        });
        setReady(ok);
        setTotal(points);
    }, [essay, marks]);

    const words = getTextWords(essay?.text);
    const wordsCount = words.filter(textWordNotEmpty).length;
    let mainText = essay?.text || '';
    let extraText = null;
    if (wordsCount > MAX_WORDS_COUNT) {
        let n = MAX_WORDS_COUNT;
        const extraWords: string[] = [];
        words.forEach((item) => {
            if (n <= 0) {
                extraWords.push(item);
            } else if (textWordNotEmpty(item)) {
                n--;
            }
        });
        const extraLength = extraWords.join(' ').length;
        extraText = mainText.substring(mainText.length - extraLength);
        mainText = mainText.substring(0, mainText.length - extraLength) || '';
    }

    const mainTextSplit = mainText.split('\n');

    const [scrollVal, setScrollVal] = useState(0);
    const style = {'--current-scroll': scrollVal + 'px'} as React.CSSProperties;

    // Because of bug with scroll to focused element in safari
    // eslint-disable-next-line react-hooks/exhaustive-deps
    const onScrollCall = useCallback(throttle((e) => {
        setScrollVal((e.target as HTMLElement).scrollTop);
    }, 200), [setScrollVal]);
    // @ts-ignore
    return (
        essay ? <div className="et-text-popup">
            <EtHeader content={ready ?
                (<span
                    className="et-text-popup__header-text"> ЭССЕ НА <b>{total}</b> {total === 1 ? 'БАЛЛ' : (total === 0 || total > 4 ? 'БАЛЛОВ' : 'БАЛЛА')} </span>) :
                (<span className="et-text-popup__header-text"> ОЦЕНИТЕ ВСЕ КРИТЕРИИ </span>)
            }/>
            <div className="et-text-popup__content">
                <div className="et-text-popup__left" style={style} onScroll={onScrollCall}>
                    <div className={'et-text-popup__left-inner' + (pendingSave && essay.status === 'ready' ? ' _checking' : '')}>
                        <div className="et-text-popup__user-hint">
                            Выделите слово или фразу в тексте, чтобы оставить комментарий <span aria-label="✏️"
                                                                                                style={
                                                                                                    {
                                                                                                        fontFamily: '\'Apple Color Emoji\',\'Segoe UI Emoji\', NotoColorEmoji,\'Noto Color Emoji\',\'Segoe UI Symbol\',\'Android Emoji\',EmojiSymbols',
                                                                                                        lineHeight: '1em'
                                                                                                    }
                                                                                                }>✏️</span>
                        </div>
                        <div id="essay-content">
                            {
                                mainTextSplit.map((part: string, i: number) =>
                                    <div className="et-text-popup__text-part" key={i}>
                                        {
                                            part !== '' ? <>
                                                <p> {part}  </p>
                                                {mainTextSplit.length > (i + 1) ?
                                                    <span className="_hidden">{'.'}</span> : null}
                                            </> : (mainTextSplit.length > (i + 1) ?
                                                <span className="_hidden _empty">{'.'}</span> : null)
                                        }
                                    </div>
                                )
                            }
                            {
                                extraText && (
                                    <div className="et-text-popup__text-extra">
                                        <div className="et-text-popup__text-extra-top">
                                        </div>
                                        <div className="et-text-popup__text-extra-inner">
                                            {
                                                extraText.split('\n').map((part: string, i: number) =>
                                                    <div className="et-text-popup__text-part" key={i}>
                                                        {
                                                            part !== '' ? <>
                                                                <p> {part}  </p>
                                                                <span className="_hidden">{'.'}</span>
                                                            </> : <span className="_hidden _empty">{'.'}</span>
                                                        }
                                                    </div>
                                                )
                                            }
                                        </div>
                                    </div>
                                )
                            }
                        </div>
                    </div>
                    <div className="et-text-popup__left-right"/>
                </div>
                <div className="et-text-popup__right">
                    <div className="et-text-popup__right-inner">
                        <div className="et-text-popup__info">
                            Количество слов: <b>{wordsCount}</b> <br/>
                            <i>Требуемый объём - 200-250 слов</i>
                        </div>
                        {
                            wordsCount > MAX_WORDS_COUNT && (
                                <div className="et-text-popup__warning">
                                    Количество слов больше {MAX_WORDS_COUNT} <br/> Часть текста не будет учитываться при
                                    проверке!
                                </div>)
                        }
                        {
                            wordsCount < MIN_WORDS_COUNT && (
                                <div className="et-text-popup__warning">
                                    Количество слов меньше {MIN_WORDS_COUNT} <br/> Эссе проверяться не будет!
                                </div>)
                        }
                        {
                            wordsCount >= MIN_WORDS_COUNT && (marks.map((mark, i) =>
                                <div className="et-text-popup__mark" key={mark.id}>
                                    <EtSelectBox options={mark.options}
                                                 caption={mark.caption}
                                                 disabled={readOnly}
                                                 selectedOption={essay?.results ? essay.results[i] : -1}
                                                 selectOption={(unit: EtPointOption, selectedI: number) => selectOptionCallback(i, unit, selectedI)}>
                                    </EtSelectBox>
                                </div>
                            ))
                        }

                        <div className="et-text-popup__result">
                            РЕЗУЛЬТАТ:
                            <span className="et-text-popup__result-value">
                            {total}
                        </span>
                            из 14
                        </div>
                        {
                            readOnly ? null :
                                <EtButton text="Завершить проверку" disabled={!ready} onClick={finishClick} type={''}/>
                        }
                        <div className="et-text-popup__note">
                            <i>
                                При получении экзаменуемым 0 баллов по критерию «Решение коммуникативной задачи» ответ
                                на
                                задание оценивается в 0 баллов по всем критериям оценивания выполнения этого задания.
                            </i>
                        </div>
                    </div>
                    {essay.themeId && THEMES_TEXT_MAP[essay.themeId] ? <div className="et-text-popup__theme">
                        <div className="et-text-popup__right-inner">
                            <div className="et-text-popup__theme-title">
                                Задание
                            </div>
                            <div dangerouslySetInnerHTML={{__html: THEMES_TEXT_MAP[essay.themeId].start}}/>
                            <img className="et-text-popup__theme-img"
                                 alt="Statistics for the task"
                                 src={'/images/' + essay.themeId + '.png'}
                            />
                            <div dangerouslySetInnerHTML={{__html: THEMES_TEXT_MAP[essay.themeId].end}}/>
                        </div>
                    </div> : null}
                </div>
            </div>
        </div> : null
    );
}

export default React.memo(EtCheck);
