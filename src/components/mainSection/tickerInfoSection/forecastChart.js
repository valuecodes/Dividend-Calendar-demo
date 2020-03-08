import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';


export class ForecastChart extends Component {
    constructor() {
        super();
        this.state = {
            selectedCompany: [],
            chartData: {},
            chartOptions: {},
            dividendYield: false,
            chartType: "Dividend Yield",
            chartLabel: "Stock Price",
            timeFrame: 5,
            current: 'dividend'
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.selectedCompany) !== '[]') {
            let label = [];
            let dData = [];
            let fData = [];
            let yearlyData = {};
            let backGround = [];
            // let fDataBackGround = [];
            let radius = [];

            // let d2020 = 0;

            let type = props.selectedCompany.tickerData.dividendType;
            let divType = 1;
            if (type === 'Quarterly') {
                divType = 4;
            } else if (type === 'Annual') {
                divType = 1;
            } else if (type === 'Semi-Annual') {
                divType = 2;
            }

            props.selectedCompany.weeklyData.forEach(element => {
                if (element.year >= 2010) {
                    if (element.year < 2020 && element.year > 2014) {
                        if (yearlyData[element.year] !== undefined) {
                            yearlyData[element.year] += element.dividend;
                        } else {
                            yearlyData[element.year] = 0;
                        }
                    }
                    if (element.dividend !== 0) {
                        label.unshift(element.year);
                        dData.unshift(element.dividend);
                        backGround.push('rgba(71, 189, 138, 0.6)');
                        fData.push(0);
                        radius.push(3);
                        // fDataBackGround = ['rgba(171, 159, 138, 1)'];
                        if (element.year === 2020) {
                            // d2020++;
                        }
                    }
                }
            });
            let growth = getGrowthRate(yearlyData);
            for (var i = 2020; i <= 2030; i++) {
                for (var j = 1; j <= divType; j++) {
                    label.push(i);
                    dData.push((dData[dData.length - divType] * growth).toFixed(2));
                    backGround.push('rgba(171, 89, 138, 0.6)');
                    fData.push((dData[dData.length - divType] * growth).toFixed(2));
                    radius.push(4);
                    // fDataBackGround = ['rgba(171, 89, 138, 0.9)'];
                }
            }

            let data = {
                labels: label,

                datasets: [
                    {
                        data: dData,
                        label: 'Price Chart',
                        backgroundColor: backGround,
                        borderColor: 'rgba(40, 49, 54, 1)',
                        fill: false,
                        pointRadius: radius,

                    },
                    {
                        label: 'Dividends',
                        backgroundColor: 'rgba(60,179,113)',
                        borderColor: 'rgba(0,0,0,0.6)',
                    },
                    {
                        label: 'Forecast',
                        backgroundColor: 'rgba(191, 120, 168, 0.6)',
                        borderColor: 'rgba(0,0,0,0.6)',
                    }
                ]
            }

            let options = {
                plugins: {
                    datalabels: {
                        display: false,
                        color: 'black',
                        align: 'end',
                        font: {
                            size: 12,
                        }
                    },
                },
                scales: {
                    xAxes: [{
                        ticks: {
                            maxTicksLimit: 10
                        }
                    }]
                },
                legend: {
                    position: 'top',
                    labels: {
                        "fontSize": 15,
                        filter: function (item, chart) {
                            let check = true;
                            if (item.text.includes('Price')) {
                                check = false
                            }
                            return check;
                        }
                    },
                    fontSize: 30
                }

            }
            return {
                selectedCompany: props.selectedCompany,
                chartData: data,
                chartOptions: options
            }
        }
        return false
    }
    datasetKeyProvider() { return Math.random(); }

    changeChart(type) {
        this.setState({ current: type });
    }

    myColor(value) {
        if (this.state.current === value) {
            return "rgba(156, 156, 56, 0.753)";
        }
        return "";
    }

    render() {
        return (
            <div id='forecastChart'>
                <div id='forecastOptions'>
                    <h3>Forecast</h3>
                    <button style={{ background: this.myColor('dividend') }} onClick={this.changeChart.bind(this, 'dividend')}>Dividend</button>
                    <button style={{ background: this.myColor('intrinsic') }} onClick={this.changeChart.bind(this, 'intrinsic')} >Intrinsic Value</button>
                </div>
                <Line
                    data={this.state.chartData}
                    width={50}
                    height={23}
                    options={this.state.chartOptions}
                    datasetKeyProvider={this.datasetKeyProvider}
                />
            </div>
        )
    }
}

export default ForecastChart

let getGrowthRate = (annual) => {
    let years = Object.keys(annual);
    let len = years.length - 1;
    let sum = 0;
    let growth = [];
    for (var i = 0; i < len; i++) {
        sum += annual[years[i + 1]] / annual[years[i]];
        growth.push(annual[years[i + 1]] / annual[years[i]]);
    }
    return ((sum / len) / 100) * 100;
}