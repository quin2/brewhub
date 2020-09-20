import React from 'react';
import {
  Button,
  Modal,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Table,
  Form,
  Label,
  Input,
  FormGroup
} from 'reactstrap';
import './cartview.css'

export default class CartView extends React.Component {
  constructor(props) {
    super(props);
    this.state = {
      modal: false, //controls when cart overlay is shown
      cartList: [], //contents of cart
      total: 0, //total price of all items in cart
      go: true, //clickabilty of submit button
      contact: '', //form data for contact name
      email: '' //form data for contact email
    };

    this.toggle = this.toggle.bind(this);

    this.handleChange = this.handleChange.bind(this);
  }

  //controller for cart model open/close
  toggle() {
    this.setState(prevState => ({
      modal: !prevState.modal
    }));

    if(!this.state.modal){
      this.updateList();
    }

  }

  //use this to control updates to main list
  //allows updating of a prop without having to tie that prop to the state!
  updateList = () =>{
    var allBeers = [];
    var data = this.props.cart;
    var total = 0;

    for(var i = 0; i < data.length; i++){
      allBeers.push(
        <tr key={i}>
          <th className="rowHead">{data[i].name} - {data[i].size}</th>
          <td>${data[i].price}</td>
          <td><input type="number" value={data[i].qty} id={i} name="points" size="3" min="0" step="1" onChange={this.handleChange}/></td>
          <td>${data[i].price * data[i].qty}</td>
        </tr>
      );

      total += data[i].price * data[i].qty;
    }

    this.checkSubmit();
    this.setState({cartList: allBeers, total: total});
  }

  //used to control the checkout button!
  checkSubmit = () => {
    var enable = (this.props.cart.length > 0) && (this.state.contact !== '') && (this.state.email !== '');
    enable = !enable;

    this.setState({go: enable})
  }

  //called when quantity of items is changed
  handleChange(event) {
    var id = event.currentTarget.getAttribute('id');
    this.props.cart[id].qty = event.target.value;

    if(parseInt(this.props.cart[id].qty, 10) === 0){
      this.props.cart.splice(id, 1); //when qty drops to 0, automatically delete
    }
    this.updateList();
  }

  //checkout here!
  checkout = () => {

    //generate list for each contact
    var mailList = this.groupBy(this.props.cart, 'contact');

    //issue ith var
    for(var i in mailList){
      var email = "";

      for(var j = 0; j < mailList[i].length; j++){
        email += mailList[i][j].qty + "x " + mailList[i][j].size + " kegs of " + mailList[i][j].name + " at $" + mailList[i][j].price + " each\n"
      }

      var data = {
        dest: i,
        beerList: email,
        contact: this.state.email,
        contactName: this.state.contact
      }

      //do a mail here!
      var apiUrl = "https://tvb1h5utoe.execute-api.us-east-1.amazonaws.com/01/contact";
      fetch(apiUrl, {
        method: "POST",
        mode: "cors",
        cache: "no-cache",
        credentials: "same-origin",
        headers: {
          "content-type": "application/json; charset=utf-8"
        },
        body: JSON.stringify(data)
      })
      .then((response) => console.log(response.text()))
      .catch((error) => {
        alert(error.message);
        console.log(error);
        throw error;
      });
    }

    this.toggle();
    alert("Your order(s) were placed. Thanks for using BrewHub!");
  }

  //function to group array by specific key
  groupBy = (xs, key) => {
    return xs.reduce(function(rv, x) {
      (rv[x[key]] = rv[x[key]] || []).push(x);
      return rv;
    }, {});
  };


  contactChange = (event) => {
    if(event.target.value === '') this.setState({go: true});
    else this.checkSubmit();

    this.setState({contact: event.target.value});
  }

  emailChange = (event) => {
    if(event.target.value === '') this.setState({go: true});
    else this.checkSubmit();

    this.setState({email: event.target.value});
  }

  render() {
    return (
      <div>
        <Button className="cartbutton" color="link" onClick={this.toggle}>Cart ({this.props.cart.length})</Button>
        <Modal isOpen={this.state.modal} toggle={this.toggle} className={this.props.className}>
          <ModalHeader toggle={this.toggle}>Cart</ModalHeader>
          <ModalBody>
            <Table>
              <thead>
                <tr>
                  <th>Beer</th>
                  <th>Unit Price</th>
                  <th>Quantity</th>
                  <th>Subtotal</th>
                </tr>
              </thead>
              <tbody>
                {this.state.cartList}
              </tbody>
            </Table>
            <div id="total">Total: ${this.state.total}</div>
          </ModalBody>
          <ModalFooter>
            <div id="allLeft">
            <Form>
              <FormGroup>
                <Label for="examplePassword">Contact Name</Label>
                <Input type="text" name="name" id="name" placeholder="J. Doe" onChange={this.contactChange} value={this.state.contact}/>
              </FormGroup>
              <FormGroup>
                <Label for="exampleEmail">Email</Label>
                <Input type="email" name="email" id="email" placeholder="doe@example.com" onChange={this.emailChange} value={this.state.email}/>
              </FormGroup>
              <Button disabled={this.state.go} color="primary" onClick={this.checkout}>Checkout</Button>
            </Form>

            </div>

          </ModalFooter>
        </Modal>
      </div>
    );
  }
}
