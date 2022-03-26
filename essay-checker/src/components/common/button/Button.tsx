import React from 'react';

import './Button.scss';

export type EtButtonProps = {
    onClick: () => void,
    text: string,
    disabled?: boolean,
    type: string,
}

const EtButton = ({text, type, disabled, onClick}: EtButtonProps) => {
    return (
        <button className={'et-button ' + (type === 'action' ? '_action' : '_normal') + (disabled ? ' _disabled' : '')}
                disabled={disabled}
                onClick={onClick}
        >
            {text}
        </button>
    );
}

export default React.memo(EtButton);
