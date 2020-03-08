import React, { Component } from 'react'
import { Bar } from 'react-chartjs-2';
import 'chartjs-plugin-datalabels';
import { CONNREFUSED } from 'dns';
import { element } from 'prop-types';

export class PortfolioComparison extends Component {
    constructor() {
        super();
        this.state = {
            employeeData: {},
            employeeDataOptions: {},
            employeeRevData: {},
            employeeRevDataOptions: {},
            employeeProData: {},
            employeeProDataOptions: {},
            marginData: {},
            marginDataOptions: {},
            cratioData: {},
            cratioDataOptions: {},
            insiderData: {},
            insiderDataOptions: {},
            divPercentData: {},
            divPercentDataOptions: {},
            payoutRatioData: {},
            payoutRatioDataOptions: {},
        };
    }
    static getDerivedStateFromProps(props, state) {
        if (JSON.stringify(props.portfolio) !== '[]' && props.state !== 'none') {
            let data = props.portfolio.dividendData;

            let keys = Object.keys(data);

            let employeesOb = {};
            let employees = [];
            let employeesLabel = [];

            let employeesRevOb = [];
            let revenue = [];
            let revenueLabel = [];

            let employeesProOb = [];
            let profit = [];
            let profitLabel = [];

            let marginOb = [];
            let margin = [];
            let marginLabel = [];

            let cratioOb = [];
            let cratio = [];
            let cratioLabel = [];

            let insiderOb = [];
            let insider = [];
            let insiderLabel = [];

            let divPercentOb = [];
            let divPercent = [];
            let divPercentLabel = [];

            let payoutRatioOb = [];
            let payoutRatio = [];
            let payoutRatioLabel = [];

            for (var i = 0; i < keys.length; i++) {

                let divs = data[keys[i]].dividendData.filter(element => element.year === 2019);
                let totalDivs = 0;
                divs.forEach(element => totalDivs += element.dividend);
                divPercentOb.push([{
                    name: keys[i],
                    dividend: totalDivs / data[keys[i]].weeklyData[0].close,
                }]);

                employeesOb[data[keys[i]].tickerData.employees] = {
                    name: keys[i],
                    employees: data[keys[i]].tickerData.employees,
                }

                if (data[keys[i]].yearData.length === 1) {
                    continue;
                }

                employeesRevOb.push([{
                    name: keys[i],
                    revenue: (data[keys[i]].yearData[1].Revenue * 1000000) / data[keys[i]].tickerData.employees
                }]);
                let comma = data[keys[i]].tickerData.country === 'USA' ? 1000000 : 1000;
                employeesProOb.push([{
                    name: keys[i],
                    profit: (data[keys[i]].yearData[1].NetIncome * comma) / data[keys[i]].tickerData.employees
                }]);
                marginOb.push([{
                    name: keys[i],
                    margin: data[keys[i]].yearData[1].NetProfitMargin,
                }]);
                cratioOb.push([{
                    name: keys[i],
                    cratio: data[keys[i]].yearData[1].CurrentRatio,
                }]);
                insiderOb.push([{
                    name: keys[i],
                    insider: data[keys[i]].tickerData.insiderStake,
                }]);


                let eps = 0;
                for (var a = 0; a < 1; a++) {
                    if (data[keys[i]].yearData[a].EPSEarningsPerShare) {
                        eps += data[keys[i]].yearData[a].EPSEarningsPerShare;
                    }
                }
                payoutRatioOb.push([{
                    name: keys[i],
                    payoutRatio: totalDivs / eps
                }]);
            }

            employeesRevOb = employeesRevOb.sort(function (a, b) {
                return a[0].revenue - b[0].revenue;
            });

            employeesProOb = employeesProOb.sort(function (a, b) {
                return a[0].profit - b[0].profit;
            });

            marginOb = marginOb.sort(function (a, b) {
                return a[0].margin - b[0].margin;
            });

            cratioOb = cratioOb.sort(function (a, b) {
                return a[0].cratio - b[0].cratio;
            });

            insiderOb = insiderOb.sort(function (a, b) {
                return a[0].insider - b[0].insider;
            });

            divPercentOb = divPercentOb.sort(function (a, b) {
                return a[0].dividend - b[0].dividend;
            });

            payoutRatioOb = payoutRatioOb.sort(function (a, b) {
                return a[0].payoutRatio - b[0].payoutRatio;
            });

            for (let key in employeesOb) {
                employees.push(employeesOb[key].employees)
                employeesLabel.push(employeesOb[key].name);
            }

            for (let key in employeesRevOb) {
                revenue.push((employeesRevOb[key][0].revenue).toFixed(0))
                revenueLabel.push(employeesRevOb[key][0].name);
            }

            for (let key in employeesProOb) {
                profit.push((employeesProOb[key][0].profit).toFixed(0))
                profitLabel.push(employeesProOb[key][0].name);
            }

            for (let key in marginOb) {
                margin.push(marginOb[key][0].margin)
                marginLabel.push(marginOb[key][0].name);
            }

            for (let key in cratioOb) {
                cratio.push(cratioOb[key][0].cratio)
                cratioLabel.push(cratioOb[key][0].name);
            }

            for (let key in insiderOb) {
                insider.push(insiderOb[key][0].insider.toFixed(1))
                insiderLabel.push(insiderOb[key][0].name);
            }

            for (let key in divPercentOb) {
                divPercent.push((divPercentOb[key][0].dividend * 100).toFixed(1));
                divPercentLabel.push(divPercentOb[key][0].name);
            }

            for (let key in payoutRatioOb) {
                payoutRatio.push((payoutRatioOb[key][0].payoutRatio * 100).toFixed(1));
                payoutRatioLabel.push(payoutRatioOb[key][0].name);
            }

            let employeeData = {
                labels: employeesLabel,
                datasets: [
                    {
                        data: employees,
                        label: 'Employees',
                        backgroundColor: 'rgba( 45, 69,113,1)',
                        hoverBackgroundColor: [],
                    }]
            };

            let employeeRevData = {
                labels: revenueLabel,
                datasets: [
                    {
                        data: revenue,
                        label: 'Revenue per Employee (Thousands)',
                        backgroundColor: 'rgba( 45, 69,113,1)',
                        hoverBackgroundColor: [],
                    }]
            };

            let employeeProData = {
                labels: profitLabel,
                datasets: [
                    {
                        data: profit,
                        label: 'Profit per Employee (Thousands)',
                        backgroundColor: 'rgba( 45, 69,113,1)',
                        hoverBackgroundColor: [],
                    }]
            };

            let marginData = {
                labels: marginLabel,
                datasets: [
                    {
                        data: margin,
                        label: 'Profit Margin',
                        backgroundColor: 'rgba( 45, 69,113,1)',
                        hoverBackgroundColor: [],
                    }]
            };

            let cratioData = {
                labels: cratioLabel,
                datasets: [
                    {
                        data: cratio,
                        label: 'Current Ratio',
                        backgroundColor: 'rgba( 45, 69,113,1)',
                        hoverBackgroundColor: [],
                    }]
            };

            let insiderData = {
                labels: insiderLabel,
                datasets: [
                    {
                        data: insider,
                        label: 'Insider ownership',
                        backgroundColor: 'rgba( 45, 69,113,1)',
                        hoverBackgroundColor: [],
                    }]
            };

            let divPercentData = {
                labels: divPercentLabel,
                datasets: [
                    {
                        data: divPercent,
                        label: 'Dividend percent',
                        backgroundColor: 'rgba( 45, 69,113,1)',
                        hoverBackgroundColor: [],
                    }]
            };

            let payoutRatioData = {
                labels: payoutRatioLabel,
                datasets: [
                    {
                        data: payoutRatio,
                        label: 'Payout Ratio',
                        backgroundColor: 'rgba( 45, 69,113,1)',
                        hoverBackgroundColor: [],
                    }]
            };

            let employeeDataOptions = {
                maintainAspectRatio: false,
                responsive: false,
                plugins: {
                    datalabels: {
                        display: true,
                        color: 'black',
                        align: 'end',
                        anchor: 'end',
                    },
                },
            }

            let employeeRevDataOptions = {
                maintainAspectRatio: false,
                responsive: false,
                plugins: {
                    datalabels: {
                        display: true,
                        color: 'black',
                        align: 'end',
                        anchor: 'end',
                    },
                },
            }

            let employeeProDataOptions = {
                maintainAspectRatio: false,
                responsive: false,
                plugins: {
                    datalabels: {
                        display: true,
                        color: 'black',
                        align: 'end',
                        anchor: 'end',
                    },
                },
            }

            let marginDataOptions = {
                maintainAspectRatio: false,
                responsive: false,
                plugins: {
                    datalabels: {
                        display: true,
                        color: 'black',
                        align: 'end',
                        anchor: 'end',
                        formatter: (value, ctx) => {
                            return value + '%';
                        }
                    },
                },
            }

            let cratioDataOptions = {
                maintainAspectRatio: false,
                responsive: false,
                plugins: {
                    datalabels: {
                        display: true,
                        color: 'black',
                        align: 'end',
                        anchor: 'end',

                    },
                },
            }

            let insiderDataOptions = {
                maintainAspectRatio: false,
                responsive: false,
                plugins: {
                    datalabels: {
                        display: true,
                        color: 'black',
                        align: 'end',
                        anchor: 'end',
                        formatter: (value, ctx) => {
                            return value + '%';
                        }
                    },
                },
            }

            let divPercentDataOptions = {
                maintainAspectRatio: false,
                responsive: false,
                plugins: {
                    datalabels: {
                        display: true,
                        color: 'black',
                        align: 'end',
                        anchor: 'end',
                        formatter: (value, ctx) => {
                            return value + '%';
                        }
                    },
                },
            }

            let payoutRatioDataOptions = {
                maintainAspectRatio: false,
                responsive: false,
                plugins: {
                    datalabels: {
                        display: true,
                        color: 'black',
                        align: 'end',
                        anchor: 'end',
                        formatter: (value, ctx) => {
                            return value + '%';
                        }
                    },
                },
            }

            return {
                employeeData: employeeData,
                employeeDataOptions: employeeDataOptions,
                employeeRevData: employeeRevData,
                employeeRevDataOptions: employeeRevDataOptions,
                employeeProData: employeeProData,
                employeeProDataOptions: employeeProDataOptions,
                marginData: marginData,
                marginDataOptions: marginDataOptions,
                cratioData: cratioData,
                cratioDataOptions: cratioDataOptions,
                insiderData: insiderData,
                insiderDataOptions: insiderDataOptions,
                divPercentData: divPercentData,
                divPercentDataOptions: divPercentDataOptions,
                payoutRatioData: payoutRatioData,
                payoutRatioDataOptions: payoutRatioDataOptions
            }


            // return {
            //     selectedCompany: props.selectedCompany,
            //     header: props.selectedCompany.tickerData
            // }
        }
        return false
    }

