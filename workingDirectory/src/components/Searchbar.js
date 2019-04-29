import React, { Component } from 'react';
// import IntegrationAutosuggest from './autoCompleteBar';
// import {asyncContainer, Typeahead} from 'react-bootstrap-typeahead';
import { AsyncTypeahead } from 'react-bootstrap-typeahead';
import { connect } from 'react-redux';
import { searchTerm, fetchFromServer } from '../actions'
// import { bindActionCreators } from 'redux'


export class Searchbar extends Component {
	constructor(props){
		super(props);
		this.state = {
			response: false,
			searchInput:"",
		};
		this.queryResponse = []
		this.autoCompleteResponse = []
	}
	state = {
		allowNew: false,
		isLoading: false,
		multiple: false,
		options: [],
	};

	// get full item info
	itemSearch = () => {
		this.props.triggerParentUpdate(this.state.singleItemInfo)
		console.log(this.state.selected[0].productId)
		
		fetch('http://afsconnect1.njit.edu:5688/', {
			method: 'POST',
			mode: "cors",
			dataType: 'jsonp',
			credentials: "same-origin", 
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				searchType: "fullItemInfo",
				query:{
					productId : this.state.selected[0].productId,
					usItemId : this.state.selected[0].usItemId,
				}
			}),
		})
		.then((response) => {
			return response.json() 
		})

		.then((responseData) => { 
			console.log(responseData);
			// return responseData			
			this.setState({singleItemInfo : responseData})
			this.setState({isLoading : false})
		})
 
		.catch(function(err) {
			console.log(err);
		})

	}


	// handleChange = () => {
	// 	this.setState({
	// 		query: this.search.value
	// 	})
	// 	if (this.search.value.length >= 3) {
 	// 		this.fetchfunction()
	// 	}
		
	// }
	fetchfunction = (query) => {

		console.log("Here is the query: " +query)
		console.log("fetch function")
		fetch('http://afsconnect1.njit.edu:5688/', {
			method: 'POST',
			mode: "cors",
			dataType: 'jsonp',
			credentials: "same-origin", 
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				searchType: "autoCompleteSearchBar",
				query : query,
			}),
		})
		.then((response) => {
			return response.json() 
		})

		.then((responseData) => { 
			console.log(responseData);
			// return responseData			
			this.setState({options : responseData.rows})
			console.log(this.state.options)
			this.setState({isLoading : false})
		})
		.catch(function(err) {
			console.log(err);
		})
	}
	_handleSearch = (query) => {
		console.log("handling searchj")
		this.setState({isLoading: true});
		this.fetchfunction(query)
	}

	onKeyDown =(event) =>{
		console.log("keydown")
		console.log(event.key)
		console.log(this.state.userInput )
		if(event.key === "Enter"){
			// console.log("ENTER PRESSED")
			// this.itemSearch()
			// console.log(this.state )
			// console.log(this.props.searchTerm)
			// console.log(this.props.searchTerm)
			// console.log(this.props)
			this.props.fetchFromServer({
				query:this.state.userInput, 
				searchType:"multipleItemSearch",
				yieldAction:"FETCHED_MULTIPLE_ITMES"
			})
			// dispatch(this.props.searchTerm)
		}
	} 

	
	checkState=(evt)=>{
		console.log("Checking state")
		console.log( evt)
	}
 
	render() {
		return (
			<div>
 				<AsyncTypeahead
					{...this.state}
					labelKey="title"
					// idKey="productid"
					isLoading={this.state.isLoading}
					minLength={3}
					onInputChange={(evt) => this.setState({userInput:evt})}
					onSearch={this._handleSearch}
					// onChange={(selected) => this.setState({selected})}
					
					onKeyDown={this.onKeyDown}
				/>
			</div>
		);
	}
}
// export default Searchbar;


const mapDispatchToProps = (dispatch) => ({
	// return bindActionCreators({ searchTerm }, dispatch)
	searchTerm: (text) => dispatch(searchTerm(text)),
	fetchFromServer: (text) => dispatch(fetchFromServer(text)),
})

const mapStateToProps = state => {
	return {
	   apiResult: state.apiResult,
	   loading:state.loading
   }
}

Searchbar = connect(mapStateToProps,mapDispatchToProps)(Searchbar);
export default Searchbar;