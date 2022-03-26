import * as React from 'react'
import {ChangeEvent, FC, memo, useCallback, useMemo, useState} from 'react'
import './StocksList.scss'
import {Input, Link, Tooltip} from '@chakra-ui/react';
import {ExternalLinkIcon} from '@chakra-ui/icons'
import {useDispatch, useSelector} from 'react-redux';
import {getSelectedSymbolSelector} from '../../store/formula/selectors';
import {setDataAction} from '../../store/formula/actions';
import {formatNumber} from '../FieldsForm/FieldsForm';

const dataRes = require('../../data/dataRes.json');

export const getValueComp = (value: number, listValues: number[], higher?: boolean): number => {
    if (higher) {
        return listValues.findIndex((val) => (val <= value)) * 150 / listValues.length;
    } else {
        return listValues.findIndex((val) => (val >= value)) * 150 / listValues.length;
    }
}

export const StocksList: FC<{ compArray: { key: string, value?: number }[], listValues: number[], higher?: boolean }> = memo(
    ({compArray, listValues, higher}) => {
        const dispatch = useDispatch();
        const selSymbol = useSelector(getSelectedSymbolSelector);
        const [search, setSearch] = useState('');

        const setData = useCallback((symbol: string) => {
            dispatch(setDataAction({data: dataRes[symbol].data, symbol}))
        }, [dispatch]);

        const colors = useMemo(() => {
            return compArray.map((item) => getValueComp(item.value || 0, listValues, higher))
        }, [compArray, listValues, higher]);

        const onSearchInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
            if (event.currentTarget) {
                setSearch(event.currentTarget.value);
            }
        }, [setSearch]);

        // console.log('hi2');
        return (
            <div className="StocksList__wrapper">
                <div className="StocksList__caption">
                    List of 100 largest American companies
                    <Link href="https://companiesmarketcap.com/usa/largest-companies-in-the-usa-by-market-cap/"
                          isExternal>
                        companiesmarketcap <ExternalLinkIcon mx="2px"/>
                    </Link>
                </div>
                <div className="StocksList__caption _note">
                    Click on the company in the list to set the data to the form
                </div>
                <div className="StocksList__filter">
                    <Input placeholder="Filter" size="md" value={search} onChange={onSearchInput}/>
                </div>
                <div className="StocksList__table">
                    <div className="StocksList__table-head">
                        <div className="StocksList__table-cell1">
                            Name
                        </div>
                        <div className="StocksList__table-cell2">
                            Sector
                        </div>
                        <div className="StocksList__table-cell3">
                            Result
                        </div>
                    </div>
                    <div className="StocksList__table-body">
                        {compArray.map((comp, i) => (
                            !search
                            || comp.key.toLowerCase().indexOf(search.toLowerCase()) >= 0
                            || dataRes[comp.key].Name.toLowerCase().indexOf(search.toLowerCase()) >= 0 ? (
                                <div className={'StocksList__table-row' + (selSymbol === comp.key ? ' _active' : '')}
                                     onClick={() => setData(comp.key)}
                                     key={comp.key}>
                                    <div className="StocksList__table-cell1 _name">
                                        <Tooltip label={dataRes[comp.key].Description} openDelay={500}>
                                            <div>
                                                <span> {comp.key} </span>: {dataRes[comp.key].Name}
                                            </div>
                                        </Tooltip>
                                    </div>
                                    <div className="StocksList__table-cell2 _sector">
                                        {dataRes[comp.key].Sector}
                                    </div>
                                    <div className="StocksList__table-cell3 _value" style={{
                                        color: listValues?.length ? `rgb(${colors[i]}, ${150 - colors[i]}, 0)` : 'unset'
                                    }}>
                                        {comp.value || comp.value === 0 ? formatNumber(String(comp.value)) : ''}
                                    </div>
                                </div>) : null
                        ))}
                    </div>
                    <div className="StocksList__table-foot">
                    </div>
                </div>
            </div>
        );
    }
);
