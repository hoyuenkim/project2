import { Input, Modal, List } from 'antd';
import { useDispatch } from 'react-redux';
// import { SEARCH_PRODUCT_SUCCESS } from "../../reducers/menu";
import { useState } from 'react';
import axios from 'axios';
import { SEARCH_STOCK_PRODUCT_SUCCESS } from '../../reducers/stock';

const SearchBar = ({ setToggleSearch, setVisible, type, setList }) => {
  const dispatch = useDispatch();
  const [text, setText] = useState();
  const onChangeText = (e) => setText(e.target.value);

  const onSearch = () => {
    if (type == 'menu') {
      // dispatch({
      //   type: SEARCH_PRODUCT_SUCCESS,
      //   data: { text },
      // });
    } else if (type == 'index') {
      axios
        .get(
          `https://dapi.kakao.com/v2/local/search/keyword?query=${text}&size=15`,
          {
            headers: {
              Authorization: `KakaoAK ${process.env.KAKAO_APIKEY}`,
            },
          }
        )
        .then((res) => {
          const location = res.data.documents;
          setList(location);
          setVisible(true);
        });
    } else if (type == 'store') {
      dispatch({
        type: SEARCH_STOCK_PRODUCT_SUCCESS,
        data: { text },
      });
    }
    setText();
    setToggleSearch(false);
  };

  return (
    <Input.Search
      size={'large'}
      value={text}
      onChange={onChangeText}
      enterButton
      onSearch={onSearch}
    />
  );
};

export default SearchBar;
