import React, { Component } from 'react'
import { Line } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';

export class PriceChart extends Component {
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
            tooltip: 'dividend'
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.selectedCompany) !== '[]') {

            let label = [];
            let wData = [];
            let dData = [];
            let pStyle = [];
            let yearlyDivs = {};
            let divYield = [];
            let iData = [];
            let iStyle = [];
            let iColor = [];
            let dColor = [];
            console.log(props.selectedCompany);
            let timeFrame = 2021 - state.timeFrame;
            let divData = [...props.selectedCompany.dividendData];
            let insiderData = [...props.selectedCompany.insiderData];
            let type = props.selectedCompany.tickerData.dividendType;
            let divType;

            if (type === 'Annual') {
                divType = 'annual'
            } else if (type === 'Semi-Annual') {
                divType = 'semi'
            } else {
                divType = 'quarter'
            }

            props.selectedCompany.weeklyData.forEach(element => {
                if (element.year >= timeFrame) {
                    label.unshift(element.year + ' Q' + element.quarter);
                    wData.unshift(element.close);
                    dData.unshift((element.dividend));

                    if (divType === 'quarter') {
                        let yearQ = element.year + '/' + element.quarter;
                        if (yearlyDivs[yearQ] === undefined && divData.length > 4) {
                            let total = 0;
                            for (var x = 0; x < 4; x++) {
                                total += divData[x].dividend;
                            }
                            if (divData[0].year === element.year) {
                                yearlyDivs[yearQ] = total;
                                divData.shift();
                            } else if (element.year === 2020) {
                                yearlyDivs[yearQ] = total;
                            } else {
                                yearlyDivs[yearQ] = 0;
                            }
                        }
                    } else if (divType === 'annual') {
                        let yearD = element.year;
                        if (yearlyDivs[yearD] === undefined && divData.length > 1) {
                            let total = 0;

                            total += divData[0].dividend;
                            if (divData[1].year === yearD) {
                                total += divData[1].dividend;
                                yearlyDivs[element.year] = total;
                            }

                            if (divData[0].year === yearD) {
                                yearlyDivs[element.year] = total;
                                divData.shift();
                            } else if (element.year === 2020) {
                                yearlyDivs[yearD] = total;
                            }
                        }
                    } else if (divType === 'semi') {
                        let yearD = element.year;
                        if (yearD === 2020) {
                            yearlyDivs[element.year] = divData[0].dividend + divData[1].dividend;
                        } else {
                            if (yearlyDivs[yearD] === undefined && divData.length > 1) {
                                if (divData[0].year === yearD && divData[1].year === yearD) {
                                    yearlyDivs[element.year] = divData[0].dividend + divData[1].dividend;
                                    divData.shift();
                                    divData.shift();
                                } else if (divData[0].year === yearD) {
                                    yearlyDivs[element.year] = divData[0].dividend;
                                    divData.shift();
                                }
                            }
                        }
                    }
                    let insider = insiderData.filter(inElement => inElement.year === element.year && inElement.month === element.month);
                    insiderData.splice(0, insider.length);

                    iData.unshift(insider)

                    if (insider.length !== 0) {
                        iStyle.unshift('7');
                        if (insider[0].type === 'Buy') {
                            iColor.unshift('rgb(56, 181, 79)')
                        } else {
                            iColor.unshift('rgb(181, 59, 54)')
                        }
                    } else {
                        iStyle.unshift('0');
                        iColor.unshift('black')
                    }
                    if (element.dividend !== 0) {
                        pStyle.unshift('3');
                    } else {
                        pStyle.unshift('0');
                    }
                    dColor.push('rgba(40, 49, 54, 0.7)');
                }
            });
            props.selectedCompany.weeklyData.forEach(element => {
                if (element.year >= timeFrame) {
                    if (divType === 'quarter') {
                        divYield.unshift((yearlyDivs[element.year + '/' + element.quarter] / element.close) * 100);
                    } else if (divType === 'annual') {
                        divYield.unshift((yearlyDivs[element.year] / element.close) * 100);
                    } else if (divType === 'semi') {
                        divYield.unshift((yearlyDivs[element.year] / element.close) * 100);
                    }
                }
            })

            let style = state.tooltip === 'dividend' ? pStyle : iStyle;
            let color = state.tooltip === 'dividend' ? dColor : iColor;

            let data = {
                labels: label,
                datasets: [
                    {
                        data: wData,
                        label: 'Price Chart',
                        backgroundColor: [
                            'rgba(71, 189, 138, 0.6)',
                        ],
                        borderColor: 'rgba(40, 49, 54, 1)',
                        pointBackgroundColor: color,
                        borderWidth: 1,
                        pointRadius: style,
                        pointHitRadius: style,
                        hidden: state.dividendYield,
                    },
                    {
                        data: divYield,
                        label: 'Dividend Yield',
                        backgroundColor: [
                            'rgba(71, 89, 138, 0.8)',
                        ],
                        // borderColor: 'rgba(221, 89, 138, 0.5)',
                        borderWidth: 1,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        hidden: !state.dividendYield,
                    }
                    ,
                    {
                        data: iData,
                        label: 'InsiderData',
                        backgroundColor: [
                            'rgba(71, 89, 138, 0.8)',
                        ],
                        // borderColor: 'rgba(221, 89, 138, 0.5)',
                        borderWidth: 1,
                        pointRadius: 0,
                        pointHitRadius: 10,
                        hidden: !state.dividendYield,
                    }
                ]
            }
            let options = {
                legend: {
                    display: false,
                },
                maintainAspectRatio: true,
                responsive: true,
                width: "100px",
                height: "100px",
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
                tooltips: {
                    // enabled: !state.dividendYield,
                    cornerRadius: 10,
                    callbacks: {
                        label: function (tooltipItem, data) {
                            let divLabel;
                            if (!state.dividendYield) {
                                if (state.tooltip === 'dividend') {
                                    for (var a = 0; a < 52; a++) {
                                        if (dData[tooltipItem.index + a] !== 0) {
                                            divLabel = dData[tooltipItem.index + a];
                                            break
                                        }
                                    }
                                    return "Dividend " + divLabel
                                } else {
                                    return data.datasets[2].data[tooltipItem.index][0].type;
                                }
                            } else {
                                return Number(tooltipItem.value).toFixed(1) + '%';
                            }
                        },
                        footer: function (tooltipItem, data) {
                            if (state.tooltip === 'insider' && !state.dividendYield) {
                                let total = [];
                                if (data.datasets[2].data[tooltipItem[0].index].length > 1) {
                                    for (var i = 0; i < data.datasets[2].data[tooltipItem[0].index].length; i++) {
                                        total.push(
                                            'Title: ' + data.datasets[2].data[tooltipItem[0].index][i].title +
                                            '   \tType: ' + data.datasets[2].data[tooltipItem[0].index][i].type +
                                            '   \tTotal: ' + data.datasets[2].data[tooltipItem[0].index][i].total + '$'
                                        )
                                    }
                                } else {
                                    total.push(
                                        'Name: ' + data.datasets[2].data[tooltipItem[0].index][0].name,
                                        'Title: ' + data.datasets[2].data[tooltipItem[0].index][0].title,
                                        'Count: ' + data.datasets[2].data[tooltipItem[0].index][0].count,
                                        'Price: ' + data.datasets[2].data[tooltipItem[0].index][0].shares,
                                        'Total: ' + data.datasets[2].data[tooltipItem[0].index][0].total + '$'
                                    )
                                }
                                return total;
                            }
                        }
                    }
                },
                hover: {
                    enabled: false,
                    mode: null
                },
                xAxes: [{
                    type: 'linear',
                    position: 'bottom',
                    ticks: {
                        max: 12,
                        min: 1,
                        stepSize: 1,
                        callback: function (value, index, values) {
                            return dData.labels[index];
                        }
                    }
                }]
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

    dividendYield() {
        if (this.state.dividendYield === false) {
            this.setState({ dividendYield: true, chartType: "Stock Price", chartLabel: 'Historical Dividend Yield' })
        } else {
            this.setState({ dividendYield: false, chartType: "Dividend Yield", chartLabel: 'Stock price' })
        }
    }

    changeTimeFrame(value) {
        this.setState({ timeFrame: value });

    }

    myColor(position) {
        if (this.state.timeFrame === position) {
            return "rgba(156, 156, 56, 0.753)";
        }
        if (this.state.tooltip === position) {
            return "rgba(156, 156, 56, 0.753)";
        }
        return "";
    }

    toggleTooltip(type) {
        this.setState({ tooltip: type });
    }

    render() {
        return (
            <div id='priceChart'>
                <div id="priceChartOptions">
                    <h2 id="priceChartLabel">{this.state.chartLabel}</h2>
                    <div id='priceSwitch'>
                        <button style={{ background: this.myColor('dividend') }} id='dividendsTool' onClick={this.toggleTooltip.bind(this, 'dividend')}>Dividends</button>
                        <button style={{ background: this.myColor('insider') }} id='insidersTool' onClick={this.toggleTooltip.bind(this, 'insider')}>Insiders</button>
                    </div>
                    <button id='priceChange' onClick={this.dividendYield.bind(this)}>{this.state.chartType}</button>
                    <button style={{ background: this.myColor(1) }} onClick={this.changeTimeFrame.bind(this, 1)}>1 Year</button>
                    <button style={{ background: this.myColor(3) }} onClick={this.changeTimeFrame.bind(this, 3)}>3 Year</button>
                    <button style={{ background: this.myColor(5) }} onClick={this.changeTimeFrame.bind(this, 5)}>5 Year</button>
                    <button style={{ background: this.myColor(10) }} onClick={this.changeTimeFrame.bind(this, 10)}>10 Year</button>
                    <button style={{ background: this.myColor(20) }} onClick={this.changeTimeFrame.bind(this, 20)}>Max</button>
                </div>
                <Line
                    data={this.state.chartData}
                    width={50}
                    height={17}
                    options={this.state.chartOptions}
                    datasetKeyProvider={this.datasetKeyProvider}
                />
            </div>
        )
    }
}

export default PriceChart
