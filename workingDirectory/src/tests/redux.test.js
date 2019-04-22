import reducers from '../reducers';
import moxios from 'moxios';
import { testStore } from './testStore.js';
import { fetchFromServer } from './../actions';
import createSagaMiddleware from 'redux-saga';
import { createStore, applyMiddleware, compose } from 'redux';
import rootSaga from '../sagas';
import { call } from 'redux-saga/effects';
import {fetchFromServer as sagaFetch} from '../sagas';
import fetcherFunction from './fetchFunction';



const sagaMiddleware = createSagaMiddleware();
const composeEnhancers = window.__REDUX_DEVTOOLS_EXTENSION_COMPOSE__ || compose;

const store = createStore(
	reducers,
	{
		loading:false,
		singleItem:[], 
		multipleItems:[],
		cartItems:{},
		userEmail:"admin@example.com",
		loginWindowState:false,
		cartModalState:false,
		userHasAuthenticated:false,
		previouslyLoggedIn:false,


	},
	composeEnhancers(
		applyMiddleware(sagaMiddleware)
	)
);


sagaMiddleware.run(rootSaga);


// describe('fetch HaloCE:Anniversary action', () => {
//     beforeEach(() => {
//         moxios.install();
//     });

//     afterEach(() => {
//         moxios.uninstall();
//     });

//     test('Store is updated correctly', () => {

//         const expectedState = {loading:false,singleItem:[],multipleItems:[{productId:'5DVWGTJVZB5U',usItemId:'23109097',title:'Cokem International Preown 360 Halo: Combat Evolved Anniv',imageUrl:'https://i5.walmartimages.com/asr/14eb2b8a-33cb-420c-8335-8e26e2ca986d_1.7c2e3255780b9b18c05845982cac',price:37.17}],cartItems:[{productID:'5DVWGTJVZB5U',usItemId:'23109097',quantity:5,price:37.17,imageUrl:'https://i5.walmartimages.com/asr/14eb2b8a-33cb-420c-8335-8e26e2ca986d_1.7c2e3255780b9b18c05845982cac',title:'Cokem International Preown 360 Halo: Combat Evolved Anniv'},{productID:'5F1ZKWBM335T',usItemId:'50340169',quantity:1,price:79.88,imageUrl:'https://i5.walmartimages.com/asr/3379e659-998b-4977-b8d2-4519549cda0d_1.4466f550a573489275657f2712da',title:'1/4 Carat T.W. Diamond Sterling Silver Halo Stud Earrings'}],userEmail:'admin@example.com',loginWindowState:false,cartModalState:false,userHasAuthenticated:false,previouslyLoggedIn:false};
//         const store = testStore();

//         moxios.wait(() => {
//             const request = moxios.requests.mostRecent();
//             request.respondWith({
//                 status: 200,
//                 response: expectedState
//             })
//         });

//         const testData = {
// 				query:"Cokem International Preown 360 Halo: Combat Evolved Anniv", 
// 				searchType:"multipleItemSearch",
// 				yieldAction:"FETCHED_MULTIPLE_ITMES"
// 			}
// 	store.dispatch(fetchFromServer(testData))
//         // return store.dispatch(fetchFromServer(testData))
//         // .then(() => {
//         //     const newState = store.getState();
//         //     expect(newState.posts).toBe(expectedState);
//         // })
        
//     });

// });



describe('call test', () => {
	test('test1', () =>{

		const testData2 = {
				query:"Cokem International Preown 360 Halo: Combat Evolved Anniv", 
				searchType:"multipleItemSearch",
				yieldAction:"FETCHED_MULTIPLE_ITMES"
			}

		const ass = fetcherFunction(testData2)
		console.log('here is the return')
		console.log(ass)


	})
	

})






// it('sqltest', () =>{

