import { all, fork } from 'redux-saga/effects';
import axios from 'axios';
import user from './user';
import shop from './shop';
import menu from './menu';
import payment from './payment';

axios.defaults.baseURL = `${process.env.BACKEND_IP}`;

function* rootSaga() {
  yield all([fork(user), fork(shop), fork(menu), fork(payment)]);
}

export default rootSaga;
