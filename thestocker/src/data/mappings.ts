export const FEATURES_MAP: { [key: string]: { name: string, description: string } } = {
    MC: {
        name: 'Market Capitalization',
        description: 'Market cap—or market capitalization—refers to the total value of all a company\'s shares of stock. It is calculated by multiplying the price of a stock by its total number of outstanding shares.'
    },
    EBITDA: {
        name: 'EBITDA',
        description: 'EBITDA, or earnings before interest, taxes, depreciation, and amortization, is a measure of a company\'s overall financial performance and is used as an alternative to net income in some circumstances. EBITDA, however, can be misleading because it strips out the cost of capital investments like property, plant, and equipment.'
    },
    PE: {
        name: 'P/E Ratio',
        description: 'The price-to-earnings ratio (P/E ratio) is the ratio for valuing a company that measures its current share price relative to its earnings per share (EPS).'
    },
    PEG: {
        name: 'PEG Ratio',
        description: 'The PEG ratio compares a company\'s P/E ratio to its expected rate of growth, a key factor for assessing its value. A company that\'s expected to grow its revenue, earnings and cash flow at a high rate is, all other things being equal, more valuable than a company with little growth opportunity.'
    },
    BV: {
        name: 'Book Value',
        description: 'The book value of a company is the net difference between that company\'s total assets and total liabilities, where book value reflects the total value of a company\'s assets that shareholders of that company would receive if the company were to be liquidated. Value investors often consider stocks with a P/B value under 3.0.'
    },
    DY: {
        name: 'Dividend Yield',
        description: 'The dividend yield is a financial ratio that tells you the percentage of a company\'s share price that it pays out in dividends each year. For example, if a company has a $20 share price and pays a dividend of $1 per year, its dividend yield would be 5%.'
    },
    RE: {
        name: 'Retained Earnings',
        description: 'Retained earnings are the portion of a company\'s cumulative profit that is held or retained and saved for future use.'
    },
    R: {
        name: 'Revenue TTM',
        description: 'TTM Revenue describes the revenue that a company earns over the trailing 12 months (TTM) of business.'
    },
    GP: {
        name: 'Gross Profit TTM',
        description: 'Gross profit is the profit a business makes after subtracting all the costs that are related to manufacturing and selling its products or services over the trailing 12 months (TTM).'
    },
    EPS: {
        name: 'Diluted EPS TTM',
        description: 'Diluted EPS is a calculation used to gauge the quality of a company\'s earnings per share (EPS) over the trailing 12 months (TTM) if all convertible securities were exercised. Convertible securities are all outstanding convertible preferred shares, convertible debentures, stock options, and warrants.'
    },
    FPE: {
        name: 'Forward PE',
        description: 'A variation of the price-to-earnings ratio (P/E ratio) is the forward P/E ratio, which is based on a prediction of a company\'s future earnings. Earnings used in the forward P/E ratio are estimates of future earnings, while the standard P/E ratio uses actual earnings per share from the company\'s previous four quarters.'
    },
    Beta: {
        name: 'Beta',
        description: 'A company\'s beta is a measure of the volatility, or systematic risk, of a security, as it compares to the broader market. The beta of a company measures how the company\'s equity market value changes with changes in the overall market.'
    },
    WH_52: {
        name: '52 Week High',
        description: '52 Week highest stock share price.'
    },
    WL_52: {
        name: '52 Week Low',
        description: '52 Week lowest stock share price.'
    },
    MA_50: {
        name: '50 Day Moving Average',
        description: '50 Day Moving Average stock share price.'
    },
    MA_200: {
        name: '200 Day Moving Average',
        description: '200 Day Moving Average stock share price.'
    },
    SO: {
        name: 'SharesOutstanding',
        description: 'A company\'s shares outstanding (or outstanding shares) are the total number of shares issued and actively held by stockholders—both outside investors and corporate insiders.'
    },
    Debt: {
        name: 'Current Debt',
        description: 'Current debt includes the formal borrowings of a company outside of accounts payable.'
    },
    Debt_s: {
        name: 'Short Term Debt',
        description: 'Short-term debt, also called current liabilities, is a firm\'s financial obligations that are expected to be paid off within a year. It is listed under the current liabilities portion of the total liabilities section of a company\'s balance sheet.'
    },
    TA: {
        name: 'Total Assets',
        description: 'Total assets refers to the total amount of assets owned by a person or entity. Assets are items of economic value, which are expended over time to yield a benefit for the owner. If the owner is a business, these assets are usually recorded in the accounting records and appear in the balance sheet of the business.'
    },
    TL: {
        name: 'Total Liabilities',
        description: 'Total liabilities are the combined debts and obligations that an individual or company owes to outside parties. Everything the company owns is classified as an asset and all amounts the company owes for future obligations are recorded as liabilities.'
    },
    Cash: {
        name: 'Cash at Carrying Value',
        description: 'Cash and Cash Equivalents, at Carrying Value. Includes currency on hand as well as demand deposits with banks or financial institutions.'
    },
    P: {
        name: 'Share Price',
        description: 'Stock Share Price.'
    },
    DP: {
        name: 'Dividend Payout',
        description: 'Total amount of dividends paid to shareholders.'
    },
    ATP: {
        name: 'Analyst Target Price',
        description: 'Analyst Stock Share Target Price.'
    },
    CFO: {
        name: 'Operating Cash Flow',
        description: 'Cash flow from operating activities (CFO) indicates the amount of money a company brings in from its ongoing, regular business activities, such as manufacturing and selling goods or providing a service to customers.'
    },
    PL: {
        name: 'Profit and Loss Statement',
        description: 'When used together, the P&L statement, balance sheet, and cash flow statement provide an in-depth look at a company\'s financial performance together.'
    },
    QEG: {
        name: 'Quarterly Earnings Growth YOY',
        description: 'Quarterly Earnings Growth Year-Over-Year.'
    },
    QRG: {
        name: 'Quarterly Revenue Growth YOY',
        description: 'Quarterly Revenue Growth Year-Over-Year.'
    },
}

