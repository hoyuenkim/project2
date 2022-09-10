import { Form, Input, Card } from "antd";
import { useState } from "react";
import DaumPostcode from "react-daum-postcode";
import axios from "axios";

const KakaoAddress = ({ address, setAddress, setCoordinates }) => {
  axios.defaults.baseURL = process.env.BACKEND_IP;
  const [addressToggle, setAddressToggle] = useState(false);

  const handleComplete = (data) => {
    let fullAddress = data.address;
    let extraAddress = "";

    if (data.addressType === "R") {
      if (data.bname !== "") {
        extraAddress += data.bname;
      }
      if (data.buildingName !== "") {
        extraAddress += extraAddress !== "" ? `, ${data.buildingName}` : data.buildingName;
      }
      fullAddress += extraAddress !== "" ? ` (${extraAddress})` : "";
    }

    setAddress(fullAddress);

    axios
      .get(`https://dapi.kakao.com/v2/local/search/address.json?query=${fullAddress}`, {
        headers: {
          Authorization: `KakaoAK ${process.env.KAKAO_APIKEY}`,
        },
      })
      .then((res) => {
        const location = res.data.documents[0];
        console.log(location.address);
        setCoordinates([Number(location.address.x), Number(location.address.y)]);
      });

    setAddressToggle(false);
  };

  return (
    <>
      {addressToggle ? (
        <Card>
          <DaumPostcode onComplete={handleComplete} autoClose={true} height={"10"} />
        </Card>
      ) : (
        <Form.Item
          name="address"
          initialValue={address}
          rules={[{ required: true, message: "주소를 입력해주세요" }]}
        >
          <Input
            prefix="* 주소"
            name={"address"}
            readOnly
            onClick={() => setAddressToggle(true)}
            size={"large"}
          />
        </Form.Item>
      )}
    </>
  );
};

export default KakaoAddress;
