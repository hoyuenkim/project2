const initialState = {
  shop: null,
  products: [],
  originProducts: [],
  categories: [],
  product: null,
  isAddingFiles: false,
  isLoadingProducts: false,
  isSelectingProduct: false,
  selectingProductError: null,
  isLoadingShopList: false,
  loadingShopListError: null,
  isAddingShop: false,
  userCoordinates: undefined,
  shopCoordinates: undefined,
  productsNear: undefined,
};

export const ADD_PRODUCT_REQUEST = "ADD_PRODUCT_REQUEST";
export const ADD_PRODUCT_SUCCESS = "ADD_PRODUCT_SUCCESS";
export const ADD_PRODUCT_FAILURE = "ADD_PRODUCT_FAILURE";

export const ADMIN_PRODUCTS_REQUEST = "ADMIN_PRODUCTS_REQUEST";
export const ADMIN_PRODUCTS_SUCCESS = "ADMIN_PRODUCTS_SUCCESS";
export const ADMIN_PRODUCTS_FAILURE = "ADMIN_PRODUCTS_FAILURE";

export const SELECT_PRODUCT_REQUEST = "SELECT_PRODUCT_REQUEST";
export const SELECT_PRODUCT_SUCCESS = "SELECT_PRODUCT_SUCCESS";
export const SELECT_PRODUCT_FAILURE = "SELECT_PRODUCT_FAILURE";

export const EDIT_PRODUCT_REQUEST = "EDIT_PRODUCT_REQUEST";
export const EDIT_PRODUCT_SUCCESS = "EDIT_PRODUCT_SUCCESS";
export const EDIT_PRODUCT_FAILURE = "EDIT_PRODUCT_FAILURE";

export const DELETE_PRODUCT_REQUEST = "DELETE_PRODUCT_REQUEST";
export const DELETE_PRODUCT_SUCCESS = "DELETE_PRODUCT_SUCCESS";
export const DELETE_PRODUCT_FAILURE = "DELETE_PRODUCT_FAILURE";

export const CHECK_PRODUCT_SUCCESS = "CHECK_PRODUCT_SUCCESS";

export const CHECK_ALL_PRODUCTS_SUCCESS = "CHECK_ALL_PRODUCTS_SUCCESS";

export const DISCOUNT_PRODUCT_REQUEST = "DISCOUNT_PRODUCT_REQUEST";
export const DISCOUNT_PRODUCT_SUCCESS = "DISCOUNT_PRODUCT_SUCCESS";
export const DISCOUNT_PRODUCT_FAILURE = "DISCOUNT_PRODUCT_FAILURE";

export const DELETE_DISCOUNT_REQUEST = "DELETE_DISCOUNT_REQUEST";
export const DELETE_DISCOUNT_SUCCESS = "DELETE_DISCOUNT_SUCCESS";
export const DELETE_DISCOUNT_FAILURE = "DELETE_DISCOUNT_FAILURE";

export const ADD_CATEGORY_REQUEST = "ADD_CATEGORY_REQUEST";
export const ADD_CATEGORY_SUCCESS = "ADD_CATEGORY_SUCCESS";
export const ADD_CATEGORY_FAILURE = "ADD_CATEGORY_FAILURE";

export const EDIT_CATEGORY_REQUEST = "EDIT_CATEGORY_REQUEST";
export const EDIT_CATEGORY_SUCCESS = "EDIT_CATEGORY_SUCCESS";
export const EDIT_CATEGORY_FAILURE = "EDIT_CATEGORY_FAILURE";

export const DELETE_CATEGORY_REQUEST = "DELETE_CATEGORY_REQUEST";
export const DELETE_CATEGORY_SUCCESS = "DELETE_CATEGORY_SUCCESS";
export const DELETE_CATEGORY_FAILURE = "DELETE_CATEGORY_FAILURE";

export const CATEGORY_FILTERED_SUCCESS = "CATEGORY_FILTERED_SUCCESS";

export const LOAD_SHOPLIST_REQUEST = "LOAD_SHOPLIST_REQUEST";
export const LOAD_SHOPLIST_SUCCESS = "LOAD_SHOPLIST_SUCCESS";
export const LOAD_SHOPLIST_FAILURE = "LOAD_SHOPLIST_FAILURE";

export const SET_COORDINATES_SUCCESS = "SET_COORDINATES_SUCCESS";

export const SET_SHOPCOORDINATES_SUCCESS = "SET_SHOPCOORDINATES_SUCCESS";

export const NEAR_ADD_QUANTITY_REQUEST = "NEAR_ADD_QUANTITY_REQUEST";
export const NEAR_SUBSTRACT_QUANTITY_REQUEST = "NEAR_SUBSTRACT_QUANTITY_REQUEST";

