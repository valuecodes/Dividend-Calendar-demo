import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
// import 'chartjs-plugin-datalabels';

export class FinancialComparison extends Component {

    constructor() {
        super();
        this.state = {
            tickers: [],
            financialKeys: [],
            incomeKeys: [],
            balanceKeys: [],
            cashflowKeys: [],
            ratiosKeys: [],
            selectedTickers: [],
            selectedKey: null,
            chartData: {},
            chartOptions: {},
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.portfolio) !== '[]') {
            let tickers = props.portfolio.tickers.map(element => element[0]);
            let financialKeys = Object.keys(props.portfolio.dividendData[tickers[0]].yearData[0]);

            let incomeKeys = financialKeys.slice(1, 23).reverse();
            let balanceKeys = financialKeys.slice(27, 49).reverse();
            let cashflowKeys = financialKeys.slice(49, 78).reverse();
            delete cashflowKeys[6];
            let ratiosKeys = financialKeys.slice(78, 98).reverse();

            let selectedTickers = state.selectedTickers;

            if (Object.keys(selectedTickers).length !== tickers.length) {
                tickers.forEach(element => {
                    selectedTickers[element] = {
                        ticker: element,
                        selected: false
                    }
                });
            }
            let chartData = {};
            let chartOptions = {};
            let selectedKey = state.selectedKey;

            if (selectedKey !== null) {
                let tickers = Object.keys(selectedTickers);
                let selected = [];
                let data = props.portfolio.dividendData;
                for (var i = 0; i < tickers.length; i++) {
                    if (selectedTickers[tickers[i]].selected === true) {
                        selected.push(tickers[i]);
                    }
                }
                let labelDataTotal = [];
                let cDataTotal = [];
                let tickerLabels = [];
                let color = [];
                let colors = [
                    'rgba( 45, 69,113,1)',
                    'rgba(170, 76, 57,1)',
                    'rgba(170,138, 57,1',
                    'rgba( 41,123, 72,1)',
                    'rgba(111,199,154,1)',
                    'rgba( 70,157,113,1)',
                    'rgba(125,159, 53,1)',
                    'rgba(208,243,135,1)',
                    'rgba(172,209, 93,1)',
                ]

                for (var a = 0; a < selected.length; a++) {
                    let label = [];
                    let cData = [];
                    for (var c = data[selected[a]].yearData.length - 1; c >= 0; c--) {
                        label.push(data[selected[a]].yearData[c]['year']);
                        cData.push(data[selected[a]].yearData[c][selectedKey]);

                    }
                    tickerLabels.push(selected[a]);
                    color.push(colors[a]);
                    labelDataTotal.push(label);
                    cDataTotal.push(cData);
                }
                chartData = {
                    labels: labelDataTotal[0],
                    datasets: []
                }

                for (var x = 0; x < cDataTotal.length; x++) {
                    chartData.datasets.push({
                        label: tickerLabels[x],
                        data: cDataTotal[x],
                        backgroundColor: 'rgba(255, 99, 132, 0.1)',
                        borderColor: color[x],
                        borderWidth: 5
                    })
                }

                chartOptions = {
                    maintainAspectRatio: true,
                    responsive: true,
                    plugins: {
                        datalabels: {
                            display: false,
                        },
                    },
                    scales: {
                        yAxes: [{
                            ticks: {
                                // beginAtZero: true
                            }
                        }]
                    },
                    title: {
                        display: true,
                        text: selectedKey
                    }
                }
            }

            return {
                tickers: tickers,
                financialKeys: financialKeys,
                incomeKeys: incomeKeys,
                balanceKeys: balanceKeys,
                cashflowKeys: cashflowKeys,
                ratiosKeys: ratiosKeys,
                selectedTickers: selectedTickers,
                chartData: chartData,
                chartOptions: chartOptions
            }
        }
        return false;
    }

    selectTicker(ticker) {
        let selectedTickers = this.state.selectedTickers;
        selectedTickers[ticker].selected === true ? selectedTickers[ticker].selected = false : selectedTickers[ticker].selected = true;
        this.setState({ selectedTickers: selectedTickers })
    }

    selectRatio(key) {
        this.setState({ selectedKey: key })
    }

    setTickerColor(ticker) {
        if (this.state.selectedTickers[ticker].selected === true) {
            return "rgba(156, 56, 56, 0.753)";
        }
        return "";
    }

    setKeyColor(key) {
        if (this.state.selectedKey === key) {
            return "rgba(156, 56, 56, 0.753)";
        }
        return "";
    }

    render() {
        return (
            <div id='financialComparisonPage' className='comparisonContainer'>
                <button className="closeComparison" onClick={this.props.closeComparison}>Back</button>
                <div id='fcOptions'>
                    <div id='fcTickers'>
                        {this.state.tickers.map((ticker, index) =>
                            <button key={index} style={{ background: this.setTickerColor(ticker) }} onClick={this.selectTicker.bind(this, ticker)} className='fcButton'>{ticker}</button>
                        )}
                    </div>
                    <div className='fcKeys'>
                        <h3 className='fcKeysHeader'>Income Statement</h3>
                        {this.state.incomeKeys.map((key, index) =>
                            <button key={index} style={{ background: this.setKeyColor(key) }} onClick={this.selectRatio.bind(this, key)} className='fcKeyButton'>{key.slice(0, 14)}</button>
                        )}
                    </div>
                    <div className='fcKeys'>
                        <h3 className='fcKeysHeader'>Balance Sheet</h3>
                        {this.state.balanceKeys.map((key, index) =>
                            <button key={index} style={{ background: this.setKeyColor(key) }} onClick={this.selectRatio.bind(this, key)} className='fcKeyButton'>{key.slice(0, 14)}</button>
                        )}
                    </div>
                    <div className='fcKeys'>
                        <h3 className='fcKeysHeader'>Cash Flow Statement</h3>
                        {this.state.cashflowKeys.map((key, index) =>
                            <button key={index} style={{ background: this.setKeyColor(key) }} onClick={this.selectRatio.bind(this, key)} className='fcKeyButton'>{key.slice(0, 14)}</button>
                        )}
                    </div>
                    <div className='fcKeys'>
                        <h3 className='fcKeysHeader'>Financial Ratios</h3>
                        {this.state.ratiosKeys.map((key, index) =>
                            <button key={index} style={{ background: this.setKeyColor(key) }} onClick={this.selectRatio.bind(this, key)} className='fcKeyButton'>{key.slice(0, 14)}</button>
                        )}
                    </div>
                </div>
                <Line
                    data={this.state.chartData}
                    width={50}
                    height={11}
                    options={this.state.chartOptions}
                    datasetKeyProvider={this.datasetKeyProvider}
                />
            </div>
        )
    }
}

export default FinancialComparison

// let randomColor = () => {
//     let colors = [
//         'rgba( 45, 69,113,0.3)',
//         'rgba(115,142,192,0.3)',
//         'rgba( 74,100,149,0.3)',
//         'rgba( 45, 69,113,0.3)',
//         'rgba(115,142,192,0.3)',
//         'rgba( 74,100,149,0.3)',
//         'rgba( 73, 46,116,0.3)',
//         'rgba(147,116,195,0.3)',
//         'rgba(105, 75,152,0.3)',
//         'rgba( 40,119, 79,0.3)',
//         'rgba(111,199,154,0.3)',
//         'rgba( 70,157,113,0.3)',
//         'rgba( 40,119, 79,0.3)',
//         'rgba(111,199,154,0.3)',
//         'rgba( 70,157,113,0.3)',
//         'rgba(125,159, 53,0.3)',
//         'rgba(208,243,135,0.3)',
//         'rgba(172,209, 93,0.3)',
//     ]
//     let num = Math.floor(Math.random() * 20);
//     return colors[num];
// }