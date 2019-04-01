import React, {Component} from 'react';
import {connect} from 'react-redux'
import '../css/itemOutput.css';
import { addItemToCart } from '../actions'
import {
	Container,
	Row,
	Button, 

} from 'reactstrap'



export class Output_items extends Component{
	constructor(props){
		super(props);
		 
	}
	state = {
		allowNew: false,
		isLoading: false,
		multiple: false,
		options: [],
	};

	addtoCart = (event) =>{
		console.log(event)
	}
	
	
	itemPrinter (){
		// If loading wait
		// If single item, render all info for props.singleitem

		
		if(this.props.loading == false){
			// If multiple items, render all items in props.multipleItems
			if (this.props.multipleItems.length != 0) {
				console.log("rendering multiple items")
				// const renderMultiple = this.props.multipleItems.map((item) => console.log(item.title))

				const renderMultiple = this.props.multipleItems.map((item) => 
				
				
				<div className="contact-card">
					<Container fullHeight style={{"text-align":"center"}}>
						<Row>
							<img style={{width: 150, height: 150}} src={item.imageUrl+".jpeg"}></img>
						</Row>
						<Row>{'$'+item.price +'\n'}</Row>
						<Row>{item.title +'\n'}</Row>
						<Row>
							<Button color="warning"  
								// style={{backgroundColor: '#a9ed4b', color:'#000000'}}
								onClick={() => 
									this.props.addItemToCart(
										{productId:item.productId,usItemId:item.usItemId}
									)
								}>

								add to cart</Button>
						</Row>

						
						 
						
						
					</Container>
 				
 				</div>
				
				
				)
				console.log("Heres the render")
				console.log(renderMultiple)
				return renderMultiple
			}
		}
		else{
			return(<div>loading</div>)
		}



		// if(this.props.apiResult !== undefined){
		// 	return(<div>{this.props.apiResult.result}</div>)
		// }else{
		// 	return(<div>nothing yet</div>)

		// }
	}


	test = () =>{
		console.log("TESTING")
		console.log(this.props)
	}

	render() {
		return (
			<div> 
 				<div className="contacts">{this.itemPrinter()}</div>
				 {/* <div><button onClick={this.test}>testbutton</button></div> */}
			</div>
		);
	  }
}


const mapDispatchToProps = (dispatch) => ({
	addItemToCart: (text) => dispatch(addItemToCart(text)),
})


const mapStateToProps = state => {
 	return {
		apiResult: state.apiResult,
		loading:state.loading,
		singleItem:state.singleItem, 
		multipleItems:state.multipleItems,
	}
}
export default Output_items = connect(mapStateToProps,mapDispatchToProps)(Output_items);
  
   
