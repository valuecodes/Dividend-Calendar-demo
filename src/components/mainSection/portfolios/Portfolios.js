import React, { Component } from 'react';
import AddNewPortfolio from './AddNewPortfolio'
import AllPortfolios from './AllPortfolios'

export class Portfolios extends Component {

    constructor() {
        super();
        this.state = {
            addNew: { visibility: 'hidden' },
            current: [],
            showAll: { visibility: 'hidden' }
        };
    }

    addNewPortfolio() {
        // console.log(this.state.addNew.visible)
        if (this.state.addNew.visibility === 'hidden') {
            this.setState({ addNew: { visibility: 'visible' } })
        } else {
            this.setState({ addNew: { visibility: 'hidden' } })
        }
    }

    savePortfolioName(name) {
        this.setState({ addNew: { visibility: 'hidden' } })
        this.setState({ current: { portfolio: name } })
        this.props.createPortfolio(name);
    }

    showAllPortfolios() {
        if (this.state.showAll.visibility === 'hidden') {
            this.setState({ showAll: { visibility: 'visible' } })
        } else {
            this.setState({ showAll: { visibility: 'hidden' } })
        }
    }

    selectPortfolio(name) {
        this.setState({ showAll: { visibility: 'hidden' } });
        let portfolio = this.getPortfolio(name);
        this.setState({ current: portfolio })
        this.props.selectPortfolio(name);
    }

    cancel() {
        this.setState({ addNew: { visibility: 'hidden' } });
    }

    deletePortfolio() {
        ;
        if (this.state.current.name !== undefined) {
            this.props.deletePortfolio(this.state.current.name);
        }
    }

    getPortfolio(name) {
        let portfolios = this.props.allPortfolios;
        let selectPortfolio;
        for (var i = 0; i < portfolios.length; i++) {
            if (portfolios[i].name === name) {
                selectPortfolio = portfolios[i];
            }
        }
        let selectedPortfolio = {
            id: selectPortfolio.id,
            name: selectPortfolio.name,
            tickers: selectPortfolio.tickers
        }
        return selectedPortfolio;
    }

    render() {
        let visibilityState = this.state.showAll.visibility;
        // console.log(this.props);
        return (
            <div className='portfolios'>
                <h2 className='selectedPortfolio'>{this.props.selectedPortfolio}</h2>
                <div className='portfolioButtons'>
                    <button className='portfolioButton' onClick={this.addNewPortfolio.bind(this)}>New</button>
                    <AddNewPortfolio onChange={this.createPortfolio} visibility={this.state.addNew.visibility} savePortfolioName={this.savePortfolioName.bind(this)}
                        createPortfolio={this.state.current} cancel={this.cancel.bind(this)}
                    />
                    <button className='portfolioButton' onClick={this.deletePortfolio.bind(this)}>Delete</button>
                    <button className='portfolioButton' onClick={this.showAllPortfolios.bind(this, this.state.selectedPortfolio)}>All</button>
                </div>
                <div className='allPortfolios' style={{ visibility: visibilityState }}>
                    {this.props.allPortfolios.map(ticker =>
                        <AllPortfolios key={ticker.id} name={ticker.name} selectPortfolio={this.selectPortfolio.bind(this)} deletePortfolio={this.deletePortfolio.bind(this)} />
                    )}
                </div>
            </div>
        )
    }
}

export default Portfolios
