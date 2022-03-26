import React from 'react';
import './Footer.scss';

function EtFooter() {
    return (
        <div className="et-footer">
            Остались вопросы? Напишите нам на <a href="mailto:info@essaychecker.ru">info@essaychecker.ru</a>
            <br/>
            Изображения предоставлены <a href="https://www.toicon.com/series/avocado" rel="noreferrer" target="_blank">
            toicon.com
        </a>
            <br/>
            Разработка: Фёдор Гурьянов | <a href="https://www.producthunt.com/@fedorguryanov" rel="noreferrer" target="_blank">
            Product Hunt
        </a>
            <br/>
            © Essay Checker | 2021
        </div>
    );
}

export default React.memo(EtFooter);
