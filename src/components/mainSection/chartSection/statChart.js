import React, { Component } from 'react'
import { Doughnut as DoughnutChart } from 'react-chartjs-2';
import 'chartjs-plugin-piechart-outlabels';

export class StatChart extends Component {

    constructor() {
        super();
        this.state = {
            tickerData: {},
            tickerDataOptions: {},
            sectorData: {},
            sectorDataOptions: {},
            countryData: {},
            countryDataOptions: {},
            chartData: {},
            chartOptions: {},
        };
    }

    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.portfolio) !== '[]' && props.statType === 'stats') {
            let tickers = props.portfolio.tickers;
            let divData = props.portfolio.dividendData;
            let stake = [];
            let stakeLabel = [];
            let stakeColor = [];

            let tickerStake = [];
            let tickerLabel = [];

            let sectorStake = [];
            let sectorLabel = [];

            let countryStake = [];
            let countryLabel = [];


            let total = 0;

            for (var i = 0; i < tickers.length; i++) {
                stake.push(divData[tickers[i][0]].weeklyData[0].close * tickers[i][1])
                stakeLabel.push(tickers[i][0]);
                stakeColor.push(randomColor());
                total += divData[tickers[i][0]].weeklyData[0].close * tickers[i][1];
            }

            let sectors = {};

            for (var a = 0; a < stake.length; a++) {
                if (sectors[divData[stakeLabel[a]].tickerData.sector]) {
                    sectors[divData[stakeLabel[a]].tickerData.sector] += stake[a];
                } else {
                    sectors[divData[stakeLabel[a]].tickerData.sector] = stake[a];
                }
            }
            for (let key in sectors) {
                sectorStake.push(sectors[key])
                sectorLabel.push(key);
            }

            let countries = {};

            for (var q = 0; q < stake.length; q++) {
                if (countries[divData[stakeLabel[q]].tickerData.countryName]) {
                    countries[divData[stakeLabel[q]].tickerData.countryName] += stake[q];
                } else {
                    countries[divData[stakeLabel[q]].tickerData.countryName] = stake[q];
                }
            }
            for (let key in countries) {
                countryStake.push(countries[key])
                countryLabel.push(key);
            }

            let tickerS = [];
            for (var z = 0; z < stake.length; z++) {
                if (stake[z] / total < 0.05) {
                    stakeLabel[z] = 'Other';

                }
                if (tickerS[stakeLabel[z]]) {
                    tickerStake[stakeLabel[z]] += stake[z];
                } else {
                    tickerS[stakeLabel[z]] = stake[z];
                }
            }


            for (let key in tickerS) {
                tickerStake.push(tickerS[key])
                tickerLabel.push(key);
            }

            let tickerData = {
                labels: tickerLabel,
                datasets: [
                    {
                        data: tickerStake,
                        label: 'Portfolio',
                        backgroundColor: stakeColor,
                        hoverBackgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56"
                        ]
                    }]
            };

            let sectorData = {
                labels: sectorLabel,
                datasets: [
                    {
                        data: sectorStake,
                        label: 'Portfolio',
                        backgroundColor: ['rgba( 45, 69,113,1)',
                            'rgba(115,142,192,1)',
                            'rgba( 74,100,149,1)',
                            'rgba(105, 75,152,1)',
                            'rgba( 40,119, 79,1)',
                            'rgba(111,199,154,1)',
                            'rgba( 70,157,113,1)',
                            'rgba( 45, 69,113,1)',
                            'rgba(115,142,192,1)',
                            'rgba( 74,100,149,1)',
                            'rgba( 73, 46,116,1)',
                            'rgba(147,116,195,1)',
                            'rgba( 40,119, 79,1)',
                            'rgba(111,199,154,1)',
                            'rgba( 70,157,113,1)',
                            'rgba(125,159, 53,1)',
                            'rgba(208,243,135,1)',
                            'rgba(172,209, 93,1)'],
                        hoverBackgroundColor: [],
                    }]
            };

            let countryData = {
                labels: countryLabel,
                datasets: [
                    {
                        data: countryStake,
                        label: 'Portfolio',
                        backgroundColor: ['rgba( 45, 69,113,1)',
                            'rgba(115,142,192,1)',
                            'rgba( 74,100,149,1)',
                            'rgba( 45, 69,113,1)',
                            'rgba(115,142,192,1)',
                            'rgba( 74,100,149,1)',
                            'rgba( 73, 46,116,1)',
                            'rgba(147,116,195,1)',
                            'rgba(105, 75,152,1)',
                            'rgba( 40,119, 79,1)',
                            'rgba(111,199,154,1)',
                            'rgba( 70,157,113,1)',
                            'rgba( 40,119, 79,1)',
                            'rgba(111,199,154,1)',
                            'rgba( 70,157,113,1)',
                            'rgba(125,159, 53,1)',
                            'rgba(208,243,135,1)',
                            'rgba(172,209, 93,1)'],
                        hoverBackgroundColor: [
                            "#FF6384",
                            "#36A2EB",
                            "#FFCE56"
                        ]
                    }]
            };

            let countryDataOptions = {
                maintainAspectRatio: false,
                responsive: false,
                aspectRatio: 2,
                layout: {
                    padding: {
                        left: 100,
                        right: 100,
                        top: 100,
                        bottom: 100
                    }
                },
                plugins: {
                    datalabels: {
                        display: false,
                    },
                    outlabels: {
                        display: true,
                        borderWidth: 2,
                        lineWidth: 2,
                        padding: 3,
                        textAlign: 'center',
                        stretch: 15,
                        font: {
                            resizable: true,
                            minSize: 12,
                            maxSize: 18
                        },
                        valuePrecision: 1,
                        percentPrecision: 2
                    }
                },
                legend: {
                    display: false
                }
            }

            let sectorDataOptions = {
                maintainAspectRatio: false,
                responsive: false,
                aspectRatio: 2,
                layout: {
                    padding: {
                        left: 100,
                        right: 100,
                        top: 100,
                        bottom: 100
                    }
                },
                plugins: {
                    datalabels: {
                        display: false,
                    },
                    outlabels: {
                        display: true,
                        borderWidth: 2,
                        lineWidth: 2,
                        padding: 3,
                        textAlign: 'center',
                        stretch: 15,
                        font: {
                            resizable: true,
                            minSize: 12,
                            maxSize: 18
                        },
                        valuePrecision: 1,
                        percentPrecision: 2
                    }
                },
                legend: {
                    display: false
                }
            }

            let tickerDataOptions = {
                maintainAspectRatio: false,
                responsive: false,
                aspectRatio: 2,
                layout: {
                    padding: {
                        left: 100,
                        right: 100,
                        top: 100,
                        bottom: 100
                    }
                },
                plugins: {
                    datalabels: {
                        display: false,
                    },
                    outlabels: {
                        display: true,
                        borderWidth: 2,
                        lineWidth: 2,
                        padding: 3,
                        textAlign: 'center',
                        stretch: 15,
                        font: {
                            resizable: true,
                            minSize: 12,
                            maxSize: 18
                        },
                        valuePrecision: 1,
                        percentPrecision: 2
                    }
                },
                legend: {
                    display: false
                }
            }


            return {
                // chartData: data,
                tickerData: tickerData,
                tickerDataOptions: tickerDataOptions,
                sectorData: sectorData,
                sectorDataOptions: sectorDataOptions,
                countryData: countryData,
                countryDataOptions: countryDataOptions
            }
        }
        return false;

    }

    datasetKeyProvider() { return Math.random(); }

    render() {
        return (
            <div id='donutCharts'>
                <div className='donutContainer'>
                    <h1 className='donutHeader'>Companies</h1>
                    <DoughnutChart
                        type={'Donut'}
                        width={0.5}
                        height={0.5}
                        data={this.state.tickerData}
                        options={this.state.tickerDataOptions}
                        datasetKeyProvider={this.datasetKeyProvider}
                    />
                </div>
                <div className='donutContainer'>
                    <h1 className='donutHeader'>Sectors</h1>
                    <DoughnutChart
                        type={'Donut'}
                        width={1}
                        height={1}
                        data={this.state.sectorData}
                        options={this.state.sectorDataOptions}
                        datasetKeyProvider={this.datasetKeyProvider}
                    />
                </div>
                <div className='donutContainer'>
                    <h1 className='donutHeader'>Countries</h1>
                    <DoughnutChart
                        type={'Donut'}
                        width={1}
                        height={1}
                        data={this.state.countryData}
                        options={this.state.countryDataOptions}
                        datasetKeyProvider={this.datasetKeyProvider}
                    />
                </div>
            </div>
        )
    }
}

export default StatChart

let randomColor = () => {
    let colors = [
        'rgba( 45, 69,113,1)',
        'rgba(115,142,192,1)',
        'rgba( 74,100,149,1)',
        'rgba( 45, 69,113,1)',
        'rgba(115,142,192,1)',
        'rgba( 74,100,149,1)',
        'rgba( 73, 46,116,1)',
        'rgba(147,116,195,1)',
        'rgba(105, 75,152,1)',
        'rgba( 40,119, 79,1)',
        'rgba(111,199,154,1)',
        'rgba( 70,157,113,1)',
        'rgba( 40,119, 79,1)',
        'rgba(111,199,154,1)',
        'rgba( 70,157,113,1)',
        'rgba(125,159, 53,1)',
        'rgba(208,243,135,1)',
        'rgba(172,209, 93,1)',
    ]
    let num = Math.floor(Math.random() * 20);
    return colors[num];
}



