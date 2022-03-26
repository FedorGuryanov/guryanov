import React, {useCallback, useEffect, useMemo, useState} from 'react';
import './Page.scss';
import EtTextBlock from '../text-block/TextBlock';
import {useHistory} from 'react-router-dom';
import EtHeader from '../common/header/Header';
import debounce from 'lodash/debounce';
import {useDispatch, useSelector} from 'react-redux';
import {
    getEssayIdSelector,
    getEssayPendingFetchSelector,
    getEssayPendingSaveSelector,
    getEssaySelector
} from '../../store/essay/selectors';
import {createEssayRequest, fetchEssayRequest, updateEssayRequest} from '../../store/essay/actions';
import {statusNavigate} from '../../helpers/redirect';
import EtLink from '../common/link/Link';
import EtPagePoints from './points/Points';
import {ReactComponent as PointIcon} from './avocado-ask.svg';
import {ReactComponent as DonutIcon} from './avocado_indulge.svg';
import EtFooter from '../common/footer/Footer';
import {THEMES_TEXT_MAP} from '../../constants/themes';

interface EtPageProps {
    match: {
        params: {
            id?: string;
        }
    }
}

function EtPage({match: {params: {id}}}: EtPageProps) {
    const dispatch = useDispatch();
    const history = useHistory();

    const [freshStart, setFreshStart] = useState(true);
    const [createdId, setCreatedId] = useState('');
    const [selectedThemeId, setSelectedThemeId] = useState<string | null>(null);

    const createdIdState = useSelector(getEssayIdSelector);
    const pendingFetch = useSelector(getEssayPendingFetchSelector);
    const pendingSave = useSelector(getEssayPendingSaveSelector);
    const essayFetch = useSelector(getEssaySelector);

    useEffect(() => {
        statusNavigate(essayFetch, history);
        setSelectedThemeId(essayFetch?.themeId || null);
    }, [essayFetch, history]);

    useEffect(() => {
        if (createdId) {
            history.replace('/' + createdId);
        }
    }, [history, createdId]);

    useEffect(() => {
        if (id) {
            setFreshStart(false);
            dispatch(fetchEssayRequest({id}));
        } else {
            setFreshStart(true);
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    useEffect(() => {
        setCreatedId(createdIdState || '');
        if (createdIdState) {
            dispatch(fetchEssayRequest({id: createdIdState}));
        }
    }, [dispatch, createdIdState, setCreatedId]);

    const saveHandler = useCallback((text: string, themeId: string, id?: string) => {
        if (!id) {
            dispatch(createEssayRequest({text, themeId}));
        } else {
            if (essayFetch) {
                dispatch(updateEssayRequest({...essayFetch, text, themeId}));
            }
        }
    }, [dispatch, essayFetch]);

    const debouncedSaveHandler = useMemo(
        () => debounce(saveHandler, 1000)
        , [saveHandler]);

    const onChangeSaveHandler = useCallback(
        (text: string, themeId: string, id?: string) => {
            debouncedSaveHandler(text, themeId, id);
        }
        , [debouncedSaveHandler]);

    const onCheck = useCallback(
        (text, themeId) => {
            // setResults(POINTS_RESULT);
            if (essayFetch) {
                debouncedSaveHandler.cancel();
                dispatch(updateEssayRequest({...essayFetch, text, themeId, status: 'ready'}));
            }
        },
        [dispatch, essayFetch, debouncedSaveHandler],
    );

    const onChange = useCallback(
        (text, themeId) => {
            setSelectedThemeId(themeId);
            onChangeSaveHandler(text, themeId, id || createdId);
        },
        [id, createdId, onChangeSaveHandler],
    );
    return (
        <div className="et-page__wrapper">
            <EtHeader loading={pendingFetch || pendingSave}/>
            <div className="et-page">
                <div className="et-page__instructions">
                    Правописание&nbsp;+&nbsp;оценка&nbsp;по&nbsp;критериям.
                    Ваша&nbsp;возможность стать&nbsp;экспертом&nbsp;ЕГЭ&nbsp;<span aria-label="💪🏻"
                                                                                   style={
                                                                                       {
                                                                                           fontFamily: '\'Apple Color Emoji\',\'Segoe UI Emoji\', NotoColorEmoji,\'Noto Color Emoji\',\'Segoe UI Symbol\',\'Android Emoji\',EmojiSymbols',
                                                                                           lineHeight: '1em'
                                                                                       }
                                                                                   }>💪🏻</span>
                    <br/>
                    <EtLink href="#howto" text="Как это работает?"/>
                </div>
                {(pendingFetch && !freshStart) || (!freshStart && !essayFetch) ?
                    <div className="et-page__text-block-place"/> :
                    <EtTextBlock value={essayFetch?.text || ''}
                                 themeId={essayFetch?.themeId || null}
                                 onCheck={onCheck}
                                 onChange={onChange}
                                 id={id}
                    />
                }
            </div>
            <div className="et-page__wrapper _white">
                {selectedThemeId && THEMES_TEXT_MAP[selectedThemeId] ? <div className="et-page">
                    <div className="et-page__theme">
                        <div className="et-page__block-title">
                            Задание
                        </div>
                        <div dangerouslySetInnerHTML={{__html: THEMES_TEXT_MAP[selectedThemeId].start}}/>
                        <img className="et-page__theme-img"
                             alt="Statistics for the task"
                             src={'/images/' + selectedThemeId + '.png'}
                        />
                        <div dangerouslySetInnerHTML={{__html: THEMES_TEXT_MAP[selectedThemeId].end}}/>
                    </div>
                </div> : null}
            </div>
            <div className="et-page__wrapper _pic1">
                <div className="et-page">
                    <div className="et-page__inner _paddings">
                        <div className="et-page__block-text-left">
                            <div className="et-page__block-title">
                                Делаем жизнь учителя проще
                            </div>
                            <b>essaychecker.ru</b> — это сервис для проверки эссе (задание 40) по английскому в формате
                            ЕГЭ.
                            Мы упрощаем жизнь учителя, помогая повысить эффективность и качество проверки письменного
                            задания.
                            Ваша оценка больше не будет примерной — все критерии у вас перед глазами в удобном формате.
                            Вы также можете отправить ссылку на проверенную работу ученику, чтобы разобрать ошибки.
                        </div>
                    </div>
                </div>
            </div>
            <div className="et-page">
                <div className="et-page__points">
                    <div className="et-page__block-title">
                        Проверяйте как эксперт
                    </div>
                    <EtPagePoints/>
                </div>
                <div className="et-page__howto">
                    <div id="howto"/>
                    <div className="et-page__block-title">
                        Как это работает <span className="et-page__block-title-pic"><PointIcon/></span>
                    </div>
                    <ul className="et-page__block-text _list">
                        <li className="et-page__block-text-point">
                            Добавьте текст в форму и нажмите «Начать&nbsp;проверку»
                        </li>
                        <li className="et-page__block-text-point">
                            Работе присваивается уникальная ссылка. Вы можете вернуться к проверке позже или отправить
                            ссылку с&nbsp;проверенной работой ученику
                        </li>
                        <li className="et-page__block-text-point">
                            При проверке вы можете выделять и комментировать ошибки в тексте
                        </li>
                        <li className="et-page__block-text-point">
                            Оцените работу по критериям ЕГЭ — выберите баллы в каждом пункте.
                            Нажмите&nbsp;«Завершить&nbsp;проверку»
                        </li>
                        <li className="et-page__block-text-point">
                            Результат проверки будет храниться на сайте 30 дней. Сохраните ссылку на работу, если
                            планируете к&nbsp;ней&nbsp;вернуться
                        </li>
                    </ul>
                </div>
            </div>
            <div className="et-page__wrapper _white">
                <div className="et-page">
                    <div className="et-page__inner">
                        <div className="et-page__block-title">
                            Поддержите нас <span className="et-page__block-title-pic"><DonutIcon/></span>
                        </div>
                        Сервисом можно пользоваться бесплатно.
                        <br/>
                        Но нам всё равно нужны деньги на аренду сервера и развитие платформы.
                        <br/>
                        Вы можете поддержать нас рублём:
                        <br/><br/>
                        <b className="_small">Введите сумму, которую хотите пожертвовать, и выберите способ оплаты в
                            форме ниже</b>
                        <div className="et-page__donate">
                            <iframe title="Форма для донатов"
                                    src="https://yoomoney.ru/quickpay/shop-widget?writer=seller&targets=%D0%9D%D0%B0%20%D1%80%D0%B0%D0%B7%D0%B2%D0%B8%D1%82%D0%B8%D0%B5%20%D0%BF%D1%80%D0%BE%D0%B5%D0%BA%D1%82%D0%B0%20essaychecker.ru&targets-hint=&default-sum=200&button-text=11&payment-type-choice=on&mobile-payment-type-choice=on&hint=&successURL=https%3A%2F%2Fessaychecker.ru%3Fthanks%3D1&quickpay=shop&account=4100117326158486&"
                                    width="100%" height="222" frameBorder="0" allowTransparency scrolling="no"></iframe>
                        </div>
                    </div>
                </div>
            </div>
            <EtFooter/>
        </div>
    );
}

export default React.memo(EtPage);
