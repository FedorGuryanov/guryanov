import React, {useCallback, useEffect} from 'react';
import './TextBlock.scss';
import {getTextWords, textWordNotEmpty} from '../../helpers/text';
import EtButton from '../common/button/Button';
import EtSelectDropdown, {EtSelectDropdownItem} from '../common/select-dropdown/SelectDropdown';
import {THEMES_ARRAY} from '../../constants/themes';

const MAX_LEN = 3200;

export interface EtTextBlockProps {
    value?: string;
    themeId: string | null;
    id?: string;
    onCheck: (text: string, themeId: string | null) => void;
    onChange: (text: string, themeId: string | null) => void;
    disabled?: boolean;
}

function EtTextBlock(props: EtTextBlockProps) {
    const {onCheck, onChange} = props;
    const [state, setState] = React.useState('');
    const [themeId, setThemeId] = React.useState<string | null>(null);
    const [wordsCount, setWordsCount] = React.useState(0);
    const [selectedOption, setSelectedOption] = React.useState(-1);
    const onCheckClick = React.useCallback(
        () => onCheck(state, themeId),
        [onCheck, state, themeId],
    );

    useEffect(() => {
        onChange(state, themeId)
    }, [state, themeId, onChange]);

    const onChangeText = React.useCallback(
        (text: string) => {
            if (text.length < MAX_LEN) {
                setState(text);
            } else {
                setState(text.substring(0, MAX_LEN));
            }
        },
        [setState],
    );
    useEffect(() => {
        setWordsCount(getTextWords(props.value).filter(textWordNotEmpty).length);
    }, [props])

    useEffect(() => {
        setState(props.value || '');
        setThemeId(props.themeId || null);
        const foundTheme = THEMES_ARRAY.find((item) => item.id === props.themeId);
        if (foundTheme) {
            setSelectedOption(THEMES_ARRAY.indexOf(foundTheme));
        }
        // eslint-disable-next-line react-hooks/exhaustive-deps
    }, []);

    const onThemeSelect = useCallback((unit: EtSelectDropdownItem, i: number) => {
        setThemeId(unit.id);
        setSelectedOption(i);
    }, [setThemeId]);

    return (
        <div className="et-text-block">
            <div className="et-text-block__input">
                <textarea className="et-text-block__input-area" spellCheck={false} name={'Text1'} rows={12}
                          disabled={props.disabled}
                          value={state}
                          placeholder={'Введите текст'}
                          onChange={(event) => onChangeText(event.target.value)}
                />
            </div>
            <div className="et-text-block__count">{wordsCount + ' слов (200 - 250)'}</div>
            <div className="et-text-block__actions">
                <EtSelectDropdown selectedOption={selectedOption}
                                  placeholder="Выбрать тему"
                                  selectOption={onThemeSelect}
                                  options={THEMES_ARRAY}
                />
                <div className="et-text-block__actions-button">
                    <EtButton text="Начать проверку" disabled={!state || !props.id} onClick={onCheckClick} type="action"/>
                </div>
            </div>
        </div>
    );
}

export default React.memo(EtTextBlock);
