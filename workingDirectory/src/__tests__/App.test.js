import React from 'react';
import ReactDOM from 'react-dom';
import {App} from '../components/App';
import {Topbar} from '../components/Topbar';
import {itemOutput} from '../components/itemOutput';
import {CartModal} from '../components/CartModal';
import {LoginModal} from '../components/LoginModal';

import Register from '../components/Register';

// import TestRender from '../components/TestRender.js'
import { Provider } from 'react-redux';
import renderer from 'react-test-renderer';
import ShallowRenderer from 'react-test-renderer/shallow';
import { mount, shallow } from 'enzyme';
import Enzyme from 'enzyme';
import Adapter from 'enzyme-adapter-react-16';

import configureStore from 'redux-mock-store'
import toJson from 'enzyme-to-json'

Enzyme.configure({ adapter: new Adapter() });


var initialStore = {
		loading:false,
		singleItem:[], 
		multipleItems:[],
		cartItems:{},
		userEmail:"admin@example.com",
		loginWindowState:false,
		cartModalState:false,
		userHasAuthenticated:false,
		previouslyLoggedIn:false,
	}

// working and up to date documentation on testing component rendering with redux
// https://circleci.com/blog/continuously-testing-react-applications-with-jest-and-enzyme/
describe('App', () => {
	
	it('Entire App renders correctly', () => {
		const wrapper = shallow(<App {...initialStore} />)
		expect(toJson(wrapper)).toMatchSnapshot()
	})

	it('Topbar renders correctly', () => {
		const wrapper = shallow(<Topbar {...initialStore} />)
		expect(toJson(wrapper)).toMatchSnapshot()
	})

	it('itemOutput renders correctly', () => {
		const wrapper = shallow(<itemOutput {...initialStore} />)
		expect(toJson(wrapper)).toMatchSnapshot()
	})

	it('CartModal renders correctly', () => {
		initialStore.cartModalState = true
		const wrapper = shallow(<CartModal {...initialStore } />)
		expect(toJson(wrapper)).toMatchSnapshot()
	})

	it('LoginModal renders correctly', () => {
		initialStore.loginWindowState = true
		const wrapper = shallow(<LoginModal {...initialStore} />)
		expect(toJson(wrapper)).toMatchSnapshot()
	})

	it('itemOutput renders item list', () => {
		initialStore.multipleItems = [{productId:'30PFL94VDAUO',usItemId:'56208070',title:'Xbox 360 Halo 3 (email delivery)',imageUrl:'https://i5.walmartimages.com/asr/6ced0869-a889-43d6-ad16-dd7bd78229ec_1.1785ebb4434a390ee1592b0f77e4',price:19.99},{productId:'3MGWZT694902',usItemId:'25866521',title:'HALO Reach, Microsoft, Xbox 360, 885370230659',imageUrl:'https://i5.walmartimages.com/asr/c3b32348-1319-4e03-a2cf-3620230ef60a_1.a97d9e068b44a0002458fb20cc70',price:23.35},{productId:'715DBQVKRIXS',usItemId:'10899773',title:'Halo 3: ODST (Xbox 360)',imageUrl:'https://i5.walmartimages.com/asr/ca1bd3eb-c653-4f5d-9a8d-8c4dfe123fe6_1.6a1b2ca485395b18bb576f75a5ac',price:19.95},{productId:'5DVWGTJVZB5U',usItemId:'23109097',title:'Cokem International Preown 360 Halo: Combat Evolved Anniv',imageUrl:'https://i5.walmartimages.com/asr/14eb2b8a-33cb-420c-8335-8e26e2ca986d_1.7c2e3255780b9b18c05845982cac',price:37.17},{productId:'1N0JE086PX4Y',usItemId:'39507641',title:'Microsoft Halo MasterChief Collection (Xbox One)',imageUrl:'https://i5.walmartimages.com/asr/125ac46a-4d70-4931-9e5a-ab6715318c45_1.4a11613007edfe3be892a2630c85',price:28.45},{productId:'7CX49GAR9Y5D',usItemId:'23736059',title:'Microsoft Halo 3 Odst (Xbox 360) - Pre-Owned',imageUrl:'https://i5.walmartimages.com/asr/2acb4a61-3138-4a8b-a282-0a4eefb195da_1.ce0dc07f6c890bfeff273aaaf617',price:13.83},{productId:'5UWAF1EEQNT4',usItemId:'46477978',title:'Xbox One Limited Edition Halo 5: Guardians Wireless Controller',imageUrl:'https://i5.walmartimages.com/asr/75e48395-abe5-4eff-8c08-008c76f836f5_1.04ccd6be5efeb8fd171ceb2d6d03',price:165.49},{productId:'61P9AQ1ONY79',usItemId:'15105912',title:'HALO Wars, Microsoft, Xbox 360, 885370047295',imageUrl:'https://i5.walmartimages.com/asr/7402fd9f-9ef1-489d-b9f5-84eccd978263_1.29fc9b1dce53b2ced2dde2402657',price:19.95},{productId:'1GEWOTZ92A0A',usItemId:'56208069',title:'Xbox 360 Halo 4 (email delivery)',imageUrl:'https://i5.walmartimages.com/asr/c1fd3e25-701c-4fca-be4c-0689055857d0_1.a40ed0965062125e8073b528702c',price:20.21},{productId:'446YZORE3JFR',usItemId:'352000743',title:'Refurbished Microsoft Xbox 360 E 250GB Borderlands 2, Halo 4, and Forza Horizon bundle',imageUrl:'https://i5.walmartimages.com/asr/c824a6a8-4586-43b2-b7f4-c7cc36d89fde_1.7b6d47ff6ec3cdce516f1eda1811',price:214.99},{productId:'3NR1FO82GRUR',usItemId:'54000924',title:'HALO Wars 2 Ultimate Edition, Microsoft, Xbox One, 889842148473',imageUrl:'https://i5.walmartimages.com/asr/1648bbdb-11fc-40cd-ba41-bdb8d5c70694_1.5a5743bb2c3d842710ce5ab4d4f5',price:12.49},{productId:'6V1Y209LZ5MQ',usItemId:'50453355',title:'Controller Gear Officially Licensed Xbox One Halo 5 - Special Edition',imageUrl:'https://i5.walmartimages.com/asr/1e550810-ae59-4b55-9a22-fd6ed9b64fa2_1.7e8eb2ee8eab399e85af76f7753f',price:7.99},{productId:'6AL012CRBZBC',usItemId:'233583935',title:'Refurbished Xbox 360 250GB Black Friday Bundle With Halo 4 Darksiders II Tomb Raider And Batman: Ark',imageUrl:'https://i5.walmartimages.com/asr/d3765d1d-13dc-4c73-9443-f79228954555_1.d2c5f471b403f6a2a37a1eb4489c',price:184.99},{productId:'6D1HTS2YO3UV',usItemId:'46937068',title:'Interactive Commicat Xbox Live 12mth Halo Sub',imageUrl:'https://i5.walmartimages.com/asr/b45af715-a79b-4393-845e-ffe92385e0ed_1.d38979743bbe01bb0711f1f24df1',price:56.74},{productId:'4FR03QKUQUHH',usItemId:'20754045',title:'Halo 4 Limited Collectors Edition NLA, Microsoft, XBOX 360, 885370429718',imageUrl:'https://i5.walmartimages.com/asr/8a62d42b-15fa-4bef-8a69-3f1099b56be2_1.b5a1ceba4e1e17a60d2d8480e619',price:79.99},{productId:'4TPU5I25UEA8',usItemId:'29049015',title:'Xbox 360 250GB Value Bundle with Halo 4 and Tomb Raider',imageUrl:'https://i5.walmartimages.com/asr/85ecfc3c-103f-4506-8e2b-ec17a1836cab_1.5132de540908f397abe9450d3f20',price:429.89},{productId:'6ZEJYWNGN0YR',usItemId:'21578410',title:'Halo 4 Xbox 360 320GB Console Bundle (Limited Edition)',imageUrl:'https://i5.walmartimages.com/asr/111c8211-3a37-4f50-a4ed-6fde4f672411_1.e187ed90723ba58d45f054708715',price:646.48},{productId:'4JIMYSXXTBCX',usItemId:'53753498',title:'Xbox One S Halo Collection Bundle (500GB)',imageUrl:'https://i5.walmartimages.com/asr/ca79decd-735e-4804-9874-b3d4f7fac489_1.a3efc526b66e5d6c19b0dfe2f55e',price:379.99},{productId:'602UKXPT2HRA',usItemId:'192471903',title:'Refurbished Xbox One S 500GB Console Gears Of War And Halo Special Edition Bundle',imageUrl:'https://i5.walmartimages.com/asr/6e193841-bd19-4eee-a11d-4e04f36b2e3b_1.a2c3b50d75fdfe4c805b332072b1',price:264.99},{productId:'588QK23UIDW0',usItemId:'47505400',title:'Halo 5 Guardians (Xbox One) Warzone REQ Bundle (Email Delivery)',imageUrl:'https://i5.walmartimages.com/asr/fde0c96c-e493-41fd-a20a-d0adff608d35_1.39462c7c9d01820267862f4207cf',price:24.99},{productId:'4K3F0S4FFLOO',usItemId:'676579682',title:'Refurbished Microsoft Xbox 360 4gb Console Halo 3 and Halo 4 Bundle',imageUrl:'https://i5.walmartimages.com/asr/3d1e4cfb-9c18-44ed-bb30-c43a5c501519_1.43ead1156eeeb115f5589835bee5',price:118.99},{productId:'4XNSU7M2PGK1',usItemId:'965291250',title:'Refurbished Xbox One S 1TB Console Halo Collection Bundle',imageUrl:'https://i5.walmartimages.com/asr/a2f179f9-5899-41a7-bf24-301c2b5800ab_1.d8559be13458778cb3daab6220eb',price:264.75},{productId:'6L5BV9I15MKI',usItemId:'46359656',title:'Xbox One 1 TB Halo 5: Guardians Limited Edition Console Bundle',imageUrl:'https://i5.walmartimages.com/asr/2a6b2120-87c9-49e7-89cf-587e7b1327cf_1.e9a88ba450262c5302392d8b84de',price:449.98},{productId:'6NG5KQM2WIQW',usItemId:'927909748',title:'Refurbished Xbox One S 500GB Console Halo Collection Bundle',imageUrl:'https://i5.walmartimages.com/asr/513bbbab-3585-47c8-bb93-a86d51b96da2_1.3c15ff32a5ee5fe17d414e5a155d',price:259.99},{productId:'58USC053186U',usItemId:'54000925',title:'Halo Wars 2, Microsoft, Xbox One, 889842148435',imageUrl:'https://i5.walmartimages.com/asr/37c0d47f-a281-4570-8969-de7ae8fb3548_1.69a3d6b54bf13f0d40f34be4158d',price:13.8},{productId:'58Z1KKLISAO6',usItemId:'247742210',title:'Refurbished Xbox 360 Elite 120GB With Forza 3 And Halo 3 ODST',imageUrl:'https://i5.walmartimages.com/asr/c358e948-b819-47c1-9c59-62510c7e5ea0_1.5265f253e7574ff830954d945e55',price:144.99},{productId:'2LOJCEHGO3QW',usItemId:'44676910',title:'HALO 5, Microsoft, Xbox One, 885370928518',imageUrl:'https://i5.walmartimages.com/asr/3ad45896-4a67-4a78-9262-03fed10a8e33_1.eb5085c1c65e3280dc6eb9035481',price:18.39},{productId:'6RFDK3XXZRNQ',usItemId:'48572239',title:'Halo 5 Guardians Digital Deluxefull Game',imageUrl:'https://i5.walmartimages.com/asr/c3ff0912-b8a9-4711-a60b-a0997265672b_1.b593235266168d14758917908689',price:49.99},{productId:'20RH0NIY30H8',usItemId:'574356511',title:'Refurbished Xbox One 500GB Console Halo: The Master Chief Collection Bundle',imageUrl:'https://i5.walmartimages.com/asr/28c615a6-a38e-4c81-b2c0-1b20f44f29ec_1.73f69a04f3a472fcdeb0fa9548cd',price:229.99},{productId:'6S7HNF5A4H61',usItemId:'691259304',title:'Refurbished Microsoft Xbox One S 500GB Console Gears Of War And Halo Special Edition Bundle White Ho',imageUrl:'https://i5.walmartimages.com/asr/3fa5be38-e884-4d3e-b4af-5f4176945932_1.50b485aba02fe91b722ceb7408cc',price:259.99},{productId:'22T4LUOEFKVV',usItemId:'849225239',title:'Refurbished Xbox 360 E 250GB Console with Tomb Raider, Halo 4, and Controller',imageUrl:'https://i5.walmartimages.com/asr/61b44b90-f589-4e80-a1c7-8e856c2aa585_1.6bfe875f8e2612f49aca1cfd2978',price:219.99},{productId:'7CCBTBSVEGF5',usItemId:'987721345',title:'Refurbished Xbox One S 1TB Console Halo Wars 2 Bundle',imageUrl:'https://i5.walmartimages.com/asr/2235cbd4-aae5-47a7-81b4-98318dae34f4_1.71ec18d3416374f241a16a9d9efc',price:229.99},{productId:'5RYO1XVHALPJ',usItemId:'47505398',title:'Microsoft Halo 5 Guardians (Xbox One) (Email Delivery)',imageUrl:'https://i5.walmartimages.com/asr/37dcca1d-e63a-4e3f-afea-981293734d5c_1.827a6b6569c59b5917a3f8b9eb62',price:53.99},{productId:'5SVHS6WWOISH',usItemId:'16677178',title:'Halo Reach (Original Game Soundtrack) (CD)',imageUrl:'https://i5.walmartimages.com/asr/634c5635-40c1-48ba-8731-52e39d0148d5_1.389458ea19303134255496a7e6ab',price:16.71},{productId:'55PSFRA9YRFK',usItemId:'44900259',title:'Halo Master Chief Classic Muscle Child Halloween Costume',imageUrl:'https://i5.walmartimages.com/asr/e987cb5c-a822-419c-8b50-8cb01f6fe5cd_1.9cbcf82f990c8e923732226ff91f',price:25.02},{productId:'17DCD80PNOR0',usItemId:'204606386',title:'HALO Union Suit Pajama (Big Boy & Little Boy)',imageUrl:'https://i5.walmartimages.com/asr/4e7ee118-abaf-4b18-9626-0acdc8cb9a1c_1.2518a9a7e3ae894f06c1dabf92bc',price:16.88},{productId:'56U033SLQA5W',usItemId:'21889776',title:'Halo 4 - Original Soundtrack',imageUrl:'https://i5.walmartimages.com/asr/b1f3e77d-46e4-40c4-a759-269234e83560_1.796550655817d2a9811dd14f2e4e',price:6.95},{productId:'6IVASP5Z6PDS',usItemId:'17217237',title:'Megabloks Halo ODST Ambush',imageUrl:'https://i5.walmartimages.com/asr/1301858f-544c-43e1-80d1-2fe91fdaf379_1.57282186b514f4dd54a284606dad',price:27.99},{productId:'6IKBNS12DG9W',usItemId:'10901998',title:'Halo Wars (Original Game Soundtrack) (CD)',imageUrl:'https://i5.walmartimages.com/asr/7dafecf6-b146-4442-8a49-5b4c218ecfd5_1.11b5c5fcf362c1814f763abe5b6a',price:6},{productId:'4AE9W9PSWJS0',usItemId:'20532388',title:'Mega Bloks Halo Covenant Revenant Attack Building Set',imageUrl:'https://i5.walmartimages.com/asr/cf8f66ec-2340-4416-9913-651da4e59931_1.0c577b3ee8a08b82c22b5a95ebc2',price:69.99},{productId:'4T6RBZGKNIP0',usItemId:'46510011',title:'Halo 5: Guardians : Prima Official Game Guide',imageUrl:'https://i5.walmartimages.com/asr/77430af9-9fc9-4a63-a227-a9a8b8e64e4c_1.3d4bc55b577889fb7093977f1f76',price:12.35},{productId:'2YUH9GCR9A1X',usItemId:'926570318',title:'Halo Boys\' Master Chief Classic Muscle Costume',imageUrl:'https://i5.walmartimages.com/asr/5302f01d-0a1f-4fe9-a879-e0bbe8aedb37_1.6f0131c06c641d629c9dce8543d0',price:15.75},{productId:'4JASOGYROXBR',usItemId:'49467500',title:'Mega Construx Halo UNSC Jackrabbit Blitz',imageUrl:'https://i5.walmartimages.com/asr/8573fa8d-73d4-4ef5-9850-fb8d1b823263_1.0e5560265ba81fde144bf55c8fb4',price:19.46},{productId:'6RNRLY0DO61V',usItemId:'44932431',title:'BOOMco Halo Smart Stick 30-Darts and 2-Targets Set, Blue and Red',imageUrl:'https://i5.walmartimages.com/asr/da67aa27-62ce-4da3-9874-075d872920d8_1.e28990ad0a2510a13d1e65a41bfb',price:11.78},{productId:'6VQZWHOS4P7N',usItemId:'168785235',title:'Mega Construx Halo CTF Arctic Warthog',imageUrl:'https://i5.walmartimages.com/asr/c8251a88-5c88-46e3-9dbc-6ad0e41e1d70_1.811819e77a5c4d21005818bed130',price:24.09},{productId:'5SLJF9BD7BIB',usItemId:'44932434',title:'BOOMco Halo Covenant Darts & Targets with 2-Targets & 30-Darts',imageUrl:'https://i5.walmartimages.com/asr/8fd8eefd-2c6a-41ba-8bc1-6e7cc758cfa0_1.0f901dd24e3b467432467ed3fd24',price:8.18},{productId:'0RFNOS4IQZLP',usItemId:'25372548',title:'Halo Sleepsack Big Kids Microfleece - Bl',imageUrl:'https://i5.walmartimages.com/asr/d2d7c863-b7a9-406d-b4e8-93c685f79f89_1.805c2c9b3fc6ea649e90e65038a3',price:23.47},{productId:'5CMFG8USYVLW',usItemId:'273661340',title:'HelloDecor Polyster 7x5ft Wedding Backdrop Silver Bokeh Halos Sparkle Sequins Abstract Romantic Wall',imageUrl:'https://i5.walmartimages.com/asr/b8b6d699-9428-414b-8400-6853197f7124_1.bf7a5eb1e1fa496d4861120593a2',price:22.99},{productId:'5CLQLXR69BHE',usItemId:'511310661',title:'12-Pack G8 Base 120volt 75watt, Halogen Lights Bulbs, JCD Type Anyray',imageUrl:'https://i5.walmartimages.com/asr/b5f62b7c-fe1e-45c7-8017-12bb3a484749_1.b872bae3cec22b2b84d3b8394073',price:26.99},{productId:'5CDUQHVD6R4N',usItemId:'47766429',title:'Mega Bloks Halo Promethean Warriors',imageUrl:'https://i5.walmartimages.com/asr/81baef92-14c3-4848-8945-f66df77efeb2_1.6596b00a367a068ce753e6b2bbe9',price:35.95}]
		const wrapper = shallow(<itemOutput {...initialStore} />)
		expect(toJson(wrapper)).toMatchSnapshot()
	})

	it('CartModal renders item list', () => {
		initialStore.cartModalState = true
		initialStore.cartItems = [{productID:'3MGWZT694902',usItemId:'25866521',quantity:1,price:23.35,imageUrl:'https://i5.walmartimages.com/asr/c3b32348-1319-4e03-a2cf-3620230ef60a_1.a97d9e068b44a0002458fb20cc70',title:'HALO Reach, Microsoft, Xbox 360, 885370230659'},{productID:'5DVWGTJVZB5U',usItemId:'23109097',quantity:1,price:37.17,imageUrl:'https://i5.walmartimages.com/asr/14eb2b8a-33cb-420c-8335-8e26e2ca986d_1.7c2e3255780b9b18c05845982cac',title:'Cokem International Preown 360 Halo: Combat Evolved Anniv'},{productID:'715DBQVKRIXS',usItemId:'10899773',quantity:1,price:19.95,imageUrl:'https://i5.walmartimages.com/asr/ca1bd3eb-c653-4f5d-9a8d-8c4dfe123fe6_1.6a1b2ca485395b18bb576f75a5ac',title:'Halo 3: ODST (Xbox 360)'}]
		const wrapper = shallow(<CartModal {...initialStore } />)
		expect(toJson(wrapper)).toMatchSnapshot()
	})

})


