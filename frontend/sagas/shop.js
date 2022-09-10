import axios from 'axios';
import { all, put, fork, call, takeLatest } from 'redux-saga/effects';
import {
  ADD_PRODUCT_REQUEST,
  ADD_PRODUCT_SUCCESS,
  ADD_PRODUCT_FAILURE,
  ADMIN_PRODUCTS_REQUEST,
  ADMIN_PRODUCTS_SUCCESS,
  ADMIN_PRODUCTS_FAILURE,
  DELETE_PRODUCT_FAILURE,
  DELETE_PRODUCT_SUCCESS,
  DELETE_PRODUCT_REQUEST,
  SELECT_PRODUCT_FAILURE,
  SELECT_PRODUCT_SUCCESS,
  SELECT_PRODUCT_REQUEST,
  EDIT_PRODUCT_REQUEST,
  EDIT_PRODUCT_SUCCESS,
  EDIT_PRODUCT_FAILURE,
  DISCOUNT_PRODUCT_FAILURE,
  DISCOUNT_PRODUCT_SUCCESS,
  DISCOUNT_PRODUCT_REQUEST,
  ADD_CATEGORY_FAILURE,
  ADD_CATEGORY_SUCCESS,
  ADD_CATEGORY_REQUEST,
  EDIT_CATEGORY_REQUEST,
  EDIT_CATEGORY_SUCCESS,
  EDIT_CATEGORY_FAILURE,
  DELETE_CATEGORY_REQUEST,
  DELETE_CATEGORY_SUCCESS,
  DELETE_CATEGORY_FAILURE,
  DELETE_DISCOUNT_REQUEST,
  DELETE_DISCOUNT_SUCCESS,
  DELETE_DISCOUNT_FAILURE,
  LOAD_SHOPLIST_FAILURE,
  LOAD_SHOPLIST_SUCCESS,
  LOAD_SHOPLIST_REQUEST,
  ADD_SHOP_SUCCESS,
  ADD_SHOP_FAILURE,
  ADD_SHOP_REQUEST,
} from '../reducers/shop';

function addProductApi(data) {
  return axios.post('/products/add', data, {
    headers: { 'Content-Type': 'multipart/form-data' },
  });
}
function* addProduct(action) {
  try {
    const result = yield call(addProductApi, action.formData);
    yield put({ type: ADD_PRODUCT_SUCCESS, data: result.data });
  } catch (e) {
    console.log(e);
    yield put({ type: ADD_PRODUCT_FAILURE, error: e });
  }
}
function* watchAddProduct() {
  yield takeLatest(ADD_PRODUCT_REQUEST, addProduct);
}

function loadProductsApi(ShopId) {
  console.log(ShopId);
  return axios.post('/products/load', { ShopId });
}
function* loadProducts(action) {
  try {
    const result = yield call(loadProductsApi, action.ShopId);
    console.log(result.data);
    yield put({ type: ADMIN_PRODUCTS_SUCCESS, data: result.data });
  } catch (e) {
    console.log(e);
    yield put({ type: ADMIN_PRODUCTS_FAILURE, error: e });
  }
}
function* watchLoadProducts() {
  yield takeLatest(ADMIN_PRODUCTS_REQUEST, loadProducts);
}

function deleteProductAPI(id) {
  return axios.post('/products/delete', { id });
}
function* deleteProduct(action) {
  try {
    yield call(deleteProductAPI, action.id);
    yield put({ type: DELETE_PRODUCT_SUCCESS, data: action.id });
  } catch (e) {
    console.log(e);
    yield put({ type: DELETE_PRODUCT_FAILURE, error: e });
  }
}
function* watchDeleteProduct() {
  yield takeLatest(DELETE_PRODUCT_REQUEST, deleteProduct);
}

function selectProductAPI(ProductId) {
  console.log({ ProductId });
  return axios.post('/products/select', { ProductId });
}
function* selectProduct(action) {
  try {
    const result = yield call(selectProductAPI, action.ProductId);

    yield put({
      type: SELECT_PRODUCT_SUCCESS,
      data: result.data,
    });
  } catch (e) {
    console.log(e);
    put({ type: SELECT_PRODUCT_FAILURE, error: e });
  }
}
function* watchSelectProduct() {
  yield takeLatest(SELECT_PRODUCT_REQUEST, selectProduct);
}

function editProdudctAPI(data) {
  return axios.post('/products/edit', data);
}

