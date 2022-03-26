import * as React from 'react'
import {ChangeEvent, memo, useCallback, useEffect, useMemo, useState} from 'react'
import {Box, Button, FormControl, FormLabel, Input, Link, Select, Switch} from '@chakra-ui/react'
import './FormulaBox.scss'
import {MathComponent} from 'mathjax-react';
import {EvalFunction, MathNode, parse} from 'mathjs';
import {debounce} from 'lodash';
import {replaceTexConsts} from '../../data/mappings';
import {FieldForm, formatNumber} from '../FieldsForm/FieldsForm';
import {useDispatch, useSelector} from 'react-redux';
import {getCurrentViewDataSelector} from '../../store/formula/selectors';
import {getValueComp, StocksList} from '../StocksList/StocksList';
import {useNavigate} from 'react-router-dom';
import {setDataAction} from '../../store/formula/actions';
import {RWebShare} from 'react-web-share';
import {ExternalLinkIcon} from '@chakra-ui/icons';

const dataRes = require('../../data/dataRes.json');

const COMP_ARRAY: { key: string, value?: number }[] = [];
Object.keys(dataRes).forEach((key) => COMP_ARRAY.push({key}));

const getVarsList = (node: MathNode, list: string[]): string[] => {
    if (node) {
        // @ts-ignore
        if (node.name) {
            // @ts-ignore
            list.push(node.name);
        }
        // @ts-ignore
        node.args?.forEach((n) => getVarsList(n, list));
        // @ts-ignore
        node.items?.forEach((n) => getVarsList(n, list));
        // @ts-ignore
        if (node.content) {
            // @ts-ignore
            getVarsList(node.content, list)
        }
    }
    return list;
};

