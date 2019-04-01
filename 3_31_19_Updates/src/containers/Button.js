import React from 'react';
import { connect } from 'react-redux';
import { getNews, getItems, printItems } from '../actions'
import { strictEqual } from 'assert';
import {Output_items} from '../components/itemOutput.js'


class Button extends React.Component {
	constructor(props) {
		super(props);
		// this.state = { hover: false };
	}

	printItems( ){
		// var ass = dispatch("PRINT_ITEMS")
		console.log("1currentState")
	}


	render() {
		return (
			<div>
			<button onClick={this.props.getNews}>Press to see News</button>
			<button onClick={this.props.printItems}>Press to see printItems</button>
			
			<Output_items />
			<div>11111</div>
			</div>
	);
}

};

const mapDispatchToProps = {
  getNews: getNews, 
  getItems: getItems,
  printItems:printItems,
 };

Button = connect(
  null,
  mapDispatchToProps,
)(Button);

export default Button;
