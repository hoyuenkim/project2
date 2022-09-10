import axios from "axios";
import { all, put, fork, call, takeLatest } from "redux-saga/effects";
import {
  LOAD_PRODUCTS_SUCCESS,
  LOAD_PRODUCTS_FAILURE,
  LOAD_PRODUCTS_REQUEST,
  LOAD_LIST_REQUEST,
  LOAD_LIST_SUCCESS,
  LOAD_LIST_FAILURE,
} from "../reducers/menu";

function loadProductApi(data) {
  return axios.post(`/menu`, { data });
}

function* loadProducts({ data }) {
  try {
    const result = yield call(loadProductApi, data);
    yield put({
      type: LOAD_PRODUCTS_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.log(e);
    yield put({
      type: LOAD_PRODUCTS_FAILURE,
      error: e,
    });
  }
}

function* watchLoadProducts() {
  yield takeLatest(LOAD_PRODUCTS_REQUEST, loadProducts);
}

function loadListAPI(data) {
  return axios.post("/stock/load", data);
}

function* loadList(action) {
  try {
    const result = yield call(loadListAPI, action.data);
    yield put({ type: LOAD_LIST_SUCCESS, data: result.data });
  } catch (err) {
    console.error(err);
    yield put({ type: LOAD_LIST_FAILURE, error: err });
  }
}

function* watchLoadList() {
  yield takeLatest(LOAD_LIST_REQUEST, loadList);
}

export default function* productsSaga() {
  yield all([fork(watchLoadProducts), fork(watchLoadList)]);
}
