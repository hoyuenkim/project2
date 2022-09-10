import produce from "immer";

const initialState = {
  stocks: [],
  originalStocks: [],
  isSoldStockError: false,
  errorMesssage: undefined,
};

export const LOAD_LIST_REQUEST = "LOAD_LIST_REQUEST";
export const LOAD_LIST_SUCCESS = "LOAD_LIST_SUCCESS";
export const LOAD_LIST_FAILURE = "LOAD_LIST_FAILURE";

export const ADD_STOCK_REQUEST = "ADD_STOCK_REQUEST";
export const ADD_STOCK_SUCCESS = "ADD_STOCK_SUCCESS";
export const ADD_STOCK_FAILURE = "ADD_STOCK_FAILURE";

export const SOLD_STOCK_SUCCESS = "SOLD_STOCK_SUCCESS";
export const SOLD_STOCK_FAILURE = "SOLD_STOCK_FAILRUE";

export const UPDATE_STOCK_SUCCESS = "UPDATE_STOCK_SUCCESS";
export const UPDATE_STOCK_FAILURE = "UPDATE_STOCK_FAILURE";

export const PLUS_QUANTITY_SUCCESS = "PLUS_QUANTITY_SUCCESS";

export const MINUS_QUANTITY_SUCCESS = "MINUS_QUANTITY_SUCCESS";

export const INITIATE_STOCK_QUANTITY_SUCCESS = "INITIATE_STOCK_QUANTITY_SUCCESS";

export const SEARCH_STOCK_PRODUCT_SUCCESS = "SEARCH_STOCK_PRODUCT_SUCCESS";

export const SELECT_STOCK_CATEGORY_SUCCESS = "SELECT_STOCK_CATEGORY_SUCCESS";

export default (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case LOAD_LIST_REQUEST:
        break;
      case LOAD_LIST_SUCCESS:
        draft.stocks = action.data.stocks;
        draft.originalStocks = action.data.stocks;
        break;
      case LOAD_LIST_FAILURE:
        break;

      case PLUS_QUANTITY_SUCCESS:
        {
          const product = draft.stocks.find((stock) => stock.id === action.data.id);
          let quantity = product.quantity;
          const stock = product.stock;
          quantity = quantity < stock ? (quantity += 1) : product.quantity;
          product.quantity = quantity;
        }
        break;

      case MINUS_QUANTITY_SUCCESS:
        {
          const product = draft.stocks.find((stock) => stock.id === action.data.id);
          let quantity = product.quantity;
          quantity = quantity > 1 ? (quantity -= 1) : 1;
          product.quantity = quantity;
        }
        break;

      case INITIATE_STOCK_QUANTITY_SUCCESS:
        {
          const product = draft.stocks.find((stock) => stock.id === action.data.id);
          product.quantity = 1;
        }
        break;

      case SEARCH_STOCK_PRODUCT_SUCCESS:
        {
          const products = draft.originalStocks.filter((stock) =>
            stock.Product.title.includes(action.data.text),
          );
          draft.stocks = products;
        }
        break;

      case SELECT_STOCK_CATEGORY_SUCCESS:
        {
          const products = draft.originalStocks.filter(
            (stock) => stock.Category.id === action.data.id,
          );
          draft.stocks = products;
        }
        break;

      case ADD_STOCK_SUCCESS: {
        const product = draft.stocks.find((stock) => stock.id === action.data.id);
        const originalProducts = draft.originalStocks.find((stock) => stock.id === action.data.id);
        if (product) {
          product.stock = action.data.stock;
          originalProducts.stock = action.data.stock;
          break;
        } else {
          draft.stocks = [...state.stocks, action.data];
          draft.originalStocks = [...state.originalStocks, action.data];
          break;
        }
      }

      case ADD_STOCK_FAILURE: {
        draft.addStockError = action.error;
      }

      case SOLD_STOCK_SUCCESS:
        {
          if (action.data.stock === 0) {
            draft.stocks = draft.stocks.filter((stock) => stock.id !== action.data.id);
            draft.originalStocks = draft.originalStocks.filter(
              (stock) => stock.id !== action.data.id,
            );
          } else {
            const product = draft.stocks.find((stock) => stock.id === action.data.id);
            const originalProducts = draft.originalStocks.find(
              (stock) => stock.id === action.data.id,
            );
            product.stock = action.data.stock;
            originalProducts.stock = action.data.stock;
          }
        }
        break;

      case SOLD_STOCK_FAILURE:
        {
          draft.isSoldStockError = true;
          draft.errorMesssage = action.data.message;
        }
        break;
      case UPDATE_STOCK_SUCCESS: {
        if (action.data.stock === 0) {
          draft.stocks = draft.stocks.filter((stock) => stock.id !== action.data.id);
          draft.originalStocks = draft.originalStocks.filter(
            (stock) => stock.id !== action.data.id,
          );
        } else {
          const product = draft.stocks.find((stock) => stock.id === action.data.id);
          const originalProducts = draft.originalStocks.find(
            (stock) => stock.id === action.data.id,
          );
          product.stock = action.data.stock;
          product.discount = action.data.discount;
          originalProducts.stock = action.data.stock;
          originalProducts.discount = action.data.discount;
        }
      }

      default:
        state;
        break;
    }
  });
};
