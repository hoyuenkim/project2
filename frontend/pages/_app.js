import { useStore } from 'react-redux';
import { PersistGate } from 'redux-persist/integration/react';

import React from 'react';
import Head from 'next/head';
import 'antd/dist/antd.css';
import wrapper from '../store/configureStore';
import withReduxSaga from 'next-redux-saga';

const App = ({ Component }) => {
  const store = useStore((state) => state);

  return (
    <>
      <Head>
        <title>Order</title>
        <meta name="viewport" content="width=device-width, user-scalable=no" />
        <script
          type="text/javascript"
          src="https://code.jquery.com/jquery-1.12.4.min.js"
        ></script>
        <script
          type="text/javascript"
          src="https://cdn.iamport.kr/js/iamport.payment-1.1.5.js"
        ></script>
        <link
          href="https://fonts.googleapis.com/css2?family=Noto+Sans+KR&display=swap"
          rel="stylesheet"
        />
        <script src="https://ssl.daumcdn.net/dmaps/map_js_init/postcode.v2.js?autoload=false"></script>

        <script
          type="text/javascript"
          src="https://cdn.iamport.kr/js/iamport.payment-1.1.5.js"
        ></script>
        <style>
          {`body {
            background-color: #EFF2F5!important;
            font-family: 'Noto Sans KR', sans-serif;
          }`}
        </style>
        <script
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_RESTAPI}&libraries=services`}
        ></script>
        <script
          type="text/javascript"
          src={`//dapi.kakao.com/v2/maps/sdk.js?appkey=${process.env.NEXT_PUBLIC_KAKAO_JAVASCRIPT}&libraries=services,clusterer`}
        ></script>
      </Head>
      <PersistGate persistor={store.__persistor}>
        <Component />
      </PersistGate>
    </>
  );
};

export default wrapper.withRedux(withReduxSaga(App));