const reducer = (state = initialState, action) => {
  switch (action.type) {
    case ADD_PRODUCT_REQUEST: {
      return {
        ...state,
        isAddingFiles: true,
      };
    }
    case ADD_PRODUCT_SUCCESS: {
      return {
        ...state,
        products: [action.data, ...state.products],
        originProducts: [action.data, ...state.products],
        isAddingFiles: false,
      };
    }
    case ADD_PRODUCT_FAILURE: {
      return {
        ...state,
        isAddingFiles: false,
      };
    }

    case ADMIN_PRODUCTS_REQUEST: {
      return {
        ...state,
        isLoadingProducts: true,
      };
    }
    case ADMIN_PRODUCTS_SUCCESS: {
      return {
        ...state,
        isLoadingProducts: false,
        products: action.data[0],
        originProducts: action.data[0],
        categories: action.data[1],
      };
    }
    case ADMIN_PRODUCTS_FAILURE: {
      return {
        ...state,
        isLoadingProducts: false,
      };
    }

    case SELECT_PRODUCT_REQUEST: {
      return { isSelectingProduct: true, ...state };
    }
    case SELECT_PRODUCT_SUCCESS: {
      return { isSelectingProduct: false, ...state, product: action.data };
    }
    case SELECT_PRODUCT_FAILURE: {
      return {
        isSelectingProduct: false,
        ...state,
        selectingProductError: action.error,
      };
    }

    case EDIT_PRODUCT_REQUEST: {
      return { ...state };
    }
    case EDIT_PRODUCT_SUCCESS: {
      console.log(action.data);
      const index = state.products.findIndex((v) => v.id === action.data.id);
      const products = [...state.products];
      products[index] = action.data;

      return { ...state, products, originProducts: products };
    }
    case EDIT_PRODUCT_FAILURE: {
      return { ...state };
    }

    case DELETE_PRODUCT_REQUEST: {
      return { ...state };
    }

    case DELETE_PRODUCT_SUCCESS: {
      const products = state.products.filter((v) => v.id != action.data);
      return { ...state, products, originProducts: products };
    }

    case DELETE_PRODUCT_FAILURE: {
      return { ...state };
    }

    case DELETE_DISCOUNT_REQUEST: {
      return { ...state };
    }

    case DELETE_DISCOUNT_SUCCESS: {
      console.log(action.data);
      const filteredProducts =
        action.data[1] == 0
          ? action.data[0]
          : action.data[0].filter((v) => v.Category.id == action.data[1]);
      return {
        ...state,
        products: filteredProducts,
        originProducts: action.data[0],
      };
    }

    case DELETE_PRODUCT_FAILURE: {
      return { ...state };
    }

    case CHECK_PRODUCT_SUCCESS: {
      const index = state.products.findIndex((v) => v.id === action.id);
      const product = state.products[index];
      let checked = product.checked;
      checked = checked ? false : true;
      const products = [...state.products];
      products[index] = { ...product, checked };
      return { ...state, products };
    }

    case CHECK_ALL_PRODUCTS_SUCCESS: {
      const products = state.products;
      products.map((v) => (v.checked = action.checked));
      return { ...state, products };
    }

    case DISCOUNT_PRODUCT_REQUEST: {
      return { ...state };
    }

    case DISCOUNT_PRODUCT_SUCCESS: {
      const filteredProducts =
        action.data[1] !== 0
          ? action.data[0].filter((v) => v.id == action.data[1])
          : action.data[0];
      console.log(action.data[0]);
      return {
        ...state,
        products: filteredProducts,
        originProducts: action.data[0],
      };
    }

    case DISCOUNT_PRODUCT_FAILURE: {
      return { ...state };
    }

    case ADD_CATEGORY_REQUEST: {
      return { ...state };
    }

    case ADD_CATEGORY_SUCCESS: {
      return { ...state, categories: [...state.categories, action.data] };
    }

    case ADD_CATEGORY_FAILURE: {
      return { ...state };
    }

    case EDIT_CATEGORY_REQUEST: {
      return { ...state };
    }

    case EDIT_CATEGORY_SUCCESS: {
      const index = state.categories.findIndex((v) => v.id == action.data.id);
      const categories = [...state.categories];
      categories[index] = action.data;
      return { ...state, categories };
    }

    case EDIT_CATEGORY_FAILURE: {
      return { ...state };
    }

    case DELETE_CATEGORY_REQUEST: {
      return { ...state };
    }

    case DELETE_CATEGORY_SUCCESS: {
      const filteredCategories = state.categories.filter((v) => v.id !== action.data.id);
      const products = state.originProducts.filter((v) => v.Category.id !== action.data.id);

      return {
        ...state,
        categories: filteredCategories,
        products,
        originProducts: products,
      };
    }

    case DISCOUNT_PRODUCT_FAILURE: {
      return { ...state };
    }

    case CATEGORY_FILTERED_SUCCESS: {
      if (action.id == 0) {
        return { ...state, products: state.originProducts };
      } else if (action.id == -1) {
        const discountedProduct = state.originProducts.filter((v) => v.Discount !== null);
        return { ...state, products: discountedProduct };
      } else {
        const filteredProducts = state.originProducts.filter((v) => v.Category.id == action.id);
        return { ...state, products: filteredProducts };
      }
    }

    case LOAD_SHOPLIST_REQUEST: {
      return { ...state, isLoadingShopList: true };
    }

    case LOAD_SHOPLIST_SUCCESS: {
      return { ...state, shopList: action.data, isLoadingShopList: false };
    }

    case LOAD_SHOPLIST_FAILURE: {
      return { ...state, isLoadingShopList: false, lodingShopListError: action.error };
    }

    case SET_COORDINATES_SUCCESS:
      return {
        ...state,
        userCoordinates: action.data,
      };

    case SET_SHOPCOORDINATES_SUCCESS: {
      console.log(action.data);
      return { ...state, shopCoordinates: action.data.shopCoordinates };
    }

    default: {
      return {
        ...state,
      };
    }
  }
};

export default reducer;
