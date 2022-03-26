import React from 'react';
import './Points.scss';

import { ReactComponent as OfficialIcon } from './avocado_copy.svg';
import { ReactComponent as CommentsIcon } from './avocado_discuss.svg';
import { ReactComponent as SuccessIcon } from './avocado_succeed.svg';

function EtPagePoints() {
    return (
        <div className="et-page-points">
            <div className="et-page-points__item">
                <OfficialIcon/>
                <div className="et-page-points__item-title">
                    Официальные критерии оценивания рядом&nbsp;с&nbsp;текстом
                </div>
                <div className="et-page-points__item-text">
                    Оценивайте эссе как&nbsp;экзаменатор
                </div>
            </div>
            <div className="et-page-points__item">
                <CommentsIcon/>
                <div className="et-page-points__item-title">
                    Добавляйте комментарии к&nbsp;фрагментам текста
                </div>
                <div className="et-page-points__item-text">
                    Укажите ученикам на проблемные&nbsp;места
                </div>
            </div>
            <div className="et-page-points__item">
                <SuccessIcon/>
                <div className="et-page-points__item-title">
                    Качественный фидбек для&nbsp;учеников
                </div>
                <div className="et-page-points__item-text">
                    Делитесь ссылкой на оценённую работу
                </div>
            </div>
        </div>
    );
}

export default React.memo(EtPagePoints);
