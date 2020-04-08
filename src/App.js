import React, { Component } from 'react';
import './App.css';
import { NavBar } from './components/navBar/NavBar';
import { Header } from './components/header/Header';
import { Portfolios } from './components/mainSection/portfolios/Portfolios';
import { MainTickerList } from './components/mainSection/MainList/MainTickerList';
import { Calender } from './components/mainSection/calender/calender';
import { ChartSection } from './components/mainSection/chartSection/chartSection';
import { TickerInfoPage } from './components/mainSection/tickerInfoSection/tickerInfoPage';
import { PortfolioComparison } from './components/mainSection/portfolioComparison/portfolioComparison'
import divData from './data'
import { FinancialComparison } from './components/mainSection/financialComparison/financialComparison'

export class App extends Component {
  active = [];
  constructor() {
    super();
    this.state = {
      dividendData: [],
      portfolios: [],
      currentportfolio: [],
      monthStack: [],
      infoPage: 'none',
      portfolioComparison: 'none',
      financialComparison: 'none',
      mainPage: '',
      selectedCompany: null
    };
  }

  componentDidMount() {

    class company {
      constructor(tickerData, weeklyData, yearData, dividendData, insiderData) {
        this.tickerData = tickerData;
        this.weeklyData = weeklyData;
        this.yearData = yearData;
        this.dividendData = dividendData;
        this.insiderData = insiderData;
      }
    }
    let diData={};
    for (var i = 0; i < divData.length; i++) {
      diData[divData[i][0].ticker] = new company(
        divData[i][0],
        divData[i][1],
        divData[i][2],
        divData[i][3],
        divData[i][4],
      );
    }

    let tickers=[
      ['T',50],
      ['JNJ',50],
      ['CCL',50],
      ['ADM',50],
      ['SAMPO',50],
      ['IBM',50],
      ['CSCO',50],
      ['UL',50],
      ['VEDL',50],
      ['XOM',50],
      ['GS',50],
      ['CHL',50],
    ];

    let currentPortfolio={
      id:1,
      name:'My portfolio',
      tickers:tickers,
      isActive:true,
      dividendData:diData
    }
    this.setState({ currentportfolio: currentPortfolio, portfolios: [currentPortfolio],dividendData:diData});

    
    // fetch('http://localhost:3000/portfolioList')
    //   .then(res => res.json())
    //   .then(portfolios => {
    //     let list = [];
    //     for (var i = 0; i < portfolios.length; i++) {
    //       let data = portfolios[i].stocks.split(',');
    //       let array = [];
    //       for (var j = 0; j < data.length - 1; j += 2) {
    //         array.push([data[j], data[j + 1]]);
    //       }
    //       list.push({
    //         id: portfolios[i].id,
    //         name: portfolios[i].name,
    //         tickers: array,
    //         isActive: portfolios[i].isActive
    //       })
    //     }
    //     if (list.length === 0) {
    //       this.createPortfolio('My portfolio')
    //     } else {
    //       this.setState({ portfolios: list });
    //       // this.selectPortfolio(list[0].name)

    //     }
    //     let activeList = [];
    //     for (var a = 0; a < list.length; a++) {
    //       for (var b = 0; b < list[a].tickers.length; b++) {
    //         if (!activeList.includes(list[a].tickers[b][0])) {
    //           activeList.push(list[a].tickers[b][0]);
    //         }
    //       }
    //     }
    //     if (activeList.length > 0) {
    //       this.addDividendData(activeList, []);
    //     }
    //   })
  }

  addTicker(id, shares) {
    let current = this.state.portfolios.filter(portfolio => portfolio.isActive === true);
    if (this.state.currentportfolio.name) {
      if (shares === undefined) {
        shares = 0;
      }
      let tickerFound = false;
      for (var i = 0; i < this.state.currentportfolio.tickers.length; i++) {
        if (this.state.currentportfolio.tickers[i][0] === id) {
          tickerFound = true;
        }
      }
      if (!tickerFound) {
        // Add ticker to portfolio (name,shares)
        let newTicker = [id, shares];
        current[0].tickers.push(newTicker);
        let portfolios = this.state.portfolios.map(portfolio => portfolio.isActive === true ? portfolio = current[0] : portfolio)
        this.savePortfolioToDB(current[0]);
        this.addDividendData([id], current[0], portfolios);
      } else {
        this.savePortfolioToDB(current[0]);
        let portfolios = this.state.portfolios.map(portfolio => portfolio.isActive === true ? portfolio = current[0] : portfolio)
        this.setState({ currentportfolio: current[0], portfolios: portfolios });
      }
    }
  }

