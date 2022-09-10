const initialState = {
  isPaying: false,
  data: [],
  payingError: null,
  history: [],
  isLoadingHistory: false,
  loadingError: null,
  removingHistory: false,
  removingHistoryError: null,
  clientHistoryRemoving: false,
  clientHistoryRemovingError: null,
  isSeachingHistory: false,
  userCoordinates: undefined,
};

export const PAYMENT_REQUEST = "PAYMENT_REQUEST";
export const PAYMENT_SUCCESS = "PAYMENT_SUCCESS";
export const PAYMENT_FAILURE = "PAYMENT_FAILURE";

export const LOAD_PAYMENT_HISTORY_REQUEST = "LOAD_PAYMENT_HISTORY_REQUEST";
export const LOAD_PAYMENT_HISTORY_SUCCESS = "LOAD_PAYMENT_HISTORY_SUCCESS";
export const LOAD_PAYMENT_HISTORY_FAILURE = "LOAD_PAYMENT_HISTORY_FAILURE";

export const CLIENT_HISTORY_REMOVE_REQUEST = "CLIENT_HISTORY_REMOVE_REQUEST";
export const CLIENT_HISTORY_REMOVE_SUCCESS = "CLIENT_HISTORY_REMOVE_SUCCESS";
export const CLIENT_HISTORY_REMOVE_FAILURE = "CLIENT_HISTORY_REMOVE_FAILURE";

export const PAYMENT_HISTORY_REMOVE_REQUEST = "PAYMENT_HISTORY_REMOVE_REQUEST";
export const PAYMENT_HISTORY_REMOVE_SUCCESS = "PAYMENT_HISTORY_REMOVE_SUCCESS";
export const PAYMENT_HISTORY_REMOVE_FAILURE = "PAYMENT_HISTORY_REMOVE_FAILURE";

export const RATING_REQUEST = "RATING_REQUEST";
export const RATING_SUCCESS = "RATING_SUCCESS";
export const RATING_FAILURE = "RATING_FAILURE";

export const SEARCH_HISTORY_REQUEST = "SEARCH_HISTORY_REQUEST";
export const SEARCH_HISTORY_SUCCESS = "SEARCH_HISTORY_SUCCESS";
export const SEARCH_HISTORY_FAILURE = "SEARCH_HISTORY_FAILURE";

export default (state = initialState, action) => {
  switch (action.type) {
    case PAYMENT_REQUEST: {
      return { ...statem, isPaying: true };
    }
    case PAYMENT_SUCCESS: {
      // dispatch({ type: CLEAR_CART_REQUEST });
      return { ...state, isPaying: false };
    }
    case PAYMENT_FAILURE: {
      return { ...state, isPaying: false, payingError: action.error };
    }

    case LOAD_PAYMENT_HISTORY_REQUEST: {
      return {
        ...state,
        isLoadingHistory: true,
      };
    }
    case LOAD_PAYMENT_HISTORY_SUCCESS: {
      return { ...state, history: [...action.data], isLoadingHistory: false };
    }
    case LOAD_PAYMENT_HISTORY_FAILURE: {
      return { ...state, isLoadingHistory: false, loadingError: action.error };
    }

    case PAYMENT_HISTORY_REMOVE_REQUEST: {
      return { ...state, removingHistory: true };
    }

    case PAYMENT_HISTORY_REMOVE_SUCCESS: {
      const index = state.history.findIndex((v) => v.id === action.data.id);
      const history = state.history;
      const payment = history[index];
      payment.status = action.data.status;
      return { ...state, history, removingHistory: false };
    }

    case PAYMENT_HISTORY_REMOVE_FAILURE: {
      return { ...state, removingHistory: false };
    }

    case RATING_REQUEST: {
      return { ...state };
    }

    case RATING_SUCCESS: {
      const index = state.history.findIndex((v) => v.id === action.data.PaymentId);
      const log = state.history[index];
      let rating = action.data.rate;
      const history = [...state.history];
      history[index] = { ...log, Rating: { rate: rating } };
      return {
        ...state,
        history,
      };
    }

    case RATING_FAILURE: {
      return { ...state };
    }

    case SEARCH_HISTORY_REQUEST: {
      return { ...state, isSeachingHistory: true };
    }

    case SEARCH_HISTORY_SUCCESS: {
      return { ...state, history: action.data, isSeachingHistory: false };
    }

    case SEARCH_HISTORY_FAILURE: {
      return { ...state, isSeachingHistory: false };
    }

    default: {
      return { ...state };
    }
  }
};
