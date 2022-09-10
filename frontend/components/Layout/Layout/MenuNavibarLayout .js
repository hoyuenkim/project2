import { Menu } from "antd";
import { useDispatch } from "react-redux";
import { SELECT_CATEGORY_SUCCESS } from "../../reducers/menu";
import { CATEGORY_FILTERED_SUCCESS, ADMIN_PRODUCTS_REQUEST } from "../../reducers/shop";

const MenuNavibarLayout = ({
  categories,
  type,
  setCategory,
  ShopId,
  products,
  originProducts,
  originalStocks,
}) => {
  const dispatch = useDispatch();

  const isSale = originProducts[0] ? originProducts.findIndex((v) => v.Discount) : -1;

  return (
    <Menu mode="horizontal">
      <Menu.Item
        key={"entire"}
        onClick={() => {
          type === "menu" || "stock"
            ? dispatch({
                type: SELECT_CATEGORY_SUCCESS,
                id: 0,
              })
            : dispatch({ type: ADMIN_PRODUCTS_REQUEST, ShopId });
          return setCategory(0);
        }}
      >
        전체
      </Menu.Item>
      {isSale > -1 && (
        <Menu.Item
          key={"sale"}
          onClick={() => {
            type === "menu"
              ? dispatch({
                  type: SELECT_CATEGORY_SUCCESS,
                  id: -1,
                })
              : dispatch({ type: ADMIN_PRODUCTS_REQUEST, id: -1 });
            return setCategory(0);
          }}
          style={{ color: "magenta" }}
        >
          세일!
        </Menu.Item>
      )}
      {categories.map((category) => (
        <Menu.Item key={category.id}>
          <a
            onClick={() => {
              dispatch({
                type: type == "menu" ? SELECT_CATEGORY_SUCCESS : CATEGORY_FILTERED_SUCCESS,
                id: category.id,
              });
              return setCategory(category.id);
            }}
          >
            {category.name}
          </a>
        </Menu.Item>
      ))}
    </Menu>
  );
};

export default MenuNavibarLayout;
