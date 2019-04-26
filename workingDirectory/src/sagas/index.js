import { put, takeLatest, all } from 'redux-saga/effects';

function* fetchNews() {
	try{
		console.log("FETCHING NEWS")

		const json  = yield fetch('http://192.168.56.102:5687/?GIVE=ITEM')
		.then(response => response.json(), );
		console.log( json)
		yield put({ type: 'NEWS_RECEIVED', json })
		// yield put("NEWS_RECEIVED"(json));
		// console.log(json)
		// yield put({ type: "NEWS_RECEIVED", json: json.articles, });

		// yield call(fetch, 'http://192.168.56.102:5687/?GIVE=ITEM')
		// .then(response => response.json(), );    

		// yield put({ type: "NEWS_RECEIVED", json: json.articles, });
		// yield put({ type: "NEWS_RECEIVED",  });
		// .then (console.log("ass"))
	}
	catch(err){
		console.log("bummer")
		yield put({ type: "GET_ERROR"});
	}
  
}



 
function* getItems(){
	console.log("GETING ITEMS")
	try{
	const json = yield fetch('http://192.168.56.102:5687', {
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
				query:{itemID:"1234567"}
			}),
		})
	    .then(response => response.json(), );
		console.log(json)
		yield put({ type: "RECEIVED_ITEMS", items: json, });
	}
	catch(err){
		console.log("bummer")
		yield put({ type: "POST_ERROR"});
	}


}

function* searchTerm(evt){
	console.log("saga for searchterm")
	console.log(evt)
	console.log(evt.searchTerm)
	// do fetch on searchTerm here

	// let dudes = fetchToServer({
	// 	searchType: "autoCompleteSearchBar",
	// 	query:evt.searchTerm
	// })
	console.log("Here is the returned data")
	// console.log(dudes)




	// put result in searchResult
	yield put({type: "SEARCH_RESULT", searchResult:evt})
}




// function fetchToServer(searchObject){
// 	try{
// 	const json = fetch('http://afsconnect1.njit.edu:5688', {
// 			method: 'POST',
// 			mode: "cors",
// 			dataType: 'jsonp',
// 			credentials: "same-origin", 
// 			headers: {
// 				Accept: 'application/json',
// 				'Content-Type': 'application/json',
// 			},
// 			body: JSON.stringify(searchObject),
// 		})
// 		.then(response => response.json(), );
// 		// console.log("heres the returned hson")
// 		// console.log(json)
// 		return({status:1, items:json })
// 		// yield put({ type: "RECEIVED_ITEMS", items: json, });
// 	}
// 	catch(err){
// 		console.log("bummer")
// 		return({status:0, items:[]})
// 		// yield put({ type: "POST_ERROR"});
// 	}
// }


			// this.props.fetchFromServer({
			// 	query:this.state.userInput, 
			// 	searchType:"multipleItemSearch",
			// 	yieldAction:"FETCHED_MULTIPLE_ITMES"
			// })




export function* fetchFromServer(event){
	// Event = {searchType, query, actionType}
	// Fetch to server with searchType & query
	// yield put actionType & returned adata
	let timer = { time0:0, time1:1, elapsed:0 }
	try{
		
		timer.time0 = Date.now()
		const json = yield fetch('http://afsconnect2.njit.edu:'+localStorage.serverPort, {
			method: 'POST',
			mode: "cors",
			dataType: 'jsonp',
			credentials: "same-origin", 
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				searchType: event.searchObj.searchType,
				query:event.searchObj.query
			}),
		})
		.then(response => response.json());
		
		timer.time1 = Date.now()
		timer.elapsed = (timer.time1 - timer.time0)
		console.log(timer)


		fetch('http://afsconnect2.njit.edu:'+localStorage.dashboardPort, {
			method: 'POST',
			mode: "cors",
			dataType: 'jsonp',
			credentials: "same-origin", 
			headers: {
				Accept: 'application/json',
				'Content-Type': 'application/json',
			},
			body: JSON.stringify({
				searchType: event.searchObj.searchType,
				query:event.searchObj.query,
				timer:timer,
				userEmail:localStorage.userEmail
			}),
		})


		
		yield put({ type: event.searchObj.yieldAction, items: json.rows, });
	}
	catch(err){
		console.log("fetch from server error")
		yield put({ type: "POST_ERROR"});
	}
}


export function* fetchMasterServer(event){
	try{
		yield fetch('https://web.njit.edu/~mjk29/reactMasterServer1.php', {
				method: 'POST',
				mode: "cors",
				credentials: "same-origin", 
				headers: {
					'Content-Type': 'application/json',
				},
				body: JSON.stringify({
					sendID:"reactAppTeamOrange"
				}),
			})
			.then(response => response.json())
			.then(body => {
				console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^6")
				console.log(body)
			})
		}
		catch(err){
				console.log("^^^^^^^^^^^^^^^^^^^^^^^^^^^6")
			yield put({ type: "POST_ERROR"});
		}
}










// 
// WATCHERS
// 

function* printItems(){
	console.log("PRINTING ITEMS")
	yield put({ type: "PRINT_ITEMS"});
}

function* actionWatcher() {
  yield takeLatest('GET_NEWS', fetchNews)
}

function* itemWatcher(){
	yield takeLatest('GET_ITEMS', getItems)
}
function* printWatcher(){
	yield takeLatest('GET_ITEMS', printItems)
}

function* searchWatcher( ){
	yield takeLatest('SEARCH_TERM', searchTerm)
}

function* fetchWatcher( ){
	yield takeLatest('FETCH_FROM_SERVER', fetchFromServer)
}

function* addItemToCartWatcher( ){
	yield takeLatest('ADD_ITEM_TO_CART', fetchFromServer)
}

// function* updateCartDisplayWatcher( ){
// 	yield takeLatest('UPDATE_CART_DISPLAY', fetchFromServer)
// }

function* loginUserWatcher( ){
	yield takeLatest('LOGIN_USER', fetchFromServer)
}

function* removeItemWatcher( ){
	yield takeLatest('REMOVE_ITEM_FROM_CART', fetchFromServer)
}
function* connectToMasterServerWatcher( ){
	yield takeLatest('CONNECT_TO_MASTER_SERVER', fetchMasterServer)
}


export default function* rootSaga( ) {
  yield all([
		actionWatcher(),
		itemWatcher(),
		printWatcher(),
		searchWatcher(),
		fetchWatcher(),
		addItemToCartWatcher(),
		loginUserWatcher(),
		removeItemWatcher(),
		connectToMasterServerWatcher(),
  ]);
}
