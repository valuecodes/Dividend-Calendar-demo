import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

export class EarningsChart extends Component {

    constructor() {
        super();
        this.state = {
            selectedCompany: [],
            chartData: {},
            chartOptions: {},
            timeFrame: 'Year',
            payoutRatio: true,
            peRatio: false,
            earnings: false,
            earningsYield: false,
            current: false,
            chartChange: "Earnings Chart",
            chartLabel: 'Payout Ratio'
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.selectedCompany) !== '[]') {
            let label = [];
            let edata = [];
            let ddata = [];
            let pdata = [];
            let pedata = [];
            let eYdata = [];
            let aData = [];
            let lData = [];
            let dlabel = true;
            let country = props.selectedCompany.tickerData.country;

            let max = props.selectedCompany.yearData[0].year;
            let min = props.selectedCompany.yearData[props.selectedCompany.yearData.length - 1].year

            if (state.peRatio === false && state.earningsYield === false) {
                if (state.timeFrame === 'Year' || state.payoutRatio) {
                    for (var x = min; x <= max; x++) {
                        let xYear = x
                        let yearlyE = props.selectedCompany.yearData.filter(element => element.year === xYear);
                        let sumE = 0;
                        if (state.current === true) {
                            aData.push(yearlyE[0].TotalCurrentAssets);
                            lData.push(yearlyE[0].TotalCurrentLiabilities);
                        } else {
                            yearlyE.forEach(element => sumE += element.EPSEarningsPerShare);
                            let yearlyD = props.selectedCompany.dividendData.filter(element => element.year === xYear);
                            let sumD = 0;
                            yearlyD.forEach(element => (sumD += Number(element.dividend)));
                            edata.push(sumE.toFixed(2));
                            ddata.push(sumD.toFixed(2));
                        }
                        label.push(xYear);
                    }
                }
            } else {
                let qEData = {};
                props.selectedCompany.yearData.forEach(element => {
                    qEData[element.year] = Number(element.EPSEarningsPerShare);
                });

                let keys = Object.keys(qEData);
                keys = keys.reverse();
                let trailing = {};
                for (var s = 0; s < keys.length; s++) {
                    trailing[keys[s]] = 0;
                    for (var d = s; d < s + 1; d++) {
                        trailing[keys[s]] += qEData[keys[d]];
                    }
                    if (keys.length - s < 1) {
                        trailing[keys[s]] = trailing[keys[s - 1]]
                    }
                }

                props.selectedCompany.weeklyData.forEach(element => {
                    if (element.year >= min && element.year <= max) {
                        label.unshift(element.year);
                        if (state.earningsYield) {
                            eYdata.unshift(((trailing[element.year] / element.close) * 100).toFixed(2));
                        } else {
                            pedata.unshift((element.close / trailing[element.year]).toFixed(2));
                        }
                    }
                });
            }

            if (state.peRatio || state.earningsYield || state.current) {
                dlabel = false;
            }
            for (var z = 0; z < edata.length; z++) {
                pdata.push((ddata[z] / edata[z] * 100).toFixed(0))
            }

            let fontSize = state.timeFrame === 'Year' && state.payoutRatio ? 15 : 10;
            let data = {
                labels: label,
                datasets: [
                    {
                        data: edata,
                        label: 'EPS',
                        backgroundColor: [
                            'rgba(71, 189, 138, 0.5)',
                        ],
                        borderColor: [
                        ],
                        borderWidth: 1,
                        hidden: !state.earnings,
                    },
                    {
                        data: ddata,
                        label: 'Dividend',
                        backgroundColor: [
                            'rgba(255, 50, 97,0.8)',
                        ],
                        borderColor: [
                            'rgb(255, 150, 0)',
                        ],
                        borderWidth: 3,
                        hidden: !state.earnings
                    },
                    {
                        type: 'bar',
                        label: 'Payout Ratio',
                        data: pdata,
                        backgroundColor: 'rgba(255, 50, 97,0.8)',
                        borderColor: [
                            'rgb(255, 150, 0)',
                        ],
                        borderWidth: 3,
                        maxBarThickness: 80,
                        hidden: !state.payoutRatio
                    },
                    {
                        data: pedata,
                        label: 'PE-Ratio',
                        backgroundColor: [
                            'rgba(255, 50, 97,0.8)',
                        ],
                        borderColor: [
                            'rgb(255, 150, 0)',
                        ],
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        hidden: !state.peRatio
                    },
                    {
                        data: eYdata,
                        label: 'Earnings Yields',
                        backgroundColor: [
                            'rgba(255, 50, 97,0.8)',
                        ],
                        borderColor: [
                            'rgb(255, 150, 0)',
                        ],
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        hidden: !state.earningsYield
                    },
                    {
                        data: aData,
                        type: 'bar',
                        label: 'Current Assets',
                        backgroundColor: 'rgba(71, 189, 138, 0.8)',
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        hidden: !state.current
                    },
                    {
                        data: lData,
                        type: 'bar',
                        label: 'Current Liabilities',
                        backgroundColor: 'rgba(255, 50, 97,0.8)',
                        borderWidth: 3,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        hidden: !state.current
                    }
                ]
            }
            let options = {
                maintainAspectRatio: true,
                responsive: true,
                scaleBeginAtZero: true,
                width: "100px",
                height: "100px",
                plugins: {
                    datalabels: {
                        display: dlabel,
                        color: 'black',
                        align: 'end',
                        font: {
                            size: fontSize,
                        },
                        formatter: (value, ctx) => {
                            if (state.payoutRatio || state.earningsYield) {
                                return value + '%';
                            } else {
                                return value;
                            }
                        }
                    },
                },
                scales: {
                    yAxes: [{
                        ticks: {
                            beginAtZero: true,
                            // max: 100,
                            min: 0,
                            callback: function (value) {
                                if (state.payoutRatio || state.earningsYield) {
                                    return value + "%";
                                } else if (state.current) {
                                    if (country === 'USA') {
                                        return value + 'B'
                                    } else if (country === 'FIN') {
                                        return value + 'M'
                                    }

                                }
                                else {
                                    return value;
                                }

                            }
                        }
                    }],
                    xAxes: [{
                        offset: state.current || state.payoutRatio, 
                        ticks: {
                            // beginAtZero: true,
                            fontSize: 14
                        }
                    }],
                },
                // tooltips: {
                //     // enabled: !state.dividendYield,
                //     cornerRadius: 10,
                //     callbacks: {
                //         label: function (tooltipItem, data) {
                //             let divLabel;
                //             let count = 0;
                //             if (state.earningsYield) {
                //                 return Number(tooltipItem.value).toFixed(1) + '%';
                //             } else {
                //                 // return tooltipItem.value;
                //             }

                //         }
                //     }
                // },
                legend: {
                    display: state.earnings || state.current,
                    position: 'top',
                    labels: {
                        "fontSize": 15,
                        filter: function (item, chart) {
                            let check = true;
                            if (state.earnings) {
                                if (item.text.includes('atio') || item.text.includes('Yield') || item.text.includes('Current')) {
                                    check = false
                                }
                                return check;
                            } else if (state.current) {
                                if (item.text.includes('Current')) {
                                    return true;
                                }
                            }

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

    changeType(type) {
        let payRatio = false;
        let peRatio = false;
        let earnings = false;
        let eYield = false;
        let current = false;
        if (type === "Payout Ratio") {
            payRatio = true
        }
        if (type === 'Historical PE-Ratio') {
            peRatio = true
        }
        if (type === 'Earnings Yield') {
            eYield = true
        }
        if (type === "Earnings and Dividends") {
            earnings = true
        }
        if (type === "Current Ratio") {
            current = true
        }

        this.setState({ payoutRatio: payRatio, peRatio: peRatio, earnings: earnings, earningsYield: eYield, current: current, chartLabel: type, chartChange: type });
    }

    datasetKeyProvider() { return Math.random(); }

    setColor(position) {
        if (this.state.chartLabel === position) {
            return "rgba(156, 156, 56, 0.753)";
        }
        return "";
    }
    render() {
        return (
            <div id='earningsChart'>
                <div id="earningsChartOptions">
                    <h2 id="earningsChartLabel">{this.state.chartLabel}</h2>
                    {/* <p></p> */}
                    <button style={{ background: this.setColor("Payout Ratio") }} onClick={this.changeType.bind(this, "Payout Ratio")}>Payout Ratio</button>
                    <button style={{ background: this.setColor("Earnings and Dividends") }} onClick={this.changeType.bind(this, "Earnings and Dividends")}>Earnings</button>
                    <button style={{ background: this.setColor("Historical PE-Ratio") }} onClick={this.changeType.bind(this, "Historical PE-Ratio")}>PE-ratio</button>
                    <button style={{ background: this.setColor("Earnings Yield") }} onClick={this.changeType.bind(this, "Earnings Yield")}>Earnings Yield</button>
                    <button style={{ background: this.setColor("Current Ratio") }} onClick={this.changeType.bind(this, "Current Ratio")}>Current Ratio</button>
                </div>
                <Line
                    type={'Bar'}
                    data={this.state.chartData}
                    width={50}
                    height={18}
                    options={this.state.chartOptions}
                    datasetKeyProvider={this.datasetKeyProvider}
                />
            </div>
        )
    }
}

export default EarningsChart
