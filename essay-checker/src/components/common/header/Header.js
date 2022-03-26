import React, {useCallback, useEffect, useRef, useState} from 'react';
import './Header.scss';
import LoadingBar from "react-top-loading-bar";
import {useDispatch, useSelector} from "react-redux";
import {getEssayPendingFetchSelector, getEssayPendingSaveSelector} from "../../../store/essay/selectors";
import {useHistory} from "react-router-dom";
import {ReactComponent as InstaIcon} from './instagram.svg';
import {ReactComponent as MailIcon} from './mail.svg';
import {ReactComponent as ShareIcon} from './send.svg';
import {clearCurrentEssay} from "../../../store/essay/actions";

function EtHeader(props) {
    const history = useHistory();
    const dispatch = useDispatch();

    const {content} = props;
    const ref = useRef(null);
    const pendingFetch = useSelector(getEssayPendingFetchSelector);
    const pendingSave = useSelector(getEssayPendingSaveSelector);

    const [copyMessageShow, setCopyMessageShow] = useState(false);
    const [loading, setLoading] = useState(false);

    const onClick = useCallback(() => {
        dispatch(clearCurrentEssay());
        history.push('/');
        window.location.reload();
    }, [history, dispatch]);

    const onCopySuccess = useCallback(() => {
        setCopyMessageShow(true);
        setTimeout(() => {
            setCopyMessageShow(false);
        }, 2000);
    }, [setCopyMessageShow]);

    useEffect(() => {
        const newLoading = pendingFetch || pendingSave;
        if (newLoading !== loading && ref?.current) {
            setLoading(newLoading);
            if (newLoading) {
                ref.current.continuousStart(25, 100);
            } else {
                ref.current.complete();
            }
        }
    }, [ref, pendingFetch, pendingSave, props, loading]);

    const onShare = useCallback(() => {
        const text = window.location.href.split('#')[0];

        try {
            const dummy = document.createElement('input');
            document.body.appendChild(dummy);
            dummy.value = text;
            dummy.select();
            if (navigator?.clipboard?.writeText) {
                navigator.clipboard.writeText(text);
            } else {
                document.execCommand('copy');
            }
            document.body.removeChild(dummy);
            onCopySuccess();
        } catch (e) {
            // ignore unknown error
        }

        if (navigator?.share) {
            navigator.share({title: 'Проверка эссе', text});
        }
    }, [onCopySuccess]);

    return (
        <>
            <div className="et-header__placeholder"/>
            <div className="et-header">
                <div className="et-header__inner">
                    <div className="et-header-logo" onClick={onClick} title="На главную"/>
                    <div className="et-header__content">
                        {content || null}
                        <div className="et-header__right">
                            <div className="et-header__right-inner">
                                <div className="et-header__right-item" title="Поделиться ссылкой" onClick={onShare}>
                                    <ShareIcon/>
                                </div>
                                <a className="et-header__right-item" href="mailto:info@essaychecker.ru"
                                   title="Обратная связь">
                                    <MailIcon/>
                                </a>
                                <a className="et-header__right-item"
                                   title="Наш инстаграм"
                                   href="https://www.instagram.com/essaychecker.ru/"
                                   rel="noreferrer" target="_blank">
                                    <InstaIcon/>
                                </a>
                            </div>
                        </div>
                    </div>
                </div>
                <LoadingBar className="et-header__loading" color={'#FEDD00'} height={3} transitionTime={100} ref={ref}/>
                <div className={'et-header__info' + (copyMessageShow ? ' _show' : '')}>
                    <div className="et-header__info-inner">
                        Ссылка скопирована в буфер обмена
                    </div>
                </div>
            </div>
        </>
    )
        ;
}

export default React.memo(EtHeader);
