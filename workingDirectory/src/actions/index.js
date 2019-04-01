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


export const userLogin = (userName) => ({
  type: 'LOGIN_USER',
  user:userName
});

export const changeUserLoginWindowStateAction = (loginState) => ({
  type: 'CHANGE_USER_LOGIN_WINDOW_STATE',
  loginState:loginState
});

export const toggleLoginModal = (toggleState) => ({
  type: 'TOGGLE_LOGIN_MODAL',
  loginState:toggleState
});



