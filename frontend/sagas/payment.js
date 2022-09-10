import {
  fork,
  takeEvery,
  all,
  put,
  call,
  takeLatest,
} from 'redux-saga/effects';
import axios from 'axios';

import {
  LOAD_PAYMENT_HISTORY_FAILURE,
  LOAD_PAYMENT_HISTORY_REQUEST,
  LOAD_PAYMENT_HISTORY_SUCCESS,
  RATING_FAILURE,
  RATING_SUCCESS,
  RATING_REQUEST,
  SEARCH_HISTORY_SUCCESS,
  SEARCH_HISTORY_FAILURE,
  SEARCH_HISTORY_REQUEST,
  PAYMENT_HISTORY_REMOVE_REQUEST,
  PAYMENT_HISTORY_REMOVE_FAILURE,
  PAYMENT_HISTORY_REMOVE_SUCCESS,
} from '../reducers/payment';

function paymentHistoryAPI(data) {
  return axios.post('/payments/load', {
    id: data.id,
    ShopId: data.ShopId,
    division: data.division,
  });
}

function* paymentHistory(data) {
  try {
    const result = yield call(paymentHistoryAPI, data);
    yield put({
      type: LOAD_PAYMENT_HISTORY_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    yield put({ type: LOAD_PAYMENT_HISTORY_FAILURE, error: e });
  }
}

function* watchPaymentHistory() {
  yield takeLatest(LOAD_PAYMENT_HISTORY_REQUEST, paymentHistory);
}

function ratingAPI({ data }) {
  return axios.post('/payments/rating', {
    PaymentsId: data.PaymentsId,
    UserId: data.UserId,
    ProductId: data.ProductId,
    rate: data.rate,
  });
}

function* rating(data) {
  try {
    const result = yield call(ratingAPI, data);
    yield put({ type: RATING_SUCCESS, data: result.data });
  } catch (e) {
    console.log(e);
    yield put({ type: RATING_FAILURE, error: e });
  }
}

function* watchRating() {
  yield takeLatest(RATING_REQUEST, rating);
}

function searchHistoryAPI({ data }) {
  console.log(data);
  if (data.division == true) {
    return axios.post('/payments/search/shop', { data });
  } else {
    return axios.post('/payments/search/user', { data });
  }
}

function* searchHistory(data) {
  try {
    const result = yield call(searchHistoryAPI, data);
    yield put({ type: SEARCH_HISTORY_SUCCESS, data: result.data });
  } catch (e) {
    console.log(e);
    yield put({ type: SEARCH_HISTORY_FAILURE });
  }
}

function* watchSearchHistory() {
  yield takeLatest(SEARCH_HISTORY_REQUEST, searchHistory);
}

function cancelPaymentAPI({ id, UserId, division, imp_uid, amount }) {
  return axios.post('/payments/cancel', {
    id,
    UserId,
    division,
    imp_uid,
    amount,
  });
}

function* cancelPayment(action) {
  try {
    const result = yield call(cancelPaymentAPI, action.data);
    console.log(result.data);
    yield put({ type: PAYMENT_HISTORY_REMOVE_SUCCESS, data: result.data });
  } catch (err) {
    console.log(err);
    yield put({ type: PAYMENT_HISTORY_REMOVE_FAILURE, error: err });
  }
}

function* watchCancelPayment() {
  yield takeLatest(PAYMENT_HISTORY_REMOVE_REQUEST, cancelPayment);
}

export default function* userSaga() {
  yield all([
    fork(watchPaymentHistory),
    fork(watchRating),
    fork(watchSearchHistory),
    fork(watchCancelPayment),
  ]);
}
