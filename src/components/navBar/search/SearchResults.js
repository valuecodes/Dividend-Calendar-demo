import React, { Component } from 'react'

export class SearchResults extends Component {

    render() { 
        return (
            <div className='searchResult' key={this.props.id} onClick={this.props.clearList.bind(this,this.props.ticker)}>
                <p>{this.props.ticker}</p>
                <p>{this.props.name}</p>               
            </div>
        )
    }
}

export default SearchResults