  deleteTicker(id) {
    for (var i = 0; i < this.state.currentportfolio.tickers.length; i++) {
      if (this.state.currentportfolio.tickers[i][0] === id) {
        let updated = this.state.currentportfolio;
        updated.tickers.splice(i, 1);
        this.setState({ currentportfolio: updated });
        this.savePortfolioToDB(updated);
      }
    }

  }

  addShares(ticker, count) {
    let amount = count.target.value === '' ? 0 : count.target.value;
    let current = this.state.currentportfolio.tickers;
    for (var i = 0; i < current.length; i++) {
      if (current[i][0] === ticker) {
        current[i][1] = amount;
        break;
      }
    }
    let updated = this.state.currentportfolio;
    updated.tickers = current;
    this.setState({ currentportfolio: updated });
    this.savePortfolioToDB(updated);
  }

  createPortfolio(e) {
    let newId;
    if (this.state.portfolios.length === 0) {
      newId = 0
    } else {
      newId = (this.state.portfolios[this.state.portfolios.length - 1].id) + 1;
    }
    let newPortfolio = {
      id: newId,
      name: e,
      tickers: [],
      isActive: false
    }

    this.setState({ portfolios: [...this.state.portfolios, newPortfolio] });
    // Save to database
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
      body: JSON.stringify(newPortfolio)
    }
    fetch('http://localhost:3000/createPortfolio', options)
      .then(res => res.json());
    // .then(this.selectPortfolio(e));

  }

  selectPortfolio(name) {
    let portfolios = this.state.portfolios;
    portfolios.forEach(portfolio => portfolio.name === name ? portfolio.isActive = true : portfolio.isActive = false);
    let selected = portfolios.filter(portfolio => portfolio.name === name);
    this.setState({ currentportfolio: selected[0] });
  }

  deletePortfolio(name) {
    let portfolio = this.getPortfolio(name);
    let updated = this.state.portfolios.filter(item => item.id !== portfolio.id);
    this.setState({ portfolios: updated });
    this.setState({ currentportfolio: [] })

    // Delete from database
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
      body: JSON.stringify({ id: portfolio.id })
    }
    fetch('http://localhost:3000/deletePortfolio', options)
      .then(res => res.json())
      .then(message => console.log(message));
  }

  getPortfolio(name) {
    let portfolios = this.state.portfolios;
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

  addDividendData(tickers, currentPortfolio, allPortfolios) {
    if (this.state.dividendData[tickers] === undefined) {
      let data = { data: tickers };
      const options = {
        method: 'POST',
        headers: {
          'Content-Type': "application/json;charset=UTF-8"
        },
        body: JSON.stringify(data)
      }
      fetch('http://localhost:3000/getDividendData', options)
        .then(res => res.json())
        .then(dbData => {
          let divData = this.state.dividendData;
          class company {
            constructor(tickerData, weeklyData, yearData, dividendData, insiderData) {
              this.tickerData = tickerData;
              this.weeklyData = weeklyData;
              this.yearData = yearData;
              this.dividendData = dividendData;
              this.insiderData = insiderData;
            }
          }
          for (var i = 0; i < dbData.data.length; i++) {
            divData[dbData.data[i][0].ticker] = new company(
              dbData.data[i][0],
              dbData.data[i][1],
              dbData.data[i][2],
              dbData.data[i][3],
              dbData.data[i][4],
            );
          }
          if (!Object.keys(this.state.currentportfolio).length === true) {
            let portfolios = this.state.portfolios;
            portfolios.forEach(portfolio => {
              portfolio.dividendData = divData;
            });
            portfolios[0].isActive = true;
            this.setState({ currentportfolio: this.state.portfolios[0], portfolios: portfolios });
          } else {
            currentPortfolio.dividendData = divData;
            this.setState({ currentportfolio: currentPortfolio, portfolios: allPortfolios });
          }
        });
    }
  }

  savePortfolioToDB(updated) {
    const options = {
      method: 'POST',
      headers: {
        'Content-Type': "application/json;charset=UTF-8"
      },
      body: JSON.stringify(updated)
    }
    fetch('http://localhost:3000/savePortfolio', options)
      .then(res => res.json())
      .then(message => console.log(message));
  }

  setMonthStack(data) {
    if (JSON.stringify(this.state.monthStack) !== JSON.stringify(data) && Object.keys(data).length) {
      this.setState({ monthStack: data });
    }
  }

  showTickerInfo(ticker) {
    this.setState({ mainPage: 'none', infoPage: '', portfolioComparison: 'none', financialComparison: 'none', selectedCompany: this.state.dividendData[ticker] });
  }

  changeMainPage(type) {
    console.log(type);

    this.setState({
      mainPage: type === 'mainPage' || type === 'stats' || type === 'calender' ? '' : 'none',
      calender: type === 'mainPage' || type === 'calender' ? '' : 'none',
      stats: type === 'stats' ? '' : 'none',
      infoPage: type === 'infoPage' ? '' : 'none',
      portfolioComparison: type === 'portfolioComparison' ? '' : 'none',
      financialComparison: type === 'financialComparison' ? '' : 'none',
      selectedCompany: null
    });
  }

  render() {
    return (
      < div className="App" >
        <header className="App-header">
          <Header />
          <NavBar addTicker={this.addTicker.bind(this)} comparison={this.changeMainPage.bind(this, 'portfolioComparison')} financialComparison={this.changeMainPage.bind(this, 'financialComparison')} monthStack={this.state.monthStack} />
          <div className='mainSection' >
            <div className='mainList'>
              <Portfolios createPortfolio={this.createPortfolio.bind(this)} allPortfolios={this.state.portfolios} selectPortfolio={this.selectPortfolio.bind(this)} selectedPortfolio={this.state.currentportfolio.name} deletePortfolio={this.deletePortfolio.bind(this)} />
              <MainTickerList onChange={this.currentportfolio} tickers={this.state.currentportfolio.tickers} deleteTicker={this.deleteTicker.bind(this)} addShares={this.addShares.bind(this)} showTickerInfo={this.showTickerInfo.bind(this)} />
            </div>
            <div className='tickerInfoSection' style={{ display: this.state.infoPage }} >
              <TickerInfoPage closeInfoPage={this.changeMainPage.bind(this, 'mainPage')} selectedCompany={this.state.selectedCompany} />
            </div>
            <div id='portfolioComparison' style={{ display: this.state.portfolioComparison }}>
              <PortfolioComparison selectedCompany={this.state.selectedCompany} closeComparison={this.changeMainPage.bind(this, 'mainPage')} portfolio={this.state.currentportfolio} state={this.state.portfolioComparison} />
            </div>
            <div id='financialComparison' style={{ display: this.state.financialComparison }}>
              <FinancialComparison closeComparison={this.changeMainPage.bind(this, 'mainPage')} portfolio={this.state.currentportfolio} state={this.state.financialComparison} />
            </div>
            <div style={{ display: this.state.calender }}>
              <Calender currentportfolio={this.state.currentportfolio} setMonthStack={this.setMonthStack.bind(this)} />
            </div>
            <div id='portfolioStatistics' style={{ display: this.state.stats }}>
              {/* <GeoChart portfolio={this.state.currentportfolio} /> */}
            </div>
          </div>
          <div style={{ display: this.state.mainPage }}>
            <ChartSection monthStackData={this.state.monthStack} allData={this.state.dividendData} portfolio={this.state.currentportfolio} changeMainPage={this.changeMainPage.bind(this)} />
          </div>
        </header>
      </div >
    )
  }
}

export default App;