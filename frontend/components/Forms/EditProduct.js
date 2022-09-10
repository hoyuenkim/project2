import { useInput } from "../Generalui/CustomHooks";
import { useState } from "react";
import { Form, Input, Button, Upload, Select, Card } from "antd";
import ImgCrop from "antd-img-crop";
import { useDispatch } from "react-redux";
import { GiftOutlined, DollarOutlined, ProfileOutlined } from "@ant-design/icons";
import { EDIT_PRODUCT_REQUEST } from "../../reducers/shop";

const EditProduct = ({ product, setEdit, setProduct, categories }) => {
  const dispatch = useDispatch();

  const imageList = [];

  {
    product &&
      product.Images.map(async (v, i) => {
        return imageList.push({
          uid: i,
          name: v.url,
          status: "done",
          url: `${process.env.BACKEND_IP}/uploads/${v.url}`,
          ImageIds: v.id,
        });
      });
  }

  const [title, onChangeTitle] = useInput(product && product.title);
  const [price, onChangePrice] = useInput(product && product.price);
  const [description, onChangeDecription] = useInput(product && product.description);
  const [fileList, setFileList] = useState(imageList);
  const [fileError, setFileError] = useState(false);
  const [category, setCategory] = useState(product && product.Category.id);

  const onImagesChange = ({ fileList: newFileList }) => {
    setFileList(newFileList);
    setFileError(false);
  };

  const onChangeCategory = (e) => {
    setCategory(e);
  };

  const onPreview = async (file) => {
    let src = file.url;
    if (!src) {
      src = await new Promise((resolve) => {
        const reader = new FileReader();
        reader.readAsDataURL(file.originFileObj);
        reader.onload = () => resolve(reader.result);
      });
    }
    const image = new Image();
    image.src = src;
    const imgWindow = window.open(src);
    imgWindow.document.write(image.outerHTML);
  };

  const onFinish = () => {
    const formData = new FormData();
    formData.append("id", product.id);
    formData.append("title", title);
    formData.append("price", price);
    formData.append("description", description);
    formData.append("CategoryId", category);
    fileList.forEach(({ originFileObj, ImageIds }) => {
      if (ImageIds) formData.append("ImageIds", ImageIds);
      if (originFileObj) formData.append("files", originFileObj);
    });
    if (fileList.length > 0) {
      dispatch({
        type: EDIT_PRODUCT_REQUEST,
        formData,
      });
      setEdit(false);
      setProduct(null);
    } else {
      return setFileError(true);
    }
  };

  return (
    <Form
      encType={"multipart/form-data"}
      onFinish={onFinish}
      layout={"vertical"}
      initialValues={{
        title: product && product.title,
        price: product && product.price,
        description: product && product.description,
      }}
    >
      <Form.Item name="title" rules={[{ required: true, message: "상품명을 입력해주세요" }]}>
        <Input name="title" prefix={<GiftOutlined />} size={"large"} onChange={onChangeTitle} />
      </Form.Item>
      <Form.Item
        name="price"
        rules={[
          { required: true, message: "가격을 입력해주세요" },
          { pattern: /^[0-9]/g, message: "숫자를 입력해주세요" },
        ]}
      >
        <Input
          name="price"
          prefix={<DollarOutlined />}
          size={"large"}
          value={price}
          onChange={onChangePrice}
        />
      </Form.Item>
      <Form.Item
        name="description"
        label="설명"
        rules={[{ required: true, message: "상세내역을 입력해주세요" }]}
      >
        <Input.TextArea
          name="description"
          prefix={<ProfileOutlined />}
          size={"large"}
          placeholder={"상세사항을 입력해주세요"}
          maxLength={200}
          onChange={onChangeDecription}
        />
      </Form.Item>
      <Form.Item name="category" label="카테고리">
        <Select onChange={onChangeCategory} defaultValue={product.Category.id}>
          {categories.map((category, index) => (
            <Select.Option key={index} value={category.id}>
              {category.name}
            </Select.Option>
          ))}
        </Select>
      </Form.Item>
      <Card title={`image`}>
        <ImgCrop rotate aspect={4 / 3} name={"image"}>
          <Upload
            action="https://www.mocky.io/v2/5cc8019d300000980a055e76"
            listType="picture-card"
            fileList={fileList}
            onChange={onImagesChange}
            onPreview={onPreview}
          >
            {fileList.length < 5 && "+ Upload"}
          </Upload>
        </ImgCrop>
        {fileError && <div style={{ color: "red" }}>파일을 업로드 해주세요</div>}
      </Card>
      <Button type="primary" htmlType="submit" style={{ width: `100%` }}>
        제출
      </Button>
    </Form>
  );
};

export default EditProduct;
