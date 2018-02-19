import React, { Component } from 'react';
import './App.css';

const API_URL = '/api/v1/car/';
class App extends Component {
  constructor() {
    super();
    this.state = { 
      cars: [],
      currentPage: 1,
      carsPerPage: 10,
      numberOfItems: 0,
      startIndex: 0,
      id: null,
      name: '',
      year: null,
      acceleration: null,
      mpg: null,
      cylinders: null,
      displacement: null,
      horsepower: null,
      weight: null, 
      options: [10,20,30,40,50]
    };
    /////////////////////////

    this.handleClick = this.handleClick.bind(this);
    this.handleSubmit = this.handleSubmit.bind(this);
    this.handleIdChange = this.handleIdChange.bind(this);
    this.handleNameChange = this.handleNameChange.bind(this);
    this.handleCylindersChange = this.handleCylindersChange.bind(this);
    this.handleDisplacementChange = this.handleDisplacementChange.bind(this);
    this.handleAccelerationChange = this.handleAccelerationChange.bind(this);
    this.handleWeightChange = this.handleWeightChange.bind(this);
    this.handleHorsePowerChange = this.handleHorsePowerChange.bind(this);
    this.handleMPGChange = this.handleMPGChange.bind(this);
    this.handleYearChange = this.handleYearChange.bind(this);
    this.handleSelect = this.handleSelect.bind(this);
    this.getData = this.getData.bind(this);
    this.getNumberOfItems = this.getNumberOfItems.bind(this);
    this.getOptions = this.getOptions.bind(this);
  }
////////////////////////
  //create select list to choose how many items must be displayed on the page
  getOptions() {
    return this.state.options.map(function(item){
      return <option key={item} value={item}>{item}</option>;
    });
  }
 
  handleSelect(event) {
    this.setState({carsPerPage: event.target.value});
    //wait until carsPerPage is initialized
    setTimeout(() => {
        //refresh items list on the page when choosing new number of cars per page
        this.getData(this.state.startIndex, this.state.carsPerPage);
    },500);
  }

  handleMPGChange(event) {
      this.setState({
          mpg: event.target.value
      });
  }

  handleHorsePowerChange(event) {
    this.setState({
      horsepower: event.target.value
    });
  }
  handleWeightChange(event) {
    this.setState({
      weight: event.target.value
    });
  }
  handleYearChange(event) {
    this.setState({
      year: event.target.value
    });
  }
  handleAccelerationChange(event) {
    this.setState({
      acceleration: event.target.value
    });
  }
  handleDisplacementChange(event) {
    this.setState({
      displacement: event.target.value
    });
  }
  handleCylindersChange(event) {
    this.setState({
      cylinders: event.target.value
    });
  }
  handleIdChange(event) {
    this.setState({
      id: event.target.value
    });
  }
  handleNameChange(event) {
    this.setState({
      name: event.target.value
    });
  }
  handleSubmit(e) {
    e.preventDefault();  
    var objects = {
        name: this.state.name,
        cylinders: this.state.cylinders,
        displacement: this.state.displacement,
        horsepower: this.state.horsepower,
        weight: this.state.weight,
        acceleration: this.state.acceleration,
        mpg: this.state.mpg,
        year: this.state.year
        }
    
      fetch(API_URL + this.state.id + '/', {
          method: 'PUT',
          credentials: 'same-origin',
          body: JSON.stringify(objects),
          headers: {
              'Content-Type': 'application/json'
          }
      }) 
      .then(response => {
        response.json();
        this.getData(this.state.startIndex, this.state.carsPerPage);
        console.log("response");
      })
      .catch((error)=>{
        console.log("error: ",error.message);
      });
  };
  