export const FormulaBox = memo(
    () => {
        const navigate = useNavigate();
        const dispatch = useDispatch();

        const [usedKeys, setUsedKeys] = useState<string[]>([]);
        const [list, setList] = useState(COMP_ARRAY);
        const [listValues, setListValues] = useState<number[]>([]);
        const [order, setOrder] = useState<'higher' | undefined>(undefined);
        const [compiled, setCompiled] = useState<EvalFunction | null>(null);
        const [equation, setEquation] = useState('');
        const [usedFieldsOnly, setUsedFieldsOnly] = useState(false);
        const [shareWithData, setShareWithData] = useState(false);
        const [result, setResult] = useState<string | null>(null);
        const [texData, setTexData] = useState({tex: '', error: null});
        const [needEval, setNeedEval] = useState(false);

        // @ts-ignore
        const viewData: { [key: string]: string } = useSelector(getCurrentViewDataSelector);

        // on init
        useEffect(() => {
            const queryParams = new URLSearchParams(window.location.search)
            const e = queryParams.get('e');
            const su = queryParams.get('su');
            const d = queryParams.get('d');
            if (e) {
                setEquation(e);
                setUsedFieldsOnly(Boolean(Number(su)));
                if (queryParams.get('or')) {
                    setOrder('higher');
                }
                if (d) {
                    try {
                        dispatch(setDataAction({data: JSON.parse(d), symbol: '-'}))
                    } catch (_) {
                        // ignore
                    }
                }
                setNeedEval(true);
            }
        }, [setNeedEval, setOrder, setEquation, setUsedFieldsOnly]);

        useEffect(() => {
            if (equation && equation !== '') {
                navigate(`?e=${encodeURIComponent(equation)}&su=${encodeURIComponent(String(Number(usedFieldsOnly)))}` +
                    (shareWithData ? `&d=${encodeURIComponent(JSON.stringify(viewData).replaceAll(' ', ''))}` : '')
                    + (order ? '&or=1' : ''), {replace: true});
            } else {
                navigate('', {replace: true});
            }
        }, [equation, viewData, order, usedFieldsOnly, shareWithData, navigate]);

        const data = useMemo(() => {
            const d: { [key: string]: string } = {};
            Object.keys(viewData)?.forEach((key) => {
                const n = Number(typeof viewData[key] === 'string' ? viewData[key].replaceAll(' ', '') : viewData[key]);
                if (!isNaN(n)) {
                    d[key] = String(n);
                }
            });
            return d;
        }, [viewData]);

        useEffect(() => {
            setListValues(list.reduce((arr: number[], item) => {
                if (item.value !== undefined && !arr.includes(item.value)) {
                    arr.push(item.value);
                }
                return arr;
            }, []));
        }, [list]);

        const onEval = useCallback(() => {
            const res: { key: string, value?: number }[] = [];
            try {
                COMP_ARRAY.forEach((item) => {
                    try {
                        res.push({
                            key: item.key,
                            value: compiled ? Math.round(compiled.evaluate(dataRes[item.key].data) * 1000) / 1000 : undefined
                        });
                    } catch (e) {
                        console.error('Can\'t valuate ' + item.key);
                        throw e;
                    }
                });
                if (order === 'higher') {
                    res.sort((a, b) => (b.value || 0) - (a.value || 0));
                } else {
                    res.sort((a, b) => (a.value || 0) - (b.value || 0));
                }
                setList(res);
            } catch (e) {
                console.error(e);
            }
        }, [compiled, order]);

        const formulaChange = useCallback((equation: string, data) => {
            let node = null;
            let error = null;
            try {
                if (equation) {
                    node = parse(equation);
                }
            } catch (e: any) {
                error = e.message;
            }
            if (node) {
                setUsedKeys(getVarsList(node, []));
                try {
                    const compiled = node.compile();
                    setCompiled(compiled);
                    try {
                        const res = compiled.evaluate(data);
                        if (typeof res === 'string' || typeof res === 'number') {
                            setResult(String(Math.round(+res * 1000) / 1000));
                        } else {
                            setResult(null);
                        }
                    } catch (_) {
                        setResult(null);
                    }
                } catch (_) {
                    setResult(null);
                    setCompiled(null);
                }
                if (equation && needEval) {
                    setNeedEval(false);
                    window.document.querySelector('.Promo__start')?.scrollIntoView();
                }
            } else {
                setUsedKeys([]);
                setResult(null);
                setCompiled(null);
            }
            let tex = node ? node.toTex({parenthesis: 'keep', implicit: 'hide'}) : '';
            tex = replaceTexConsts(tex.replaceAll('\\_', '_'));
            setTexData({tex, error});
        }, [setTexData, setUsedKeys, needEval, setNeedEval]);

        useEffect(() => {
            if (needEval) {
                onEval();
            }
        }, [needEval, onEval])

        const debounceFormulaChange = useMemo(() => debounce(formulaChange, 1000), [formulaChange]);

        const onInput = useCallback((event: ChangeEvent<HTMLInputElement>) => {
            if (event.currentTarget) {
                setList(COMP_ARRAY);
                const equation = event.currentTarget.value;
                setEquation(equation);
            }
        }, [setList, setEquation]);

        useEffect(() => debounceFormulaChange(equation, data), [equation, data, debounceFormulaChange]);

        useEffect(() => {
            // On initialization
            formulaChange(equation, data)
        }, []);

        const onShowUsedChange = useCallback((e) => {
            window.document.querySelector('.FormulaBox__tex')?.scrollIntoView();
            setUsedFieldsOnly(e.target.checked);
        }, [setUsedFieldsOnly]);
        const onShareWithData = useCallback((e) => setShareWithData(e.target.checked), [setShareWithData]);
        const onOrderChange = useCallback((e) => {
            setList(COMP_ARRAY);
            setOrder(e.target.value);
        }, [setOrder]);
        const {tex, error} = texData;
        const resCompare = useMemo(() => {
            try {
                if (result && listValues.length > 0) {
                    return getValueComp(Number(result), listValues, order === 'higher');
                }
            } catch (_) {/* ignore */
            }
            return -1;
        }, [result, listValues, order]);

        const onSampleFormula = useCallback(() => {
            setList(COMP_ARRAY);
            setOrder('higher');
            setEquation('EPS*(8.5 + 8.8*(PE+1e-12)/(FPE+1e-12)) / (2.93*P)');
            // setEquation('(2.93 * P) / abs((EPS > 0)*EPS*(8.5 + 8.8*(PE + 1e-12)/(FPE + 1e-12)))');
        }, [setList, setEquation, setOrder]);
        // console.log('hi');
        return (
            <Box textAlign="center" fontSize="xl" className="FormulaBox__wrapper">
                <div className="FormulaBox__tex">
                    {
                        tex ? (<MathComponent tex={tex} display={false}/>)
                            : (error ? <div className="FormulaBox__tex-error">
                                Can't parse formula
                                <div className="FormulaBox__tex-error-details">
                                    {error}
                                </div>
                            </div> : <div className="FormulaBox__tex-placeholder">
                                Enter your formula in the input below. For example, <Link color="blue.500"
                                                                                          onClick={onSampleFormula}>Graham
                                Growth Formula</Link><Link
                                href="https://www.oldschoolvalue.com/stock-valuation/benjamin-graham-formula"
                                isExternal><ExternalLinkIcon mx="2px"/></Link>.
                                <br/>
                                Use <Link href="https://mathjs.org/docs/expressions/syntax.html"
                                          isExternal>mathjs<ExternalLinkIcon mx="2px"/></Link> syntax.
                            </div>)
                    }
                </div>
                <div className="FormulaBox__inputbox">
                    <Input placeholder="(PE/FPE)^2 * (PE + MC/Debt)"
                           value={equation}
                           onChange={onInput}
                           size="lg"
                    />
                </div>
                <div className="FormulaBox__results">
                    <div className="FormulaBox__results-value">
                        RESULT: {result === null ? (<span className="_error">_</span>) : (
                        <span style={resCompare >= 0 ? {
                            color: listValues?.length ? `rgb(${resCompare}, ${150 - resCompare}, 0)` : 'unset'
                        } : {}}>{formatNumber(result)}</span>)}
                    </div>
                    <div className="FormulaBox__results-comment">
                        {usedFieldsOnly ? 'Uncheck switcher under the form to see all variables' : 'You can use variables from the form below'}
                    </div>
                </div>
                <FieldForm usedKeys={usedKeys} showOnlyUsed={usedFieldsOnly}/>
                <div className="FormulaBox__yahoo">
                    You can fill the form with custom data. Look&nbsp;for&nbsp;it on&nbsp;<Link href="https://finance.yahoo.com" isExternal>Yahoo&nbsp;Finance<ExternalLinkIcon
                    mx="2px"/></Link> or&nbsp;anywhere&nbsp;else.
                </div>
                <div className="FormulaBox__switcher">
                    <FormControl display="flex" alignItems="center">
                        <FormLabel htmlFor="hide-unused" mb="0" size="md">
                            Hide unused parameters
                        </FormLabel>
                        <Switch id="hide-unused" size="md" isChecked={usedFieldsOnly} onChange={onShowUsedChange}/>
                    </FormControl>
                </div>
                <div className="FormulaBox__share">
                    Share your result on social media
                    <div className="FormulaBox__switcher">
                        <FormControl display="flex" alignItems="center">
                            <FormLabel htmlFor="include-values" mb="0" size="md">
                                Include form values
                            </FormLabel>
                            <Switch id="include-values" size="md" isChecked={shareWithData} onChange={onShareWithData}/>
                        </FormControl>
                    </div>
                    <div className="FormulaBox__switcher">
                        <RWebShare
                            data={{
                                text: 'Check out my stock valuation formula (created on thestocker.org)',
                                url: window.location.href,
                                title: 'Share formula',
                            }}
                        >
                            <Button colorScheme="green" className="FormulaBox__toolbar-button _share"
                                    disabled={!equation || equation === ''}> Share result </Button>
                        </RWebShare>
                    </div>
                    <div className="FormulaBox__share-comment">
                        Or just copy current URL
                    </div>
                </div>
                <div className="FormulaBox__toolbar">
                    <Button colorScheme="blue" className="FormulaBox__toolbar-button"
                            onClick={onEval} disabled={!compiled}> Evaluate companies </Button>
                    <div className="FormulaBox__toolbar-select">
                        <Select placeholder="Lower is better" value={order} onChange={onOrderChange}>
                            <option value="higher">Higher is better</option>
                        </Select>
                    </div>
                </div>
                <StocksList compArray={list} listValues={listValues} higher={order === 'higher'}/>
            </Box>
        )
    });
