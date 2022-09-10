import { createStore, compose, applyMiddleware } from "redux";
import { createWrapper } from "next-redux-wrapper";
import { composeWithDevTools } from "redux-devtools-extension";
import createSagaMiddleware from "redux-saga";
import rootSaga from "../sagas";
import rootReducer from "../reducers";
const { persistStore } = require("redux-persist");
import storage from "redux-persist/lib/storage/session";

const configureStore = () => {
  const sagaMiddleware = createSagaMiddleware();

  const middlewares = [sagaMiddleware];
  const enhencer =
    process.env.NODE_ENV === "production"
      ? compose(applyMiddleware(...middlewares))
      : composeWithDevTools(applyMiddleware(...middlewares));
  const rootStore = (reducer) => createStore(reducer, {}, enhencer);

  const isServer = typeof window === "undefined";
  if (isServer) {
    const store = rootStore(rootReducer);
    store.sagaTask = sagaMiddleware.run(rootSaga);
    return store;
  } else {
    const { persistReducer } = require("redux-persist");

    const persistConfig = {
      key: "nextjs",
      whitelist: ["user"],
      storage,
      transforms: [],
    };
    const persistedReducer = persistReducer(persistConfig, rootReducer);
    const store = rootStore(persistedReducer);
    store.sagaTask = sagaMiddleware.run(rootSaga);
    store.__persistor = persistStore(store);
    return store;
  }
};

const wrapper = createWrapper(configureStore, { debug: process.env.NODE_ENV !== "production" });

export default wrapper;
