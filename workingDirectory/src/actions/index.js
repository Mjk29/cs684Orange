export const getNews = () => ({
  type: 'GET_NEWS',
});

export const getItems = () => ({
  type: 'GET_ITEMS',
});


export const printItems = () => ({
  type: 'PRINT_ITEMS',
});


export const searchTerm = (text) => ({
  type: 'SEARCH_TERM',
  searchTerm:text
});


export const fetchFromServer = (searchObj) => ({
  type: 'FETCH_FROM_SERVER',
  searchObj:searchObj
});

export const addItemToCart = (item) => ({
  type: 'ADD_ITEM_TO_CART',
  item:item
});


export const userLoginAction = (searchObj) => ({
  type: 'LOGIN_USER',
  searchObj:searchObj,

});

export const changeUserLoginWindowStateAction = (loginState) => ({
  type: 'CHANGE_USER_LOGIN_WINDOW_STATE',
  loginState:loginState
});


// KARAN ADDED
export const changeRegisterWindowStateAction = (registerWindowState) => ({
  type: 'CHANGE_USER_REGISTER_WINDOW_STATE',
  registerWindowState:registerWindowState
});

export const toggleRegisterModal = (toggleState) => ({
  type: 'TOGGLE_REGISTER_MODAL',
  registerState:toggleState
});
///

export const toggleLoginModal = (toggleState) => ({
  type: 'TOGGLE_LOGIN_MODAL',
  loginState:toggleState
});

export const toggleCartModalAction = (toggleState) => ({
  type: 'TOGGLE_CART_MODAL',
  cartModalState:toggleState
});

export const removeItemFromCartAction = (itemKey) => ({
  type: 'REMOVE_ITEM_FROM_CART',
  searchObj:itemKey
});


export const updateCartDisplayAction = (userEmail) => ({
  type: 'UPDATE_CART_DISPLAY',
  userEmail:userEmail
});

export const checkoutItems = (userEmail) => ({
  type: 'CHECKOUT_ITEMS',
  userEmail:userEmail
});

export const connectToMasterServer = () => ({
  type: 'CONNECT_TO_MASTER_SERVER',
});


export const changeRegisterWindowStateAction = (registerWindowState) => ({
  type: 'CHANGE_USER_REGISTER_WINDOW_STATE',
  registerWindowState:registerWindowState
});

export const toggleRegisterModal = (toggleState) => ({
  type: 'TOGGLE_REGISTER_MODAL',
  registerState:toggleState
});









