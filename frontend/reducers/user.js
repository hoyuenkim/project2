import produce from "immer";

const initialState = {
  isSigningUp: false,
  signUpSuccess: false,
  signUpError: null,
  isLoggedIn: false,
  isLoggingIn: false,
  loginError: null,
  isLoggingOut: false,
  logoutError: null,
  session: null,
  isLoadingUser: false,
  loadingUserError: null,
  changingPassword: false,
  passwordChangeError: null,
  isAddingShop: false,
  addShopError: null,
  userCoordinates: undefined,
};

export const LOG_IN_REQUEST = "LOG_IN_REQUEST";
export const LOG_IN_SUCCESS = "LOG_IN_SUCCESS";
export const LOG_IN_FAILURE = "LOG_IN_FAILURE";

export const LOG_OUT_SUCCESS = "LOG_OUT_SUCCESS";

export const SIGN_UP_REQUEST = "SIGN_IN_REQUEST";
export const SIGN_UP_SUCCESS = "SIGN_IN_SUCCESS";
export const SIGN_UP_FAILURE = "SIGN_IN_FAILURE";

export const LOAD_USER_REQUEST = "LOAD_USER_REQUEST";
export const LOAD_USER_SUCCESS = "LOAD_USER_SUCCESS";
export const LOAD_USER_FAILURE = "LOAD_USER_FAILURE";

export const PASSWORD_CONFIRM_REQUEST = "PASSWORD_CONFIRM_REQUEST";
export const PASSWORD_CONFIRM_SUCCESS = "PASSWORD_CONFIRM_SUCCESS";
export const PASSWORD_CONFIRM_FAILURE = "PASSWORD_CONFIRM_FAILURE";

export const PASSWORD_CHANGE_REQUEST = "PASSWORD_CHANGE_REQUEST";
export const PASSWORD_CHANGE_SUCCESS = "PASSWORD_CHANGE_SUCCESS";
export const PASSWORD_CHANGE_FAILURE = "PASSWORD_CHANGE_FAILURE";

export const ADD_SHOP_REQUEST = "ADD_SHOP_REQUEST";
export const ADD_SHOP_SUCCESS = "ADD_SHOP_SUCCESS";
export const ADD_SHOP_FAILURE = "ADD_SHOP_FAILURE";

export default (state = initialState, action) => {
  return produce(state, (draft) => {
    switch (action.type) {
      case SIGN_UP_REQUEST:
        draft.isSigningUp = true;
        break;
      case SIGN_UP_SUCCESS:
        draft.isSigningUp = false;
        draft.signUpSuccess = true;
        break;
      case SIGN_UP_FAILURE:
        draft.isSigningUp = false;
        draft.signUpFailure = action.error;
        break;
      case LOAD_USER_REQUEST:
        draft.isLoadingUser = true;
        break;
      case LOAD_USER_SUCCESS:
        draft.isLoadingUser = false;
        draft.session = action.data;
        break;
      case LOAD_USER_FAILURE:
        draft.isLoadingUser = false;
        draft.loadingUserError = action.error;
        break;
      case LOG_IN_REQUEST:
        draft.isLoggingIn = true;
        break;
      case LOG_IN_SUCCESS:
        draft.isLoggingIn = false;
        draft.isLoggedIn = true;
        draft.session = action.data.fullUser;
        draft.loginError = null;
        break;
      case LOG_IN_FAILURE:
        draft.isLoggingIn = false;
        draft.loginError = action.error;
        break;
      case LOG_OUT_SUCCESS:
        draft.session = null;
        draft.isLoggedIn = false;
        draft.loginError = null;

      case PASSWORD_CHANGE_REQUEST:
        draft.changingPassword = true;
      case PASSWORD_CHANGE_SUCCESS:
        draft.changingPassword = false;
      case PASSWORD_CHANGE_FAILURE:
        draft.changingPassword = false;
        draft.passwordChangeError = action.error;
      case ADD_SHOP_REQUEST:
        draft.isAddingShop = true;
        break;
      case ADD_SHOP_SUCCESS:
        draft.isAddingShop = false;
        draft.session.Shops = [action.data, ...draft.session.Shops];
        break;
      case ADD_SHOP_FAILURE:
        draft.isAddingShop = false;
        draft.addShopError = action.error;
        break;

      default:
        state;
        break;
    }
  });
};
