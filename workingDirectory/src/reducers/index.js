const reducer = (state = {}, action) => {
	switch (action.type) {
		// Testing reduers
		case 'GET_NEWS':
			console.log("reducer for getting news")
			return { ...state, loading: true };
		case 'NEWS_RECEIVED':
			console.log("reducer for news received")
			console.log(action.json)
			return { ...state, apiResult: action.json, loading: false };
		case 'GET_ITEMS':
			return { ...state, loading: true };
		case 'GET_ERROR':
			console.log("reducer for get error")
			return { ...state, loading: false };
		case 'RECEIVED_ITEMS':
			return { ...state, items: action.json, loading: false };
		case 'PRINT_ITEMS':
			return {...state}
		case 'SEARCH_TERM':
			return{...state }
		case 'SEARCH_RESULT':
			console.log("heres the reducer for search result")	
			console.log(action)
			return{...state, searchTerm: action.searchResult}
		
	
		// In use reducers
		case 'FETCH_FROM_SERVER':
			console.log("Fetch from server reduer")
			console.log(action)
			if (action.searchObj.searchType == "addItemToCart") {
				return{
					...state
				}
			}
			else{
				return{
					...state, 
					loading: true
				}
			}

		case 'FETCHED_SINGLE_ITEM':
			return{...state, 
				loading: false, 
				singleItem:action, 
				multipleItems:[]
			}

		case 'FETCHED_MULTIPLE_ITMES':
		console.log("heres the action object in fmi")
		console.log(action.items)
			return{...state, 
				loading: false, 
				singleItem:[], 
				multipleItems:action.items
			}

		case 'ADD_ITEM_TO_CART':
			console.log("heres the action object in fmi")
			console.log(action.item)
			console.log(action.item.productId)
			console.log(action.item.usItemId)
			return{
				...state, 
    			cartItems: state.cartItems.concat(action.item)
			}



		case 'LOGIN_USER':
			console.log("login user action : "+action)
			return{
				...state, 
    			userEmail: action.userEmail
			}


		case 'CHANGE_USER_LOGIN_WINDOW_STATE':
			console.log("CHANGE_USER_LOGIN_WINDOW_STATE : ")
			console.log(action)
			return{
				...state, 
    			loginWindowState: action.loginState.loginWindowState
			}

		case 'TOGGLE_LOGIN_MODAL':
			console.log(state)
			return{
				...state,
				loginWindowState: !state.loginWindowState
		}

		case 'LOGIN_USER':
		console.log("HERE IS THE LOGIN USER ACTION")
		console.log(action)
			return{
				...state,
				// userEmail: action.toggleState.loginState
		}

		case 'TOGGLE_CART_MODAL':
			console.log(state)
			return{
				...state,
				cartModalState: !state.cartModalState
		}

		case 'ADD_ENTIRE_ITEM_DATA_TO_CART':
			console.log("HERE IS TE ADD_ENTIRE_ITEM_DATA_TO_CART ")
			console.log(action)
			console.log(action.items[0])
			return{
				...state,
				cartItems:{...state.cartItems, [action.items[0].productId]:2},
				loading:false
				// cartItems[action.items] = 1
				// cartItems: state.cartItems.concat(action.items)

		}

		case 'REMOVE_ITEM_FROM_CART':
			console.log(action)
			return{
				...state
		}

		case 'UPDATE_CART_DISPLAY':
			console.log("UPDATE_CART_DISPLAYUPDATE_CART_DISPLAYUPDATE_CART_DISPLAY")
			return{
				...state,
		}








		default:
			return state;
	}
};

export default reducer;