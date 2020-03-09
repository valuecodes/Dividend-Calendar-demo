import React, { Component } from 'react';
import SearchResults from './SearchResults'

export class Search extends Component {
    tickerList=[];
    constructor(){
        super();
        this.state = {
            tickers: [],
            matches: [],
            active:[]
        };
    }
    componentDidMount(){
        // fetch('/tickerList')
        //     .then(res => res.json())
        //     .then(tickers => this.setState({tickers}, () => this.tickerList=tickers));
    }
    searchstocks=(e)=>{
        let matchValues = Object.values(this.tickerList.filter(ticker=>{
            const regex = new RegExp(`^${e.target.value}`,'gi');
            return ticker.name.match(regex) || ticker.ticker.match(regex);
        }))
        if(e.target.value.length===0){
            matchValues=[];
        }
        let create=(matches)=>{
            this.setState({matches});
        }
        create(matchValues);
    }
    clearList(id){ 
        this.setState({active:[id]});
        // this.addTicker(id);
        this.setState({matches:[]});
        this.props.addTicker(id);
    }
    render() {
        return (
            <div className='searchBar'>
                <div className='search'>
                    <input className='searchBox' type='text' name='searchBox' placeholder='Search stocks' autoComplete='off' onChange={this.searchstocks}/>
                </div>
                <div className='results'>
                    {this.state.matches.slice(0,10).map(ticker =>
                        <SearchResults onChange={this.addTicker} key={ticker.id} ticker={ticker.ticker} name={ticker.name} clearList={this.clearList.bind(this)} addTicker={this.state.active}/>
                    )}
                </div>
            </div>
        )
    }
}

export default Search
