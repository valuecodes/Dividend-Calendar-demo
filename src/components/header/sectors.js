import React, { Component } from 'react'
import { Spring } from 'react-spring/renderprops';

export class Sectors extends Component {

    constructor() {
        super();
        this.state = {
            sectors: { updated: "", refreshed: '', data: { 'Rank B: 1 Day Performance': {} } },
            selectedTimeFrame: 'Rank B: 1 Day Performance',
            timeIndex: 2,
        };
    }

    componentDidMount() {
        let sectors = getSectorsLocal();
        var d = new Date();
        let day = d.getDate();
        let month = d.getMonth() + 1;
        let year = d.getFullYear();
        let todayKey = day + '.' + month + '.' + year;
        if (sectors === null) {
            this.updateSectors(todayKey);
            console.log('Created sector local storage')
        } else if (todayKey !== sectors.updated) {
            this.updateSectors(todayKey);
            console.log('Updated sector Local Storage')
        } else {
            console.log('Local Storage Sectors is up to date at ' + todayKey)
            this.setState({ sectors: sectors });
        }

    }

    updateSectors(todayKey) {
        fetch('https://www.alphavantage.co/query?function=SECTOR&apikey=demo')
            .then(res => res.json())
            .then(data => {
                let cData = {
                    updated: todayKey,
                    refreshed: data['Meta Data']['Last Refreshed'],
                    data: data
                }
                localStorage.setItem('Sectors', JSON.stringify(cData))
                this.setState({ sectors: cData });
            })
    }

    shouldComponentUpdate(nextProps, nextState) {
        if (JSON.stringify(this.state.sectors) !== JSON.stringify(nextState.sectors) || this.state.selectedTimeFrame !== nextState.timeFrame) {
            return true;
        }
        return false;
    }

    selectSector(timeFrame, index) {

        if (timeFrame === 'scroll') {

            let keys = Object.keys(this.state.sectors.data);
            if (index === '-') {
                index = this.state.timeIndex === 1 ? this.state.timeIndex : this.state.timeIndex - 1
                timeFrame = keys[index];
            } else {
                index = this.state.timeIndex === 10 ? this.state.timeIndex : this.state.timeIndex + 1
                timeFrame = keys[index];
            }

        }
        this.setState({ selectedTimeFrame: timeFrame, timeIndex: index })
    }

    setTimeColor(key) {
        if (this.state.selectedTimeFrame === key) {
            return "rgba(76, 116, 175,0.5)";
        }
        return "";
    }

    setSectorColor(key) {
        if (key[0] === '-') {
            return "rgba(175, 76, 76, 0.541)";
        }
        return "rgba(76, 175, 79, 0.411)";
    }

    render() {
        return (
            <div id='sectorContainer'>
                <div id='sectorHeaders'>
                    <h3 className='sectorHeader'>US Sector Performance</h3>


                    <div id='scrollSectors'>
                        <div className='scrollSectorBox sLeft' onClick={this.selectSector.bind(this, 'scroll', '-')}>
                            <p className='scrollSectorButton left'></p>
                        </div>

                        <h3 id='selectedSectorTimeFrame'>{this.state.selectedTimeFrame.replace(/Performance| Year-to-Date/gi, '').split(': ')[1]}</h3>

                        <div className='scrollSectorBox sRight' onClick={this.selectSector.bind(this, 'scroll', '+')}>
                            <p className='scrollSectorButton right'></p>
                        </div>
                    </div>
                    {/* <div id='selectedSectorTime'>
                        {Object.keys(this.state.sectors.data).map((timeFrame, index) => {
                            if (index >= this.state.timeIndex - 1 && index <= this.state.timeIndex + 1 && index !== 0) {
                                return <p style={{ background: this.setTimeColor(timeFrame) }} onClick={this.selectSector.bind(this, timeFrame, index)} className='sectorTimeHeader' key={index}>{timeFrame.replace(/Performance| Year-to-Date/gi, '').split(': ')[1]}</p>
                            }
                        }
                        )}
                    </div> */}
                    <h4 className='sectorHeader' id='sectorRefreshed'>{this.state.sectors.refreshed}</h4>
                </div>
                <div id='sectorPerformance'>
                    {Object.keys(this.state.sectors.data[this.state.selectedTimeFrame]).map((sector, index) =>
                        <Spring
                            from={{
                                marginTop: -0,
                                transform: `perspective(600px) rotateX(${0}deg)`
                            }}
                            to={{
                                marginTop: 0,
                                transform: `perspective(600px) rotateX(${360}deg)`
                            }}
                            config={{ delay: 50 * index }}
                            key={this.state.selectedTimeFrame + index}
                        >
                            {props => (
                                <div style={props}>
                                    <div className='sectorBox' style={{ background: this.setSectorColor(this.state.sectors.data[this.state.selectedTimeFrame][sector]) }}>
                                        <p className='sectorComp'>{sector}</p>
                                        <p className='sectorComp sectorPercentage'>{this.state.sectors.data[this.state.selectedTimeFrame][sector]}</p>
                                    </div>
                                </div>
                            )}
                        </Spring>
                    )}
                </div>
            </div>
        )
    }
}

export default Sectors

let getSectorsLocal = () => {
    let sectorData = localStorage.getItem('Sectors');
    return JSON.parse(sectorData)
}