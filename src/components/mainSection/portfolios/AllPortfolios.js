import React, { Component } from 'react'

export class AllPortfolios extends Component {
    render() {
        return (
            <div className='portfolioList' onClick={this.props.selectPortfolio.bind(this,this.props.name)}>
                <h4>{this.props.name}</h4>
            </div>
        )
    }
}

export default AllPortfolios