function* editProduct(action) {
  try {
    console.log('result');
    const result = yield call(editProdudctAPI, action.formData);
    console.log(result);
    yield put({ type: EDIT_PRODUCT_SUCCESS, data: result.data });
  } catch (e) {
    console.log(e);
    yield put({ type: EDIT_PRODUCT_FAILURE, error: e });
  }
}

function* watchEditProduct() {
  yield takeLatest(EDIT_PRODUCT_REQUEST, editProduct);
}

function discountProductAPI(data) {
  return axios.post('/products/discount', data);
}

function* discountProduct(action) {
  try {
    const result = yield call(discountProductAPI, action.data);
    yield put({ type: DISCOUNT_PRODUCT_SUCCESS, data: result.data });
  } catch (e) {
    console.log(e);
    yield put({ type: DISCOUNT_PRODUCT_FAILURE, error: e });
  }
}

function* watchDiscountProduct() {
  yield takeLatest(DISCOUNT_PRODUCT_REQUEST, discountProduct);
}

function addCategoryAPI(data) {
  return axios.post('/products/category/add', data);
}

function* addCategory(action) {
  try {
    const result = yield call(addCategoryAPI, action.data);
    yield put({ type: ADD_CATEGORY_SUCCESS, data: result.data });
  } catch (e) {
    console.log(e);
    yield put({ type: ADD_CATEGORY_FAILURE, error: e });
  }
}

function* watchAddCategory() {
  yield takeLatest(ADD_CATEGORY_REQUEST, addCategory);
}

function editCategoryAPI(data) {
  return axios.post('/products/category/update', data);
}

function* editCategory(action) {
  try {
    const result = yield call(editCategoryAPI, action.data);
    yield put({ type: EDIT_CATEGORY_SUCCESS, data: result.data });
  } catch (e) {
    console.log(e);
    yield put({ type: EDIT_CATEGORY_FAILURE, error: e });
  }
}

function* watchEditCategory() {
  yield takeLatest(EDIT_CATEGORY_REQUEST, editCategory);
}

function deleteCategoryAPI(data) {
  return axios.post('/products/category/delete', data);
}

function* deleteCategory(action) {
  try {
    const result = yield call(deleteCategoryAPI, action.data);
    yield put({ type: DELETE_CATEGORY_SUCCESS, data: result.data });
  } catch (e) {
    console.log(e);
    yield put({ type: DELETE_CATEGORY_FAILURE, error: e });
  }
}

function* watchDeleteCategory() {
  yield takeLatest(DELETE_CATEGORY_REQUEST, deleteCategory);
}

function deleteDiscountAPI({ ProductIds, ShopId, CategoryId }) {
  console.log(ProductIds, ShopId, CategoryId);
  return axios.post('/products/discount/delete', {
    ProductIds,
    ShopId,
    CategoryId,
  });
}

function* deleteDiscount(action) {
  try {
    const result = yield call(deleteDiscountAPI, action.data);
    yield put({ type: DELETE_DISCOUNT_SUCCESS, data: result.data });
  } catch (e) {
    console.log(e);
    yield put({ type: DELETE_DISCOUNT_FAILURE, error: e });
  }
}

function* watchDeleteDiscount() {
  yield takeLatest(DELETE_DISCOUNT_REQUEST, deleteDiscount);
}

function loadShopListAPI({ ShopId }) {
  return axios.post('/shop/list', { ShopId });
}

function* loadShopList(action) {
  try {
    const result = yield call({ loadShopListAPI, ShopId: action.ShopId });
    yield put({ type: LOAD_SHOPLIST_SUCCESS, data: result.data });
  } catch (err) {
    console.error(err);
    yield put({ type: LOAD_SHOPLIST_FAILURE });
  }
}

function* watchLoadShopList() {
  yield takeLatest(LOAD_SHOPLIST_REQUEST, loadShopList);
}

export default function* productsSaga() {
  yield all([
    fork(watchAddProduct),
    fork(watchLoadProducts),
    fork(watchDeleteProduct),
    fork(watchSelectProduct),
    fork(watchEditProduct),
    fork(watchDiscountProduct),
    fork(watchEditCategory),
    fork(watchDeleteCategory),
    fork(watchAddCategory),
    fork(watchDeleteDiscount),
    fork(watchLoadShopList),
    // fork(watchAddShop),
  ]);
}
