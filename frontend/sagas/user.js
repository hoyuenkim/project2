import { fork, takeEvery, all, put, call, takeLatest } from "redux-saga/effects";
import axios from "axios";
import {
  LOAD_USER_SUCCESS,
  LOAD_USER_FAILURE,
  LOAD_USER_REQUEST,
  LOG_IN_REQUEST,
  LOG_IN_SUCCESS,
  LOG_IN_FAILURE,
  SIGN_UP_REQUEST,
  SIGN_UP_SUCCESS,
  SIGN_UP_FAILURE,
  PASSWORD_CHANGE_REQUEST,
  PASSWORD_CHANGE_SUCCESS,
  PASSWORD_CHANGE_FAILURE,
  ADD_SHOP_REQUEST,
  ADD_SHOP_SUCCESS,
  ADD_SHOP_FAILURE,
} from "../reducers/user";

function loginApi(loginData) {
  return axios.post("/user/login", loginData);
}

function* login(action) {
  try {
    const result = yield call(loginApi, action.data);
    yield put({
      type: LOG_IN_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.error(e);
    yield put({
      type: LOG_IN_FAILURE,
      error: e.response.data,
    });
  }
}

function* watchLogin() {
  console.log("Try logging in");
  yield takeEvery(LOG_IN_REQUEST, login);
}

function signUpApi(signUpData) {
  return axios.post("/user/signup", signUpData);
}

function* signUp(action) {
  try {
    const result = yield call(signUpApi, action.data);
    yield put({
      type: SIGN_UP_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: SIGN_UP_FAILURE,
      error: e,
    });
  }
}

function* watchSignUp() {
  yield takeEvery(SIGN_UP_REQUEST, signUp);
}

function loadUserApi() {
  return axios.get("/user");
}

function* loadUser() {
  try {
    const result = yield call(loadUserApi);
    yield put({
      type: LOAD_USER_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: LOAD_USER_FAILURE,
      error: e,
    });
  }
}

function* watchLoadUser() {
  yield takeEvery(LOAD_USER_REQUEST, loadUser);
}

function changePasswordApi({ id, password }) {
  return axios.post("/user/password/change", { id, password });
}

function* passwordChange(action) {
  try {
    const result = yield call(changePasswordApi, action.data);
    yield put({
      type: PASSWORD_CHANGE_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({
      type: PASSWORD_CHANGE_FAILURE,
      error: e,
    });
  }
}

function* watchPasswordChange() {
  yield takeLatest(PASSWORD_CHANGE_REQUEST, passwordChange);
}

function addShopAPI(data) {
  console.log(data);
  return axios.post("/shop/add", data);
}

function* addShop(action) {
  try {
    const result = yield call(addShopAPI, action.data);
    yield put({ type: ADD_SHOP_SUCCESS, data: result.data });
  } catch (err) {
    console.error(err);
    yield put({ type: ADD_SHOP_FAILURE, error: err });
  }
}

function* watchAddShop() {
  yield takeLatest(ADD_SHOP_REQUEST, addShop);
}

export default function* userSaga() {
  yield all([
    fork(watchLogin),
    fork(watchLoadUser),
    fork(watchSignUp),
    fork(watchPasswordChange),
    fork(watchAddShop),
  ]);
}
