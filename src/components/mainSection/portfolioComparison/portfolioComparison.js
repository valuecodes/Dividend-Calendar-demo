import React, { Component } from 'react'
import { Bar, Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import portfolioResults, { PortfolioResults } from './portfolioResults'

export class PortfolioComparison extends Component {
    constructor() {
        super();
        this.state = {
            financialKeys: [],
            selectedKey: null,
            selectedKeys: null,
            selectedCharts: [],
            chartOptions: [],
            activeTickers: [],
            selectedTickers: [],
            sectors: [],
            selectedSector: null,
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.portfolio) !== '[]' && props.state !== 'none') {

            let tickers = state.activeTickers;
            if (tickers.length === 0) {
                tickers = props.portfolio.tickers;
                tickers = tickers.map(ticker => ticker[0]);
            }

            let selectedTickers = state.selectedTickers;

            if (Object.keys(selectedTickers).length === 0) {
                tickers.forEach(element => {
                    selectedTickers[element] = {
                        ticker: element,
                        selected: true
                    }
                });
            }

            let divData = props.portfolio.dividendData;
            let keys = state.financialKeys;
            if (Object.keys(keys).length === 0) {
                let financialKeys = Object.keys(props.portfolio.dividendData[tickers[0]].yearData[0]);
                keys = financialKeys.slice(1, 98);
            }

            let data = {};
            let options = {};

            let selectedKeys = state.selectedKeys;
            if (!selectedKeys) {
                selectedKeys = [];
                keys.forEach(element => {
                    selectedKeys[element] = {
                        key: element,
                        selected: false
                    }
                });
            }

            let sectors = tickers.map(elem => props.portfolio.dividendData[elem].tickerData.sector);

            sectors = [...new Set(sectors)];
            let selectedSector = state.selectedSector;

            if (state.selectedSector) {

                let secTickers = tickers.filter(elem => props.portfolio.dividendData[elem].tickerData.sector === selectedSector);
                for (var i = 0; i < tickers.length; i++) {
                    if (secTickers.includes(tickers[i])) {
                        selectedTickers[tickers[i]].selected = true
                    } else {
                        selectedTickers[tickers[i]].selected = false
                    }
                }
            }

            let selected = [];

            for (var i = 0; i < tickers.length; i++) {
                if (selectedTickers[tickers[i]].selected === true) {
                    selected.push(tickers[i]);
                }
            }

            let selectedKeysKeys = Object.keys(selectedKeys);
            selectedKeysKeys = selectedKeysKeys.filter(element => selectedKeys[element].selected === true);

            selectedKeys.forEach(element => { console.log(element) });

            let selectedCharts = [];

            if (selectedKeys) {
                console.log(selected);
                for (var o = 0; o < selectedKeysKeys.length; o++) {
                    let selectedData = [];
                    let selectedDataColors = [];
                    let selectedDataBorders = [];

                    for (var i = 0; i < selected.length; i++) {
                        selectedData.push([divData[selected[i]].yearData[0][selectedKeysKeys[o]], selected[i]]);
                    }

                    selectedData = selectedData.sort(function (a, b) {
                        return a[0] - b[0];
                    });

                    let tickerLabel = selectedData.map(elem => elem[1]);
                    selectedData = selectedData.map(elem => elem[0]);
                    selectedData.forEach(elem => {
                        selectedDataColors.push(elem >= 0 ? 'rgba(75, 192, 192, 0.6)' : 'rgba(255, 99, 132, 0.6)');
                    })

                    data = {
                        labels: tickerLabel,
                        datasets: [
                            {
                                label: selectedKeysKeys[o],
                                data: selectedData,
                                backgroundColor: selectedDataColors,
                                borderWidth: 2,
                            }
                        ]
                    }
                    selectedCharts.push(data);
                }
                console.log(selectedCharts);
                options = {
                    plugins: {
                        datalabels: {
                            display: false,
                        },
                    },
                }
            }
            return {
                cratioData: data,
                chartOptions: options,
                financialKeys: keys,
                selectedKeys: selectedKeys,
                selectedCharts: selectedCharts,
                activeTickers: tickers,
                sectors: sectors
            }
        }
        return false
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (nextProps.state !== 'none') {
            return true;
        }
        return false;
    }

    setKeyColor(key) {
        if (this.state.selectedKeys[key].selected) {
            return "rgba(156, 56, 56, 0.753)";
        }
        return "";
    }

    setTickerColor(ticker) {
        if (this.state.selectedTickers[ticker].selected === true) {
            return "rgba(156, 56, 56, 0.753)";
        }
        return "";
    }

    setSectorColor(sector) {
        if (this.state.selectedSector === sector) {
            return "rgba(156, 56, 56, 0.753)";
        }
        return "";
    }

    selectTicker(ticker) {
        let selectedTickers = this.state.selectedTickers;
        selectedTickers[ticker].selected === true ? selectedTickers[ticker].selected = false : selectedTickers[ticker].selected = true;
        this.setState({ selectedTickers: selectedTickers, selectedSector: null })
    }

    selectAllTickers(ticker) {
        let selectedTickers = this.state.selectedTickers;
        let tickers = Object.keys(selectedTickers);
        tickers.forEach(element => {
            selectedTickers[element] = {
                ticker: element,
                selected: true
            }
        });

        this.setState({ selectedTickers: selectedTickers, selectedSector: null })
    }

    selectSector(sector) {
        this.setState({ selectedSector: sector })
    }

    selectRatio(key) {
        let selectedKeys = this.state.selectedKeys;
        selectedKeys[key].selected === true ? selectedKeys[key].selected = false : selectedKeys[key].selected = true;
        this.setState({ selectedKey: key, selectedKeys: selectedKeys })
    }

    render() {
        return (
            <div className='comparisonContainer'>
                <button className="closeComparison" onClick={this.props.closeComparison}>Back</button>

                <div id='pcOptions'>
                    <div className='pcTickers'>
                        <button className='fcButton pcAllButton' onClick={this.selectAllTickers.bind(this, 'All')}>Select All</button>
                        {this.state.activeTickers.map((ticker, index) =>
                            <button key={index} style={{ background: this.setTickerColor(ticker) }} className='fcButton' onClick={this.selectTicker.bind(this, ticker)}>{ticker}</button>
                        )}
                    </div>
                    <div className='pcSectors'>
                        {this.state.sectors.map((ticker, index) =>
                            <button
                                key={index}
                                style={{ background: this.setSectorColor(ticker) }}
                                className='sectorButton'
                                onClick={this.selectSector.bind(this, ticker)}
                            >
                                {ticker}
                            </button>
                        )}
                    </div>
                    <div className='pcKeys'>
                        <h3 className='fcKeysHeader'>Financial Keys</h3>
                        {this.state.financialKeys.map((key, index) =>
                            <button key={index} style={{ background: this.setKeyColor(key) }} onClick={this.selectRatio.bind(this, key)} className='fcKeyButton'>{key.slice(0, 14)}</button>
                        )}
                    </div>
                </div>
                <div id='pcChartSection'>
                    <div id='compareCharts'>
                        {this.state.selectedCharts.map(element =>
                            <div className='portfolioComparisonChart'>
                                <Bar
                                    data={element}
                                    width={100}
                                    height={40}
                                    options={this.state.chartOptions}
                                />
                            </div>
                        )}
                    </div>
                    <div id='portfolioResults'>
                        <PortfolioResults data={this.state.selectedCharts} />
                    </div>
                </div>


            </div>

        )
    }
}

export default PortfolioComparison

