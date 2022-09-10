import axios from "axios";
import { CLEAR_CART_REQUEST } from "../../reducers/cart";

export const onClickPayment = ({
  type,
  id,
  product,
  isLoggedIn,
  session,
  onChangeToggleModal,
  discount,
  dispatch,
  quantity,
  cart,
  ShopName,
  router,
  ShopId,
  TableId,
}) => {
  const onWindowScroll = () => {
    window.scrollTo({ top: 0 });
  };
  console.log(`global stock id: ${id}`);

  let originData;
  let amount = 0;
  let name;
  if (isLoggedIn) {
    if (type == "single") {
      originData = {
        StockId: id,
        UserId: session.id,
        UserName: session.name,
        ProductId: product.id,
        ShopId,
        price: product.price * (1 - discount),
        quantity,
        ShopName,
        ProductTitle: product.title,
      };
    } else {
      cart.map(
        (item) =>
          (amount += item.Discount
            ? item.price * (100 - item.Discount.rate) * 0.01
            : item.discount
            ? item.product.price * (1 - item.discount)
            : item.price),
      );
      console.log(amount);
      name =
        cart.length > 1
          ? `${product.product.title} 외 ${cart.length - 1} 건`
          : product.product.title;
      originData = cart.map((item) => {
        console.log(`originData stock id: ${item.id}`);
        return {
          StockId: item.id,
          UserId: session.id,
          UserName: session.name,
          ProductId: item.product.id,
          ShopId: item.ShopId,
          price: item.product.price * (1 - item.discount),
          quantity: item.quantity,
          ShopName: item.ShopName,
          ProductTitle: item.product.title,
        };
      });
    }

    const custom_data = JSON.stringify(type == "single" ? [originData] : originData);

    if (IMP !== null) {
      onWindowScroll();
      IMP.init(process.env.IAMPORT_KEY);
      const today = Date.now();
      IMP.request_pay(
        {
          pay_method: "card",
          name: type !== "cart" ? product.title : name,
          Merchant_uid: "uid" + today,
          amount:
            type !== "cart"
              ? product.Discount
                ? Math.ceil(product.price * (100 - product.Discount.rate) * 0.01) * product.quantity
                : discount
                ? Math.ceil(product.price * (1 - discount)) * quantity
                : product.price * product.quantity
              : amount,
          custom_data,
        },
        async (response) => {
          const { success, merchant_uid, error_msg } = response;
          try {
            if (success) {
              await axios.post(`${process.env.BACKEND_IP}/payments/complete`, {
                data: response,
              });
              const array = await JSON.parse(custom_data);
              await axios.post(`${process.env.BACKEND_IP}/stock/cart`, array);
              array.map(async (item) => {
                console.log(`stock sold, stock id: ${item.StockId}`);

                await axios.post(`${process.env.BACKEND_IP}/stock/sold`, {
                  id: item.StockId,
                  ProductId: item.id,
                  ShopId: item.ShopId,
                  quantity: item.quantity,
                });
              });
              dispatch({ type: CLEAR_CART_REQUEST });
              if (type == "cart") {
                router.push(
                  TableId === undefined ? `/menu/${ShopId}` : `/menu/${ShopId}/${TableId}`,
                );
              }
            } else {
              alert(`결제 실패: ${error_msg}`);
            }
          } catch (err) {
            return console.error(err.response);
          }
        },
      );
    }
  } else {
    onChangeToggleModal();
  }
};