    render() {
        return (
            <div id='comparePort'>
                <button id="closeComparison" onClick={this.props.closeComparison}>Back</button>
                <div id='compareCharts'>
                    <div className='compareChart'>
                        {<Bar
                            data={this.state.employeeData}
                            width={50}
                            height={39}
                            options={this.state.employeeDataOptions}
                            datasetKeyProvider={this.datasetKeyProvider}
                        />}
                    </div>
                    <div className='compareChart'>
                        {<Bar
                            data={this.state.marginData}
                            width={50}
                            height={39}
                            options={this.state.marginDataOptions}
                            datasetKeyProvider={this.datasetKeyProvider}
                        />}
                    </div>
                    <div className='compareChart'>
                        {<Bar
                            data={this.state.divPercentData}
                            width={50}
                            height={39}
                            options={this.state.divPercentDataOptions}
                            datasetKeyProvider={this.datasetKeyProvider}
                        />}
                    </div>
                    <div className='compareChart'>
                        {<Bar
                            data={this.state.employeeRevData}
                            width={50}
                            height={39}
                            options={this.state.employeeRevDataOptions}
                            datasetKeyProvider={this.datasetKeyProvider}
                        />}
                    </div>
                    <div className='compareChart'>
                        {<Bar
                            data={this.state.cratioData}
                            width={50}
                            height={39}
                            options={this.state.cratioDataOptions}
                            datasetKeyProvider={this.datasetKeyProvider}
                        />}
                    </div>
                    <div className='compareChart'>
                        {<Bar
                            data={this.state.payoutRatioData}
                            width={50}
                            height={39}
                            options={this.state.payoutRatioDataOptions}
                            datasetKeyProvider={this.datasetKeyProvider}
                        />}
                    </div>
                    <div className='compareChart'>
                        {<Bar
                            data={this.state.employeeProData}
                            width={50}
                            height={39}
                            options={this.state.employeeProDataOptions}
                            datasetKeyProvider={this.datasetKeyProvider}
                        />}
                    </div>
                    <div className='compareChart'>
                        {<Bar
                            data={this.state.insiderData}
                            width={50}
                            height={39}
                            options={this.state.insiderDataOptions}
                            datasetKeyProvider={this.datasetKeyProvider}
                        />}
                    </div>

                </div>
            </div>
        )
    }
}

export default PortfolioComparison

