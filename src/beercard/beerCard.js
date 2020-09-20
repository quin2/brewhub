import * as React from 'react';
import './beerCard.css';
import { Card,
        CardText,
        CardBody,
        CardTitle,
        CardSubtitle,
        Col,
        Dropdown,
        DropdownToggle,
        DropdownMenu,
        DropdownItem
      } from 'reactstrap';

export default class BeerCard extends React.Component{
  constructor(props) {
    super(props);

    this.toggle = this.toggle.bind(this);
    this.state = {
      dropdownOpen: false, //controlls state of price dropdown
      minPrice: 0, //lowest price of beer
      priceList: [] //all prices of all sizes
    };

  }

  //price selection dropdown controller
  toggle() {
    this.setState(prevState => ({
      dropdownOpen: !prevState.dropdownOpen
    }));
  }

  //on mount, find all prices and lowest price of beer
  componentDidMount(){
    var qtys = this.props.price;
    var lowest = qtys[0].price;

    var list = qtys.map((item, i) => {
      if(item.price < lowest) lowest = item.price;

      return (
        <DropdownItem key={i} onClick={this.submit.bind(this)} qty={item.size} price={item.price}>{item.price ? item.size + "- $" + item.price : item.size + "- $0"}</DropdownItem>
      );
    });

    this.setState({
      minPrice: lowest,
      priceList: list
    });
  }

  //handles adding item to cart and passing it up
  submit = (send) => {

    var toSend = {
      "name": this.props.name,
      "size": send.currentTarget.getAttribute('qty'),
      "qty": 1,
      "price": send.currentTarget.getAttribute('price'),
      "contact": this.props.contact
    }

    this.props.add(toSend);

    alert(this.props.name + " - " + send.currentTarget.getAttribute('qty') + " added to cart. You can remove it or change the quantity there.");
  }

  render() {
    return (
      <Col>
        <Card>
          <CardBody>
            <CardTitle className="cardTitle">{this.props.name}</CardTitle>
            <CardTitle className="price"><span>from</span> ${this.state.minPrice}</CardTitle>
            <CardSubtitle className="cardSubtitle">{this.props.brewer}</CardSubtitle>
            <CardSubtitle className="cardSubtitle">{this.props.longStyle}</CardSubtitle>
            <CardSubtitle className="cardSubtitle">{this.props.abv}% ABV</CardSubtitle>
            <CardText>{this.props.desc}</CardText>
            <Dropdown isOpen={this.state.dropdownOpen} toggle={this.toggle}>
              <DropdownToggle caret>
                Add to Cart
              </DropdownToggle>
              <DropdownMenu>
               {this.state.priceList}
              </DropdownMenu>
            </Dropdown>
          </CardBody>
        </Card>
      </Col>
    );
  }
}
