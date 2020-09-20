import * as React from 'react';
import './mainWindow.css';
import {
        Container,
        Row
      } from 'reactstrap';
import BeerCard from '../beercard/beerCard';

export default class MainWindow extends React.Component{
  constructor(props){
    super(props);
    this.state = {
      beers: [] //holds all beers displayed
    }
  }

  //puts all beer cards into window
  refresh = () => {
    var beerView = []; //final JSX containing each row
    var beerViewR = []; //holding variable for each row
    var beerList = this.props.beers;

    for(var i = 0; i < beerList.length; i++){
      //Push every third element into a new row
      if(i % 3 === 0){
        beerView.push(<Row key={i}>{beerViewR}</Row>);
        beerViewR = [];
      }

      beerViewR.push(
        <BeerCard
          name={beerList[i].name}
          brewer={beerList[i].brewer}
          longStyle={beerList[i].longStyle}
          abv={beerList[i].abv}
          desc={beerList[i].desc}
          price={beerList[i].price}
          contact={beerList[i].contact}
          add={this.props.add}
          key={beerList[i].key}
        />
      );
    }

    beerView.push(<Row key={beerList.length}>{beerViewR}</Row>);
    return beerView;
  }

  //call function to repopulate window on mount and update 
  componentDidMount(){
    this.refresh();
  }

  componentDidUpdate(){
    this.refresh();
  }

  //move the state to a seperate function...
  render() {
    return (
      <div id="main">
        <Container>
          <Row>
            {
              this.refresh()
            }
          </Row>
        </Container>
      </div>
    )
  };
}
