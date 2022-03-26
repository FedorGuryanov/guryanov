import React, {useEffect, useRef} from "react";
import './SelectBox.scss';

function EtSelectBox(props) {
    const ref = useRef(null);
    const {options, selectedOption, caption, selectOption, disabled} = props;
    // const [state, setState] = React.useState({});
    const [opened, setOpened] = React.useState(false);

    useEffect(() => {
        if (opened && ref.current?.scrollIntoViewIfNeeded) {
            ref.current.scrollIntoViewIfNeeded();
        }
    }, [opened, ref]);
    document.addEventListener("click", () => setOpened(false))
    return (
        <div className="et-select-box" ref={ref}>
            <div className="et-select-box__caption">
                {caption}
            </div>
            {
                !opened && selectedOption < 0 && !disabled && (
                    <div className={"et-select-box__value _empty" + (disabled ? ' _disabled' : '')}
                         onClick={() => setTimeout(() => !disabled && setOpened(true))}
                    >
                        Выберите оценку
                    </div>
                )
            }
            {
                !opened && selectedOption >= 0 && (
                    <div className={"et-select-box__value" + (disabled ? ' _disabled' : '')}
                         onClick={() => setTimeout(() => !disabled && setOpened(true))}
                    >
                        <span
                            className={"et-select-box__value-main"}> {options[selectedOption].points + " - " + options[selectedOption].comment} </span>
                        {options[selectedOption].text}
                    </div>
                )
            }
            {
                opened && (
                    <div className="et-select-box__list">
                        {
                            options.map((unit, i) =>
                                <div
                                    className={"et-select-box__list-item " + (i === selectedOption ? "_selected" : "")}
                                    key={unit.points}
                                    onClick={() => {
                                        selectOption(unit, i);
                                    }}
                                >
                                    <span
                                        className={"et-select-box__value-main"}> {unit.points + " - " + unit.comment} </span>
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

export default React.memo(EtSelectBox);
