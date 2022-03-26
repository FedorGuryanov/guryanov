import * as React from 'react'
import {FC, memo, useCallback, useEffect, useState} from 'react'
import './FieldsForm.scss'
import {useDispatch, useSelector} from 'react-redux';
import {getCurrentDataSelector, getSelectedSymbolSelector} from '../../store/formula/selectors';
import {FEATURES_MAP} from '../../data/mappings';
import {Input, Tooltip} from '@chakra-ui/react';
import {setDataAction, setViewDataAction} from '../../store/formula/actions';

const dataRes = require('../../data/dataRes.json');

export const formatNumber = (num: string) => {
    const val = Number(num ? String(num).replaceAll(' ', '') : num);
    return isNaN(val) ? num : val.toLocaleString('en-EN').split(',').join(' ');
};

const isErrorNum = (num: string | number) => {
    return Boolean(typeof num === 'string' && isNaN(Number(num.replaceAll(' ', ''))));
}

export const FieldForm: FC<{ usedKeys: string[], showOnlyUsed?: boolean }> = memo(
    ({usedKeys, showOnlyUsed}) => {
        const dispatch = useDispatch();
        const selSymbol = useSelector(getSelectedSymbolSelector);
        const [viewData, setViewData] = useState<any>({});
        const data = useSelector(getCurrentDataSelector);
        const keys = viewData ? Object.keys(viewData) : [];

        const selName = selSymbol ? dataRes[selSymbol]?.Name : null;

        useEffect(() => {
            if (data) {
                const vd: { [key: string]: string } = {...data};
                const keys = Object.keys(data);
                keys?.forEach((key) => {
                    vd[key] = formatNumber(vd[key]);
                });
                setViewData(vd);
            }
        }, [data, setViewData]);

        const updateValue = useCallback((value: string, key: string) => {
            const newViewData = {...viewData};
            newViewData[key] = value;
            setViewData(newViewData);
            dispatch(setDataAction({data: null}));
        }, [viewData, dispatch]);

        useEffect(() => {
            dispatch(setViewDataAction({data: viewData}));
        }, [viewData, dispatch]);
        // console.log('hi1');
        return (
            <>
                {selName ? <div className="FieldsForm__company"> This is data for {selName} ({selSymbol})</div> : null}
                <div className={'FieldsForm__wrapper' + (showOnlyUsed ? ' _used-only' : '')}>
                    {keys.map(key => (
                        <div className={'FieldsForm__input' + (usedKeys.includes(key) ? '' : ' _unused')} key={key}>
                            <Tooltip label={FEATURES_MAP[key].description} openDelay={500}>
                                <div className="FieldsForm__input-key">
                                    {key}
                                    <div className="FieldsForm__input-key-name">
                                        {FEATURES_MAP[key].name}
                                    </div>
                                </div>
                            </Tooltip>
                            <div
                                className={'FieldsForm__input-value' + (isErrorNum((viewData as any)[key]) ? ' _error' : '')}>
                                <Input
                                    variant="flushed"
                                    placeholder="Value"
                                    onChange={(e) => updateValue(e.currentTarget.value, key)}
                                    value={(viewData as any)[key]}
                                />
                            </div>
                        </div>
                    ))}
                </div>
            </>
        );
    }
);