// 	function* fetchFromServer(event){
// 		// Event = {searchType, query, actionType}
// 		// Fetch to server with searchType & query
// 		// yield put actionType & returned adata
// 		console.log("fetch fqrom server function")
// 		console.log(event)
// 		try{
// 			const json = yield fetch('http://afsconnect1.njit.edu:5688', {
// 					method: 'POST',
// 					mode: "cors",
// 					dataType: 'jsonp',
// 					credentials: "same-origin", 
// 					headers: {
// 						Accept: 'application/json',
// 						'Content-Type': 'application/json',
// 					},
// 					body: JSON.stringify({
// 						searchType: event.searchObj.searchType,
// 						query:event.searchObj.query
// 					}),
// 				})
// 				.then(response => response.json(), );
// 				console.log("FETCHED FROM SDERVER")
// 				console.log(json)
// 				console.log("FETCHED FROM SDERVER")
// 				yield put({ type: event.searchObj.yieldAction, items: json, });
// 			}
// 			catch(err){
// 				console.log("fetch from server error")
// 				yield put({ type: "POST_ERROR"});
// 			}


// searchObj={
// 		query:"hawlo",
// 		searchType: "multipleItemSearch",
// 		yieldAction: "FETCHED_MULTIPLE_ITMES"
// 	}
// 	fetchFromServer(searchObj)


// }
// })




 
// test('initState', () => {
//   let state;
//   state = reducers({
//   	loading:false,
//   	singleItem:[],
//   	multipleItems:[],
//   	cartItems:{},
//   	userEmail:'',
//   	loginWindowState:false,
//   	cartModalState:false,
//   	userHasAuthenticated:false
//   }, {});
 
//   expect(state).toEqual({
//   	loading:false,
//   	singleItem:[],
//   	multipleItems:[],
//   	cartItems:{},
//   	userEmail:'',
//   	loginWindowState:false,
//   	cartModalState:false,
//   	userHasAuthenticated:false
//   });
// });


