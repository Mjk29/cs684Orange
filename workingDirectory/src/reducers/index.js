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
			
			switch (action.searchObj.searchType){
				case "fetchCartItems":
					return{...state }
				case "addItemToCart":
					return{...state }
				case "checkoutItems":
					return{...state }
				default:
					return{
						...state, 
						loading: true
					}
			}
			// if (action.searchObj.searchType == "addItemToCart") {
			// 	return{
			// 		...state
			// 	}
			// }
			// else{
			// 	return{
			// 		...state, 
			// 		loading: true
			// 	}
			// }

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
			console.log("login user action : ")
			console.log(action)
			// localStorage.userEmail = action.userEmail.authEmail
			localStorage.setItem("previouslyLoggedIn", true)
			return{
				...state, 
    			userEmail: action.searchObj.query.authEmail,
    			userHasAuthenticated:true,
			}

		case 'LOGIN_USER_UPDATE_LOCAL_VARS':
			console.log("LOGIN_USER_UPDATE_LOCAL_VARS")
			console.log(action)
			console.log(action.items.affectedRows)
			if (action.items.affectedRows >= 0) {
				return{
					...state,
					// userHasAuthenticated:true,
					// userEmail:
				}
			}
			else{
				return{
					...state,
				}
			}

		case 'CHANGE_USER_LOGIN_WINDOW_STATE':
			console.log("CHANGE_USER_LOGIN_WINDOW_STATE : ")
			console.log(action)
			return{
				...state, 
    			loginWindowState: action.loginState.loginWindowState
			}

		case 'CHANGE_USER_REGISTER_WINDOW_STATE':
			console.log("CHANGE_USER_REGISTER_WINDOW_STATE: ")
			console.log(action)
			return{
				...state, 
    			registerWindowState: action.registerWindowState
			}
		
		case 'TOGGLE_REGISTER_MODAL':
			console.log(state)
			return{
				...state,
				registerWindowState: !state.registerWindowState
		}
			

		case 'TOGGLE_LOGIN_MODAL':
			console.log(state)
			return{
				...state,
				loginWindowState: !state.loginWindowState
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

		case 'FETCHED_CART_ITEMS':
			console.log("FETCHED_CART_ITEMS")
			console.log(action)
			return{
				...state,
				loading:false,
				cartItems:action.items
		}


		case 'CHECKOUT_ITEMS':
			return{
				...state
		}

		case "CONNECT_TO_MASTER_SERVER":
		console.log("CONNECTING TO MASTER SERVER ")
			return{
				...state,
				loading:true
			}
		






		default:
			return state;
	}
};

export default reducer;