  getNumberOfItems() {
      fetch(API_URL + '?format=json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.setState({
        numberOfItems: data.meta.total_count
      });
    });
  }

  //get the list of items to be displayed on a page
  getData(startIndex, carsPerPage) {
    fetch(API_URL + '?offset=' + startIndex + '&limit=' + carsPerPage + '&format=json')
    .then((response) => {
      return response.json();
    })
    .then((data) => {
      this.setState({
        cars: data.objects,
      });
    });
  }

  componentWillMount() {
    this.getNumberOfItems();
    this.getData(this.state.startIndex, this.state.carsPerPage);
  }

  handleClick(event) {
    this.setState({
      currentPage: Number(event.target.id),
      startIndex: this.state.carsPerPage * Number(event.target.id - 1)
    });
    this.getData(this.state.startIndex, this.state.carsPerPage);
  }
  
  render() {
    const {cars, currentPage, carsPerPage, numberOfItems} = this.state;

		const currentCars = this.state.cars;
    const renderCars = currentCars.map((car, index) => {
			return (<tr key={index}>
						<td>{car.id}</td>
						<td>{car.name}</td>
            <td>{car.year}</td>
						<td>{car.acceleration}</td>
						<td>{car.mpg}</td>
            <td>{car.cylinders}</td>
            <td>{car.displacement}</td>
            <td>{car.horsepower}</td>
            <td>{car.weight}</td>
					</tr>);
		});

    //find out the number of the pages
    const pageNumber = [];
    for(var i=1; i<= Math.ceil(numberOfItems/carsPerPage);i++) {
      pageNumber.push(i);
    } 

    //display page numbers
		const renderPageNumbers = pageNumber.map(number => {
			return (<li className="listItem" key={number} id={number} onClick={this.handleClick}> {number} </li>);
    });
    
    return (
    	<div className="page-list">
         <span>
          <label>cars per page: </label>
          <select onChange={this.handleSelect}>{this.getOptions()}
          </select>
        </span><br/><br/>
				<table> 
          <tr className="header-items">
            <td >Id</td>
            <td>Name</td>
            <td>Year</td>
            <td>Acceleration</td>
            <td>MPG</td>
            <td>Cylinders</td>
            <td>Displacement</td>
            <td>Horsepower</td>
            <td>Weight</td>
          </tr>
          <tbody>
            {renderCars}
          </tbody>
				</table>
				<ul id="pageNumberStyle">{renderPageNumbers}</ul>
        <br/>
        <form onSubmit={this.handleSubmit}>
          <label>Id</label><br/>
          <input type="number" min="1" max="406" name="id" value={this.state.id} onChange={this.handleIdChange}/><br/>
          <label>Name</label><br/>
          <input type="text" name="name" value={this.state.name} onChange={this.handleNameChange}/><br/>
          <label>Cylinders</label><br/>
          <input type="number" min="1" max="20"  name="cylinders" value={this.state.cylinders}  onChange={this.handleCylindersChange}/><br/>
          <label>Displacement</label><br/>
          <input type="number" min="1" max="1000" name="displacement" value={this.state.displacement}  onChange={this.handleDisplacementChange}/><br/>
          <label>Horsepower</label><br/>
          <input type="number" min="50" max="1000" name="horsepower" value={this.state.horsepower}  onChange={this.handleHorsePowerChange}/><br/>
          <label>Weight</label><br/>
          <input type="number" min="1000" max="20000" name="weight" value={this.state.weight}  onChange={this.handleWeightChange}/><br/>
          <label>Acceleration</label><br/>
          <input type="number" min="1" max="20" step="any" name="acceleration" value={this.state.acceleration}  onChange={this.handleAccelerationChange}/><br/>
          <label>MPG</label><br/>
          <input type="number" min="1" max="20" step="any" name="mpg" value={this.state.mpg}  onChange={this.handleMPGChange}/><br/>
         
          <label>Year</label><br/>
          <input type="number" min="30" max="99" name="year" value={this.state.year}  onChange={this.handleYearChange}/>
          <br/>
          <input type="submit" value="Submit" />
        </form>
      </div>
    );
  }
}

export default App;
