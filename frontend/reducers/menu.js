const initialState = {
  products: [],
  originProducts: [],
  lists: [],
  originalLists: [],
  naviSize: null,
  TableId: null,
  isAddingProduct: false,
  isLoadingCart: false,
  categories: [],
};

export const LOAD_PRODUCTS_REQUEST = "LOAD_PRODUCTS_REQUEST";
export const LOAD_PRODUCTS_SUCCESS = "LOAD_PRODUCTS_SUCCESS";
export const LOAD_PRODUCTS_FAILURE = "LOAD_PRODUCTS_FAILURE";

export const ADD_QUANTITY_REQUEST = "ADD_QUANTITY_REQUEST";
export const ADD_QUANTITY_SUCCESS = "ADD_QUANTITY_SUCCESS";
export const ADD_QUANTITY_FAILURE = "ADD_QUANTITY_FAILURE";

export const SUBSTRACT_QUANTITY_REQUEST = "SUBSTRACT_QUANTITY_REQUEST";
export const SUBSTRACT_QUANTITY_SUCCESS = "SUBSTRACT_QUANTITY_SUCCESS";
export const SUBSTRACT_QUANTITY_FAILURE = "SUBSTRACT_QUANTITY_FAILURE";

export const ADD_PRODUCT_REQUEST = "ADD_PRODUCT_REQUEST";
export const ADD_PRODUCT_SUCCESS = "ADD_PRODUCT_SUCCESS";
export const ADD_PRODUCT_FAILURE = "ADD_PRODUCT_FAILURE";

export const LOAD_CART_REQUEST = "LOAD_CART_REQUEST";
export const LOAD_CART_SUCCESS = "LOAD_CART_SUCCESS";
export const LOAD_CART_FAILURE = "LOAD_CART_FAILURE";

export const INITIATE_QUANTITY_REQUEST = "INITIATE_QUANTITY_REQUEST";

export const GET_NAVIBAR_SIZE = "GET_NAVIBAR_SIZE";

export const SEARCH_PRODUCT_SUCCESS = "SEARCH_PRODUCT_SUCCESS";

export const SELECT_CATEGORY_SUCCESS = "SELECT_CATEGORY_SUCCESS";

export const LOAD_LIST_REQUEST = "LOAD_LIST_REQUEST";
export const LOAD_LIST_SUCCESS = "LOAD_LIST_SUCCESS";
export const LOAD_LIST_FAILURE = "LOAD_LIST_FAILURE";

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case GET_NAVIBAR_SIZE: {
      return {
        ...state,
        naviSize: action.data,
      };
    }

    case ADD_QUANTITY_SUCCESS: {
      const index = state.products.findIndex((product) => product.id === action.data.id);
      const product = state.products[index];
      let quantity = product.quantity;
      quantity < 100 ? (quantity += 1) : 99;
      const products = [...state.products];
      products[index] = { ...product, quantity };

      return {
        ...state,
        products,
      };
    }

    case SUBSTRACT_QUANTITY_SUCCESS: {
      const index = state.products.findIndex((product) => product.id === action.data.id);
      const product = state.products[index];
      let quantity = product.quantity;
      quantity > 1 ? (quantity -= 1) : 1;
      const products = [...state.products];
      products[index] = { ...product, quantity };
      return {
        ...state,
        products,
      };
    }

    case LOAD_PRODUCTS_REQUEST: {
      return {
        ...state,
      };
    }

    case LOAD_PRODUCTS_SUCCESS: {
      if (action.data[0].TableId) {
        return {
          ...state,
          products: action.data[0].menus,
          originProducts: action.data[0].menus,
          TableId: action.data[0].TableId,
          categories: action.data[1],
        };
      }
      return {
        ...state,
        originProducts: action.data[0],
        products: action.data[0],
        categories: action.data[1],
      };
    }

    case LOAD_PRODUCTS_FAILURE: {
      return {
        ...state,
      };
    }

    case ADD_PRODUCT_REQUEST: {
      return {
        ...state,
      };
    }

    case ADD_PRODUCT_SUCCESS: {
      return {
        ...state,
        products: [action.data, ...state.products],
      };
    }

    case ADD_PRODUCT_FAILURE: {
      return {
        ...state,
      };
    }

    case LOAD_CART_REQUEST: {
      return {
        ...state,
      };
    }

    case LOAD_CART_SUCCESS: {
      return {
        ...state,
        cart: [...state.cart, action.data],
      };
    }

    case LOAD_CART_FAILURE: {
      return {
        ...state,
      };
    }

    case INITIATE_QUANTITY_REQUEST: {
      const product = action.data;
      const index = state.products.findIndex((v) => v.id == action.data.id);
      const products = [...state.products];
      products[index] = { ...product, quantity: 1 };
      return {
        ...state,
        products,
      };
    }

    case SEARCH_PRODUCT_SUCCESS: {
      const filteredProducts = state.originProducts.filter((product) => {
        return product.title.indexOf(action.data.text) > -1;
      });
      return { ...state, products: filteredProducts };
    }

    case SELECT_CATEGORY_SUCCESS: {
      if (action.id == 0) {
        return { ...state, products: [...state.originProducts] };
      } else if (action.id == -1) {
        const discountedProduct = state.originProducts.filter((v) => {
          return v.Discount !== null;
        });
        return { ...state, products: discountedProduct };
      }
      const filteredProducts = state.originProducts.filter((r) => r.Category.id == action.id);
      return { ...state, products: filteredProducts };
    }

    case LOAD_LIST_REQUEST: {
      return { ...state };
    }
    case LOAD_LIST_SUCCESS: {
      return {
        ...state,
        lists: action.data.products,
        originalLists: action.data.products,
      };
    }
    case LOAD_LIST_FAILURE: {
      return {
        ...state,
      };
    }

    default: {
      return {
        ...state,
      };
    }
  }
};

export default reducer;
