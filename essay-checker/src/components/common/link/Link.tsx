import React from 'react';

import './Link.scss';

export type EtLinkProps = {
    text: string,
    href?: string,
}

const EtLink = ({text, href}: EtLinkProps) => {
    return (
        <a className="et-link" href={href}>
            {text}
        </a>
    );
}

export default React.memo(EtLink);