const noneOrVal = (val: string) => {
    return ((val === 'None') || (val === '-')) ? '0' : val;
}

const transformToFeatures = (company: any) => {
    return {
        Symbol: company.Symbol,
        AssetType: company.AssetType,
        Name: company.Name,
        Description: company.Description,
        Exchange: company.Exchange,
        Currency: company.Currency,
        Country: company.Country,
        Sector: company.Sector,
        data: {
            MC: company.MarketCapitalization,
            EBITDA: noneOrVal(company.EBITDA),
            Debt_s: noneOrVal(company.LastQuarterlyReport.shortTermDebt),
            Debt: noneOrVal(company.LastQuarterlyReport.currentDebt),
            TA: noneOrVal(company.LastQuarterlyReport.totalAssets),
            TL: noneOrVal(company.LastQuarterlyReport.totalLiabilities),
            Cash: noneOrVal(company.LastQuarterlyReport.cashAndCashEquivalentsAtCarryingValue),
            CFO: noneOrVal(company.LastAnnualCashflow.operatingCashflow),
            PL: noneOrVal(company.LastAnnualCashflow.profitLoss),
            DP: noneOrVal(company.LastAnnualCashflow.dividendPayout),
            RE: noneOrVal(company.LastAnnualReport.retainedEarnings),
            R: noneOrVal(company.RevenueTTM),
            GP: noneOrVal(company.GrossProfitTTM),
            BV: noneOrVal(company.BookValue),
            DY: noneOrVal(company.DividendYield),
            PE: noneOrVal(company.PERatio),
            FPE: noneOrVal(company.ForwardPE),
            PEG: noneOrVal(company.PEGRatio),
            EPS: noneOrVal(company.DilutedEPSTTM),
            P: noneOrVal(company.GlobalQuote['Global Quote']['05. price']),
            ATP: noneOrVal(company.AnalystTargetPrice),
            WH_52: company['52WeekHigh'],
            WL_52: company['52WeekLow'],
            MA_50: company['50DayMovingAverage'],
            MA_200: company['200DayMovingAverage'],
            QEG: noneOrVal(company.QuarterlyEarningsGrowthYOY),
            QRG: noneOrVal(company.QuarterlyRevenueGrowthYOY),
            Beta: noneOrVal(company.Beta),
            // SO: company.SharesOutstanding,
        }
    }
}

export interface StockData {
    MC: string;
    SP: string;
    EBITDA: string;
    PE: string;
    PEG: string;
    BV: string;
    DY: string;
    R: string;
    GP: string;
    EPS: string;
    FPE: string;
    Beta: string;
    WH_52: string;
    WL_52: string;
    MA_50: string;
    MA_200: string;
    // SO: string;
    Debt: string;
    Debt_s: string;
    TA: string;
    P: string;
    ATP: string;
    DP: string;
    CFO: string;
    QEG: string;
    QRG: string;
    Cash: string;
}

export function replaceTexConsts(text: string) {
    return text
        .replaceAll('WH_52', 'WH_{52}')
        .replaceAll('WL_52', 'WL_{52}')
        .replaceAll('MA_50', 'MA_{50}')
        .replaceAll('MA_200', 'MA_{200}');
    // .replaceAll('R_ttm', 'R_{ttm}')
    // .replaceAll('GP_ttm', 'GP_{ttm}')
    // .replaceAll('DEPS_ttm', 'DEPS_{ttm}')
}