// test('HaloSearchTest', () => {
//   let state;
//   state = reducers({loading:true,singleItem:[],multipleItems:[],cartItems:[],
//     userEmail:'v9s0wxd4df5zxs6zy4es',loginWindowState:false,cartModalState:false,userHasAuthenticated:false}, 
//     {type:'FETCHED_MULTIPLE_ITMES',items:[{productId:'0X05G70V1HHA',usItemId:'55002760',title:'Personalized Women\'s Half Halo Classic Style Ring Guard',imageUrl:'https://i5.walmartimages.com/asr/0fa94246-63c1-4fe1-9d53-b2ba97503851_1.0ce5915987d144a47e4f69e13ce2',price:69},{productId:'6E5V7EQ881OP',usItemId:'957192490',title:'2-3/4 Carat T.G.W. Ethiopian Opal and 1/10 Carat T.W. Diamond 14kt Rose Gold Beaded Halo Ring',imageUrl:'https://i5.walmartimages.com/asr/99209050-ead3-45ba-b6bc-79fc4d884d78_1.90949feaaf2a909bd4cc84312d50',price:908},{productId:'59A4XCHTLC3N',usItemId:'240121636',title:'for 08-11 subaru impreza / wrx pair of bumper halo ring fog lights+ccfl power inverter (smoked lens)',imageUrl:'https://i5.walmartimages.com/asr/bceecf99-3336-47dd-b16a-929039bd60d9_1.e7749e2633e41e8cfe8b294dbd31',price:73.88},{productId:'55PSFRA9YRFK',usItemId:'44900259',title:'Halo Master Chief Classic Muscle Child Halloween Costume',imageUrl:'https://i5.walmartimages.com/asr/e987cb5c-a822-419c-8b50-8cb01f6fe5cd_1.9cbcf82f990c8e923732226ff91f',price:25.02},{productId:'4ES5ZX9L60DL',usItemId:'9919881',title:'Halo Sleepsack Wearable Blanket',imageUrl:'https://i5.walmartimages.com/asr/b4a7a932-1811-490f-9945-207ea97bec0b_1.6a612a2c40fc9ecd9c6b087dadad',price:21.99},{productId:'464LHUHF38V5',usItemId:'389939433',title:'for 05-10 dodge avenger/charger/challenger/chrysler sebring halo ring fog lights+switch+ccfl power i',imageUrl:'https://i5.walmartimages.com/asr/6f65829d-b640-4b64-985b-6a0576ecda8c_1.32a0156c5317554a53dba5a28741',price:77.88},{productId:'44KTSNAXV2BP',usItemId:'55002603',title:'Personalized Women\'s Round-Shaped Classic Style Halo Wedding Ring Guard',imageUrl:'https://i5.walmartimages.com/asr/a875a4b2-c215-4970-8b70-0c0884552216_1.efc84a975a36b5e879cfb9fafd4c',price:69},{productId:'3LMD73TXIS3T',usItemId:'974322958',title:'For 07-14 Toyota Camry/Corolla/Tacoma/Lexus RX350 IS250 Halo Ring Fog Light+CCFL Power Inverter Clea',imageUrl:'https://i5.walmartimages.com/asr/647afa27-f916-47da-85f5-fb3eab040ecb_1.2d9dd6502ec89698c5e61ea81961',price:56.88},{productId:'3I6503YEPK5H',usItemId:'936201625',title:'For 05-10 Dodge Avenger/Charger/Challenger/Chrysler Sebring Halo Ring Fog Lights+Switch+CCFL Power I',imageUrl:'https://i5.walmartimages.com/asr/8dce6d2d-7829-438f-b344-5e37727f2415_1.0f5c88d87b44ed14b8a5994e3d14',price:77.88},{productId:'365OZR9E4ED4',usItemId:'55002213',title:'Personalized Women\'s Square Halo Style Wedding Ring Guard',imageUrl:'https://i5.walmartimages.com/asr/b060c612-e1c7-422a-b835-ec3d0efaaf39_1.68b7660cad186b9074c788e06489',price:69},{productId:'33UY2W7A8ZDS',usItemId:'472741630',title:'HALO Bassinest Swivel Sleeper Essentia, Grey Ikat',imageUrl:'https://i5.walmartimages.com/asr/bc8da028-323c-4c6b-afe6-692bc480217a_1.6edb5c60710fed6f28f95dc4e97d',price:209.99},{productId:'2YUH9GCR9A1X',usItemId:'926570318',title:'Halo Boys\' Master Chief Classic Muscle Costume',imageUrl:'https://i5.walmartimages.com/asr/5302f01d-0a1f-4fe9-a879-e0bbe8aedb37_1.6f0131c06c641d629c9dce8543d0',price:15.75},{productId:'2W1FWIXCHKAA',usItemId:'687227423',title:'For 07-17 Ford Ranger/Expedition EL Halo Ring Fog Lights+CCFL Power Inverter Clear Lens 09 10 11 12 ',imageUrl:'https://i5.walmartimages.com/asr/d44b3342-59d6-4df0-98f3-ec8942cf6a94_1.26ebf65c527f05d1fc9db71e3d71',price:58.88},{productId:'2QS2UT3ZMT1T',usItemId:'48202439',title:'White Marabou Halo',imageUrl:'https://i5.walmartimages.com/asr/1308c411-8237-4f72-8ef4-5ba63455165f_1.0f9bc63fd3c917f97e33a1dd5f8c',price:3.74},{productId:'1D91Q9SFWRGA',usItemId:'40213125',title:'Personalized Shalom Doormat',imageUrl:'https://i5.walmartimages.com/asr/21c4813c-75bf-479c-b003-d21f683ce6ea_1.7de6314c958b6ab6a54acaeffc2a',price:20},{productId:'17DCD80PNOR0',usItemId:'204606386',title:'HALO Union Suit Pajama (Big Boy & Little Boy)',imageUrl:'https://i5.walmartimages.com/asr/4e7ee118-abaf-4b18-9626-0acdc8cb9a1c_1.2518a9a7e3ae894f06c1dabf92bc',price:16.88},{productId:'73EGWOBY8WO1',usItemId:'957712112',title:'For 05-18 Chrysler 300/Dodge Journey/Jeep Wrangler Halo Ring Fog Lights+CCFL Power Inverter Clear Le',imageUrl:'https://i5.walmartimages.com/asr/2f81524c-db58-4e4e-8ced-55ac56d83b6b_1.118e16b42fdc9bb9caf991368cdb',price:67.88}]});
//   expect(state).toEqual({loading:false,singleItem:[],multipleItems:[{productId:'0X05G70V1HHA',usItemId:'55002760',title:'Personalized Women\'s Half Halo Classic Style Ring Guard',imageUrl:'https://i5.walmartimages.com/asr/0fa94246-63c1-4fe1-9d53-b2ba97503851_1.0ce5915987d144a47e4f69e13ce2',price:69},{productId:'6E5V7EQ881OP',usItemId:'957192490',title:'2-3/4 Carat T.G.W. Ethiopian Opal and 1/10 Carat T.W. Diamond 14kt Rose Gold Beaded Halo Ring',imageUrl:'https://i5.walmartimages.com/asr/99209050-ead3-45ba-b6bc-79fc4d884d78_1.90949feaaf2a909bd4cc84312d50',price:908},{productId:'59A4XCHTLC3N',usItemId:'240121636',title:'for 08-11 subaru impreza / wrx pair of bumper halo ring fog lights+ccfl power inverter (smoked lens)',imageUrl:'https://i5.walmartimages.com/asr/bceecf99-3336-47dd-b16a-929039bd60d9_1.e7749e2633e41e8cfe8b294dbd31',price:73.88},{productId:'55PSFRA9YRFK',usItemId:'44900259',title:'Halo Master Chief Classic Muscle Child Halloween Costume',imageUrl:'https://i5.walmartimages.com/asr/e987cb5c-a822-419c-8b50-8cb01f6fe5cd_1.9cbcf82f990c8e923732226ff91f',price:25.02},{productId:'4ES5ZX9L60DL',usItemId:'9919881',title:'Halo Sleepsack Wearable Blanket',imageUrl:'https://i5.walmartimages.com/asr/b4a7a932-1811-490f-9945-207ea97bec0b_1.6a612a2c40fc9ecd9c6b087dadad',price:21.99},{productId:'464LHUHF38V5',usItemId:'389939433',title:'for 05-10 dodge avenger/charger/challenger/chrysler sebring halo ring fog lights+switch+ccfl power i',imageUrl:'https://i5.walmartimages.com/asr/6f65829d-b640-4b64-985b-6a0576ecda8c_1.32a0156c5317554a53dba5a28741',price:77.88},{productId:'44KTSNAXV2BP',usItemId:'55002603',title:'Personalized Women\'s Round-Shaped Classic Style Halo Wedding Ring Guard',imageUrl:'https://i5.walmartimages.com/asr/a875a4b2-c215-4970-8b70-0c0884552216_1.efc84a975a36b5e879cfb9fafd4c',price:69},{productId:'3LMD73TXIS3T',usItemId:'974322958',title:'For 07-14 Toyota Camry/Corolla/Tacoma/Lexus RX350 IS250 Halo Ring Fog Light+CCFL Power Inverter Clea',imageUrl:'https://i5.walmartimages.com/asr/647afa27-f916-47da-85f5-fb3eab040ecb_1.2d9dd6502ec89698c5e61ea81961',price:56.88},{productId:'3I6503YEPK5H',usItemId:'936201625',title:'For 05-10 Dodge Avenger/Charger/Challenger/Chrysler Sebring Halo Ring Fog Lights+Switch+CCFL Power I',imageUrl:'https://i5.walmartimages.com/asr/8dce6d2d-7829-438f-b344-5e37727f2415_1.0f5c88d87b44ed14b8a5994e3d14',price:77.88},{productId:'365OZR9E4ED4',usItemId:'55002213',title:'Personalized Women\'s Square Halo Style Wedding Ring Guard',imageUrl:'https://i5.walmartimages.com/asr/b060c612-e1c7-422a-b835-ec3d0efaaf39_1.68b7660cad186b9074c788e06489',price:69},{productId:'33UY2W7A8ZDS',usItemId:'472741630',title:'HALO Bassinest Swivel Sleeper Essentia, Grey Ikat',imageUrl:'https://i5.walmartimages.com/asr/bc8da028-323c-4c6b-afe6-692bc480217a_1.6edb5c60710fed6f28f95dc4e97d',price:209.99},{productId:'2YUH9GCR9A1X',usItemId:'926570318',title:'Halo Boys\' Master Chief Classic Muscle Costume',imageUrl:'https://i5.walmartimages.com/asr/5302f01d-0a1f-4fe9-a879-e0bbe8aedb37_1.6f0131c06c641d629c9dce8543d0',price:15.75},{productId:'2W1FWIXCHKAA',usItemId:'687227423',title:'For 07-17 Ford Ranger/Expedition EL Halo Ring Fog Lights+CCFL Power Inverter Clear Lens 09 10 11 12 ',imageUrl:'https://i5.walmartimages.com/asr/d44b3342-59d6-4df0-98f3-ec8942cf6a94_1.26ebf65c527f05d1fc9db71e3d71',price:58.88},{productId:'2QS2UT3ZMT1T',usItemId:'48202439',title:'White Marabou Halo',imageUrl:'https://i5.walmartimages.com/asr/1308c411-8237-4f72-8ef4-5ba63455165f_1.0f9bc63fd3c917f97e33a1dd5f8c',price:3.74},{productId:'1D91Q9SFWRGA',usItemId:'40213125',title:'Personalized Shalom Doormat',imageUrl:'https://i5.walmartimages.com/asr/21c4813c-75bf-479c-b003-d21f683ce6ea_1.7de6314c958b6ab6a54acaeffc2a',price:20},{productId:'17DCD80PNOR0',usItemId:'204606386',title:'HALO Union Suit Pajama (Big Boy & Little Boy)',imageUrl:'https://i5.walmartimages.com/asr/4e7ee118-abaf-4b18-9626-0acdc8cb9a1c_1.2518a9a7e3ae894f06c1dabf92bc',price:16.88},{productId:'73EGWOBY8WO1',usItemId:'957712112',title:'For 05-18 Chrysler 300/Dodge Journey/Jeep Wrangler Halo Ring Fog Lights+CCFL Power Inverter Clear Le',imageUrl:'https://i5.walmartimages.com/asr/2f81524c-db58-4e4e-8ced-55ac56d83b6b_1.118e16b42fdc9bb9caf991368cdb',price:67.88}],cartItems:[],userEmail:'v9s0wxd4df5zxs6zy4es',loginWindowState:false,cartModalState:false,userHasAuthenticated:false});
// });



 
// test('test2', () => {
//   let state;
//   state = reducers({loading:false,singleItem:[],multipleItems:[],cartItems:[],userEmail:'apj5m6hmbjle1nw91j0haj',loginWindowState:false,cartModalState:false,userHasAuthenticated:false}, {type:'FETCH_FROM_SERVER',searchObj:{query:'halo',searchType:'multipleItemSearch',yieldAction:'FETCHED_MULTIPLE_ITMES'}});
//   expect(state).toEqual({loading:true,singleItem:[],multipleItems:[],cartItems:[],userEmail:'apj5m6hmbjle1nw91j0haj',loginWindowState:false,cartModalState:false,userHasAuthenticated:false});
// });
