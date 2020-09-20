import React, { Component } from 'react';
import './App.css';
import 'bootstrap/dist/css/bootstrap.min.css';
import {
  Container,
  Row,
  Col,
  Spinner
} from 'reactstrap';

import Header from './header/header';
import MainWindow from './mainWindow/mainWindow';
import Sidebar from './sidebar/sidebar';

//Renders 'loading' icon when fetching data externally on first load
function LoadingWindow(){
  return (
    <div id="app" className="centerParent">
      <div className="center">
        <Spinner className="cSpinner" color="primary" size="xl"/>
        <div>loading...</div>
      </div>
    </div>
  );
}


class App extends Component {
  constructor(){
    super();

    this.state = {
      beerListSend : [], //holds array of beers to send to main window
      loading: false, //controls when main loading overlay is found
      searchLoading: false, //passes to searchbar to show if search is being called
      types: [] //holds all types of beers to send to searchbar
    }
  }

  //cart variable, declared outside of state
  cart = [];

  //all prices variable, used in airTable search
  allPrices = [];

  //handles adding items to cart
  add = (obj) =>{
    //catch dupes here!!!
    for(var i = 0; i < this.cart.length; i++){
      if(this.cart[i].name === obj.name && this.cart[i].size === obj.size){
        this.cart[i].qty = parseInt(this.cart[i].qty) + 1;
        return;
      }
    }

    obj.key = this.cart.length;
    this.cart.push(obj);
    this.forceUpdate();
    return;
  }

  //Generates query string for AirTable beer database
  query = (abvMin, abvMax, priceMin, priceMax, type) => {

    //let's do some criteria here!
    var abvMinQ = ((abvMin) ? "{ABV}>" + abvMin : undefined);
    var abvMaxQ = ((abvMax) ? "{ABV}<" + abvMax : undefined);

    var typeQ = ((type && type !== "Everything") ? 'FIND("' + type + '",{Category})' : undefined);

    var priceMinStr = "OR(" + this.allPrices.map(item => "{" + item + "}>" + priceMin).join(", ") + ")"
    var priceMinQ = ((priceMin) ? priceMinStr : undefined);

    var priceMaxStr = "OR(" + this.allPrices.map(item => "{" + item + "}<=" + priceMax).join(", ") + ")"
    var priceMaxQ = ((priceMax) ? priceMaxStr : undefined);

    //now join stuff!
    var query = ((abvMinQ) ? abvMinQ + ",": "");
    query += ((abvMaxQ) ? abvMaxQ + ",": "")
    query += ((priceMinQ) ? priceMinQ + ",": "");
    query += ((priceMaxQ) ? priceMaxQ + ",": "");
    query += ((typeQ) ? typeQ + ",": "");
    query = ((query !== "") ? "AND(" + query + ")": "");

    //might be an edge case w/blank string here
    query = query.slice(0, query.lastIndexOf(",")) + query.slice(query.lastIndexOf(",") + 1, query.length);
    query = "?filterByFormula=" + query;

    this.setState({searchLoading: true});
    this.getBeers(query);
  }

  //general async loader for airtable info
  getBeers = (query) =>{

    const url1 =  'https://api.airtable.com/v0/appHxIrp1Y6u9aDvV/All%20Beer%20Listings' + query;
    const key = 'key7QjuEMdpCZIx8i';

    fetch(url1, {
      headers: {
        Authorization: `Bearer ${key}`
			}
    })
    .then((resp) => resp.json())
    .then((json) => {

      var types = ["Everything"]; //holds all types for the search bar
      var format = json.records.map((item, i) => {
        //accomidates for any amount of quantitiy fields in airtable for beer listings
        var prices = [];
        Object.keys(item.fields).forEach((key) => {
          if(key.includes('gal')){
            prices.push({"size": key, "price": item.fields[key]});
            if(!this.allPrices.includes(key)) this.allPrices.push(key); //this line may be slowing down loading perf...
          }

          if(!types.includes(item.fields.Category[0])) types.push(item.fields.Category[0]);
        });

        if(item.fields.sample) prices.push({"size": "Sample", "Price": 0});

        var result = {
          "key": item.id,
          "name": item.fields.Name,
          "brewer": item.fields.Brewer,
          "contact": item.fields["Contact Email"],
          "style": item.fields.Category[0],
          "longStyle": item.fields["Long Category"],
          "abv": item.fields.ABV,
          "desc": item.fields.Description,
          "price": prices
        }

        return result;
      });

      this.setState({
        beerListSend: format,
        types: types,
        loading: false,
        searchLoading: false
      });

      return;
    })
    .catch((error) => {
      alert(error.message);
      console.log(error);
      throw error;
    });
  }

  //load beer data from airtable on first load...
  componentDidMount(){
    this.setState({loading: true});
    this.getBeers(''); //set loading state to false here!
  }

  render() {
    return (
      <div id="app">
        {(this.state.loading) ? <LoadingWindow/> :
        <Container>
          <Row>
            <Header cart={this.cart}/>
          </Row>
          <Row>
            <Col md="3">
              <Sidebar
                query={this.query}
                categories={this.state.types}
                loading={this.state.searchLoading}
              />
            </Col>
            <Col md="9">
              <MainWindow
                beers={this.state.beerListSend}
                add={this.add}
              />
            </Col>
          </Row>
        </Container>
        }
      </div>
    );
  }
}

export default App;
