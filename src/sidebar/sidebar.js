import * as React from 'react';
import './sidebar.css';
import {
  Button,
  Form,
  FormGroup,
  Label,
  Input,
  Spinner
} from 'reactstrap';

//fix it so it's not in the form of a form!!!! fuck forms!!!!!

export default class Sidebar extends React.Component{
  constructor(){
    super();
    this.state = { //holds all input parimeters
      abvMin: undefined,
      abvMax: undefined,
      priceMin: undefined,
      priceMax: undefined,
      cat: undefined
    }
  }

  abvMinChange = (event) => {
    this.setState({abvMin: event.target.value});
  }

  abvMaxChange = (event) => {
    this.setState({abvMax: event.target.value});
  }

  priceMinChange = (event) => {
    this.setState({priceMin: event.target.value});
  }

  priceMaxChange = (event) => {
    this.setState({priceMax: event.target.value});
  }

  //bugs out here
  catChange = (event) => {
    this.setState({cat: event.target.value});
    //console.log(event.target.value)
  }

  query = () => {
    this.props.query(this.state.abvMin, this.state.abvMax, this.state.priceMin, this.state.priceMax, this.state.cat);
  }

  clear = () => {
    this.refs.cat.value = "Everything";
    this.refs.abvMin.value = "";
    this.refs.abvMax.value = "";
    this.refs.priceMin.value = "";
    this.refs.priceMax.value = "";

    this.setState({abvMin: undefined});
    this.setState({abvMax: undefined});
    this.setState({priceMin: undefined});
    this.setState({priceMax: undefined});
    this.setState({cat: "Everything"});

    this.props.query(undefined, undefined, undefined, undefined, "Everything");
  }

  render() {
    var searchList = this.props.categories.map((item, i) => {
      return (<option key={i}>{item}</option>);
    });

    return (
      <div id="sidebar">
        <Form>
          <FormGroup>
            <Label for="Category">Category</Label>
            <Input type="select" name="select" id="exampleSelect" value={this.state.cat} ref="cat" onChange={this.catChange}>
              {searchList}
          </Input>
          </FormGroup>

          <FormGroup>
            <Label for="ABV">ABV</Label>
            <div>
              <input type="text" size="3" placeholder="min" value={this.state.abvMin} ref="abvMin" onChange={this.abvMinChange}></input>
              <input type="text" size="3" placeholder="max" value={this.state.abvMax} ref="abvMax" onChange={this.abvMaxChange}></input>
            </div>
          </FormGroup>

          <FormGroup>
            <Label for="Price">Price</Label>
            <div>
              <input type="text" size="3" placeholder="min" value={this.state.priceMin} ref="priceMin" onChange={this.priceMinChange}></input>
              <input type="text" size="3" placeholder="max" value={this.state.priceMax} ref="priceMax" onChange={this.priceMaxChange}></input>
            </div>
          </FormGroup>
        </Form>
        <div id="finish">
          <Button id="go" color="primary" onClick={this.query}>Update {this.props.loading ? <Spinner size="sm"/> : ''}</Button>
          <Button color="link" size="sm" onClick={this.clear}>Reset</Button>
        </div>
      </div>
    )
  };
}
