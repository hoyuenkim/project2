import axios from "axios";
import { all, put, fork, call, takeLatest } from "redux-saga/effects";
import { LOAD_LIST_FAILURE, LOAD_LIST_REQUEST, LOAD_LIST_SUCCESS } from "../reducers/stock";

function loadListAPI({ ShopId }) {
  return axios.post("/stock/load", { ShopId });
}

function* loadList(action) {
  try {
    const result = yield call(loadListAPI, action.data);
    yield put({ type: LOAD_LIST_SUCCESS, data: result.data });
  } catch (err) {
    console.error(err);
    yield put({ type: LOAD_LIST_FAILURE, error: err.response });
  }
}

function* watchLoadList() {
  yield takeLatest(LOAD_LIST_REQUEST, loadList);
}

export default function* stockSaga() {
  yield all([watchLoadList]);
}
