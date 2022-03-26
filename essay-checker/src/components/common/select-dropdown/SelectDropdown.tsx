import React from 'react';
import './SelectDropdown.scss';

export interface EtSelectDropdownItem {
    id: string;
    text: string;
}

interface EtSelectDropdownProps {
    options: EtSelectDropdownItem[];
    selectedOption: number;
    placeholder: string
    selectOption: (unit: EtSelectDropdownItem, i: number) => void,
    disabled?: boolean;
}

function EtSelectDropdown(props: EtSelectDropdownProps) {
    const {options, selectedOption, placeholder, selectOption, disabled} = props;
    const [opened, setOpened] = React.useState(false);

    document.addEventListener('click', () => setOpened(false))
    return (
        <div className="et-select-dropdown">
            {
                (selectedOption < 0 || !options[selectedOption].id) ? (
                    <div className={'et-select-dropdown__value _empty' + (disabled ? ' _disabled' : '')}
                         onClick={() => setTimeout(() => !disabled && setOpened(true))}
                    >
                        {placeholder}
                    </div>
                ) : (
                    <div className={'et-select-dropdown__value' + (disabled ? ' _disabled' : '')}
                         onClick={() => setTimeout(() => !disabled && setOpened(true))}
                    >
                        {options[selectedOption].text}
                    </div>
                )
            }
            {
                opened && (
                    <div className="et-select-dropdown__list">
                        {
                            options.map((unit, i) =>
                                <div
                                    className={'et-select-dropdown__list-item ' + (i === selectedOption ? '_selected' : '')}
                                    key={unit.id}
                                    onClick={() => {
                                        selectOption(unit, i);
                                    }}
                                >
                                    {unit.text}
                                </div>
                            )
                        }
                    </div>
                )
            }
        </div>
    );
}

export default React.memo(EtSelectDropdown);
