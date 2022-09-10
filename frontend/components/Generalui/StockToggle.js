import { PlusOutlined, MinusOutlined } from "@ant-design/icons";
import { useDispatch } from "react-redux";
import { Input } from "antd";
import { MINUS_QUANTITY_SUCCESS, PLUS_QUANTITY_SUCCESS } from "../../reducers/stock";

const AmountToggle = ({ id, quantity, stock }) => {
  const dispatch = useDispatch();
  const onClickAdd = () => {
    try {
      console.log(id);
      dispatch({ type: PLUS_QUANTITY_SUCCESS, data: { id } });
    } catch (err) {
      console.log(err);
    }
  };
  const onClickSubstract = () => {
    dispatch({ type: MINUS_QUANTITY_SUCCESS, data: { id } });
  };
  return (
    <Input
      style={{
        textAlign: "center",
        verticalAlign: "middle",
      }}
      value={quantity}
      readOnly
      size={"small"}
      maxLength={2}
      addonBefore={<PlusOutlined onClick={onClickAdd} />}
      addonAfter={<MinusOutlined onClick={onClickSubstract} />}
    />
  );
};

export default AmountToggle;
