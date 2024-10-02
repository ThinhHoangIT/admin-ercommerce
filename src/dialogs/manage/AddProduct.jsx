import { useEffect, useState } from 'react';
import {
  Modal,
  Button,
  Form,
  Input,
  Select,
  Col,
  Row,
  Radio,
  ColorPicker,
} from 'antd';
import NiceModal, { useModal } from '@ebay/nice-modal-react';
import styled from 'styled-components';
import UploadWidget from '@/components/ImageUpload';
import { PlusOutlined, DeleteOutlined } from '@ant-design/icons';

import api from '@/services/api';
import { PRODUCT_TYPES, SIZES } from '@/commons/constants';
import { getProductTypeName, getSizeName } from '@/commons/locale';

const { TextArea } = Input;

const CustomForm = styled(Form)({
  marginTop: 24,
  marginBottom: 24,
});

const ImageContainer = styled.div`
  display: flex;
  flex-wrap: wrap;
  gap: 1rem;
`;

const ImageWrapper = styled.div`
  position: relative;
  width: 80px;
  height: 80px;
  padding-bottom: 8px;
`;

const RemoveButton = styled(DeleteOutlined)`
  position: absolute;
  top: 0;
  right: 0;
  padding: 2px 4px;
  background-color: #f56565;
  color: white;
  border: none;
`;

const RemoveIcon = styled(DeleteOutlined)`
  align-content: center;
  padding-left: 32px;
  color: red;
`;

const AddButton = styled(Button)`
  margin-top: 16px;
`;

const StyledImage = styled.img`
  object-fit: cover;
  border-radius: 8px;
  width: 100%;
  height: 100%;
`;

const AddProduct = NiceModal.create(({ data, onSuccess, messageApi }) => {
  const modal = useModal();
  const [form] = Form.useForm();
  const [brands, setBrands] = useState([]);
  const [categories, setCategories] = useState([]);
  const [img, setImg] = useState(data?.img || '');

  useEffect(() => {
    // Fetch brands
    api
      .getBrands()
      .then(response => {
        const formattedBrands = response.data?.map(brand => ({
          label: brand.name,
          value: brand.id,
        }));
        setBrands(formattedBrands);
      })
      .catch(error => {
        console.log('Get brands error', error);
      });

    // Fetch categories
    api
      .getCategories()
      .then(response => {
        const formattedCategories = response.data?.map(category => ({
          label: category.name,
          value: category.id,
        }));
        setCategories(formattedCategories);
      })
      .catch(error => {
        console.log('Get categories error', error);
      });

    // Set initial values for form
    if (data) {
      // Ensure imageURLs has img as string
      const initialImageURLs =
        data.imageURLs?.map(imageURL => ({
          ...imageURL,
          img: imageURL.img || '',
        })) || [];
      form.setFieldsValue({
        ...data,
        imageURLs: initialImageURLs,
      });
    }
  }, [data, form]);

  const onFinish = values => {
    if (values.imageURLs && Array.isArray(values.imageURLs)) {
      values.imageURLs.forEach(imageURL => {
        if (typeof imageURL.color?.hex !== 'string') {
          imageURL.color.hex = imageURL.color.hex.toHex();
        }
      });
    }

    const productData = { ...values, img };

    if (data?.id) {
      // Handle update
      const updatedValues = {};
      Object.keys(values).forEach(key => {
        if (typeof values[key] !== 'object') {
          if (values[key] !== data[key]) {
            updatedValues[key] = values[key];
          }
        } else {
          if (JSON.stringify(values[key]) !== JSON.stringify(data[key])) {
            updatedValues[key] = values[key];
          }
        }
      });
      if (!Object.keys(updatedValues).length) {
        return;
      }

      api
        .updateProduct(data.id, { ...updatedValues })
        .then(() => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Update product error', error);
          if (error?.response?.data?.message === 'Product is already exists') {
            messageApi.error('Mã sản phẩm đã tồn tại');
          } else {
            messageApi.error('Lỗi khi cập nhật sản phẩm');
          }
        });
    } else {
      // Handle create
      api
        .createProduct(productData)
        .then(() => {
          onSuccess?.();
          modal.hide();
        })
        .catch(error => {
          console.log('Add product error', error);
          if (error?.response?.data?.message === 'Product is already exists') {
            messageApi.error('Mã sản phẩm đã tồn tại');
          } else {
            messageApi.error('Lỗi khi thêm sản phẩm');
          }
        });
    }
  };

  const onChangeImg = url => {
    setImg(url);
  };

  const onRemoveImg = () => {
    setImg('');
  };

  const optionProductTypes = Object.values(PRODUCT_TYPES).map(feature => ({
    label: getProductTypeName(feature),
    value: feature,
  }));

  const optionSize = Object.values(SIZES).map(feature => ({
    label: getSizeName(feature),
    value: feature,
  }));

  const handleImageUpload = (url, name) => {
    const imageURLs = form.getFieldValue('imageURLs') || [];
    const updatedImageURLs = imageURLs.map((imageURL, index) => {
      if (index === name) {
        return { ...imageURL, img: url };
      }
      return imageURL;
    });
    form.setFieldsValue({ imageURLs: updatedImageURLs });
  };

  return (
    <Modal
      title={data?.id ? 'Chỉnh sửa sản phẩm' : 'Thêm sản phẩm'}
      open={modal.visible}
      onCancel={modal.hide}
      afterClose={modal.remove}
      width={1000}
      footer={[
        <Button key="cancel" onClick={modal.hide}>
          Hủy
        </Button>,
        <Button form="add-form" key="submit" htmlType="submit" type="primary">
          {data?.id ? 'Cập nhật' : 'Thêm'}
        </Button>,
      ]}
    >
      <CustomForm
        id="add-form"
        form={form}
        onFinish={onFinish}
        autoComplete="off"
        labelCol={{ span: 8 }}
      >
        <Row gutter={16}>
          <Col span={11}>
            <Form.Item
              name="id"
              label="Mã sản phẩm"
              rules={[
                { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
              ]}
              initialValue={data?.id || ''}
            >
              <Input
                placeholder="Ví dụ: SP01, SP02, ..."
                autoComplete="nope"
                spellCheck={false}
                allowClear
                disabled={!!data?.id}
              />
            </Form.Item>
            <Form.Item
              name="name"
              label="Tên sản phẩm"
              rules={[
                { required: true, message: 'Vui lòng điền đầy đủ thông tin' },
              ]}
              initialValue={data?.name || ''}
            >
              <Input
                placeholder="Ví dụ: Bluetooth Headphones,..."
                autoComplete="nope"
                spellCheck={false}
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="brand"
              label="Hãng"
              rules={[{ required: true, message: 'Vui lòng chọn hãng' }]}
              initialValue={data?.brandData?.id || null}
            >
              <Select allowClear placeholder="Chọn hãng" options={brands} />
            </Form.Item>

            <Form.Item
              name="category"
              label="Loại sản phẩm"
              rules={[
                { required: true, message: 'Vui lòng chọn loại sản phẩm' },
              ]}
              initialValue={data?.categoryData?.id || null}
            >
              <Select
                allowClear
                placeholder="Chọn loại sản phẩm"
                options={categories}
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="quantity"
              label="Số lượng"
              rules={[{ required: true, message: 'Vui lòng điền số lượng' }]}
              initialValue={data?.quantity || null}
            >
              <Input
                autoComplete="nope"
                spellCheck={false}
                placeholder="Chọn số lượng"
                allowClear
                type="number"
              />
            </Form.Item>
            <Form.Item
              name="price"
              label="Giá"
              rules={[
                { required: true, message: 'Vui lòng điền giá sản phẩm' },
              ]}
              initialValue={data?.price || null}
            >
              <Input
                autoComplete="nope"
                placeholder="Chọn giá sản phẩm"
                spellCheck={false}
                allowClear
                type="number"
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="productType"
              label="Thể loại"
              initialValue={data?.productType || null}
            >
              <Select
                allowClear
                placeholder="Chọn thể loại"
                options={optionProductTypes}
              />
            </Form.Item>
            <Form.Item name="tags" label="Nhãn" initialValue={data?.tags || []}>
              <Select
                mode="tags"
                style={{ width: '100%' }}
                placeholder="Nhập nhãn sản phẩm"
                allowClear
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="sizes"
              label="Kích cỡ"
              initialValue={data?.sizes || []}
            >
              <Select
                mode="multiple"
                allowClear
                placeholder="Chọn kích cỡ"
                options={optionSize}
              />
            </Form.Item>
            <Form.Item name="img" label="Ảnh sản phẩm">
              {img !== '' && (
                <ImageContainer>
                  <ImageWrapper key={img}>
                    <RemoveButton
                      type="button"
                      onClick={onRemoveImg}
                    ></RemoveButton>
                    <StyledImage src={img} alt="img-product" />
                  </ImageWrapper>
                </ImageContainer>
              )}
              <UploadWidget onChange={onChangeImg} />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="status"
              rules={[
                {
                  required: true,
                  message: 'Vui lòng chọn trạng thái sản phẩm',
                },
              ]}
              label="Trạng thái"
              initialValue={data?.status}
            >
              <Radio.Group>
                <Radio value={'in-stock'}>Còn hàng</Radio>
                <Radio value={'out-of-stock'}>Hết hàng</Radio>
                {/* <Radio value={'discontinued'}>Ngừng bán</Radio> */}
              </Radio.Group>
            </Form.Item>
            <Form.Item
              name="discount"
              label="Giảm giá"
              initialValue={data?.discount || 0}
            >
              <Input
                type="number"
                autoComplete="nope"
                placeholder="Chọn % giảm giá"
                allowClear
                min={0}
                max={100}
              />
            </Form.Item>
          </Col>
          <Col span={11}>
            <Form.Item
              name="description"
              label="Mô tả"
              rules={[
                { required: true, message: 'Vui lòng điền mô tả sản phẩm' },
              ]}
              initialValue={data?.description || ''}
            >
              <TextArea
                placeholder="Mô tả sản phẩm"
                autoComplete="nope"
                spellCheck={false}
                allowClear
              />
            </Form.Item>
          </Col>
        </Row>
        <Form.List name="additionalInformation" label="Thông tin bổ sung">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key}>
                  <Col span={11}>
                    <Form.Item
                      {...restField}
                      name={[name, 'key']}
                      label="Thông số"
                      rules={[
                        {
                          required: false,
                          message: 'Vui lòng nhập thông số',
                        },
                      ]}
                    >
                      <Input placeholder="Nhập thông số'," allowClear />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      {...restField}
                      name={[name, 'value']}
                      label="Chi tiết"
                      rules={[
                        {
                          required: false,
                          message: 'Vui lòng nhập chi tiết',
                        },
                      ]}
                    >
                      <Input placeholder="Nhập chi tiết'," allowClear />
                    </Form.Item>
                  </Col>
                  <div className="row">
                    <RemoveIcon onClick={() => remove(name)} />
                  </div>
                </Row>
              ))}
              <Form.Item>
                <AddButton
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm thông tin bổ sung
                </AddButton>
              </Form.Item>
            </>
          )}
        </Form.List>
        <Form.List name="imageURLs" label="Bộ ảnh">
          {(fields, { add, remove }) => (
            <>
              {fields.map(({ key, name, ...restField }) => (
                <Row key={key}>
                  <Col span={11}>
                    <Form.Item
                      {...restField}
                      name={[name, 'color', 'name']}
                      label="Tên màu"
                      rules={[
                        {
                          required: false,
                          message: 'Vui lòng nhập tên màu',
                        },
                      ]}
                    >
                      <Input placeholder="Nhập tên màu" allowClear />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'color', 'hex']}
                      label="Mã màu"
                      rules={[
                        {
                          required: false,
                          message: 'Vui lòng nhập mã màu',
                        },
                      ]}
                      initialValue="FFFFFF"
                    >
                      <ColorPicker showText disabledAlpha />
                    </Form.Item>
                  </Col>
                  <Col span={11}>
                    <Form.Item
                      {...restField}
                      name={[name, 'sizes']}
                      label="Kích cỡ"
                    >
                      <Select
                        mode="multiple"
                        allowClear
                        placeholder="Chọn kích cỡ"
                        options={optionSize}
                      />
                    </Form.Item>
                    <Form.Item
                      {...restField}
                      name={[name, 'img']}
                      label="Bộ ảnh"
                      valuePropName="value"
                      getValueFromEvent={e => {
                        return e;
                      }}
                      rules={[
                        {
                          required: false,
                          message: 'Vui lòng tải ảnh ảnh',
                        },
                      ]}
                    >
                      <ImageContainer>
                        {form.getFieldValue(['imageURLs', name, 'img']) && (
                          <ImageWrapper
                            key={form.getFieldValue(['imageURLs', name, 'img'])}
                          >
                            <RemoveButton
                              type="button"
                              onClick={() => remove(name)}
                            />
                            <StyledImage
                              src={form.getFieldValue([
                                'imageURLs',
                                name,
                                'img',
                              ])}
                              alt={`img-${name}`}
                            />
                          </ImageWrapper>
                        )}
                      </ImageContainer>
                      <UploadWidget
                        onChange={url => handleImageUpload(url, name)}
                      />
                    </Form.Item>
                  </Col>
                  <div className="row">
                    <RemoveIcon onClick={() => remove(name)} />
                  </div>
                </Row>
              ))}
              <Form.Item>
                <AddButton
                  type="dashed"
                  onClick={() => add()}
                  block
                  icon={<PlusOutlined />}
                >
                  Thêm bộ ảnh
                </AddButton>
              </Form.Item>
            </>
          )}
        </Form.List>
      </CustomForm>
    </Modal>
  );
});

export default AddProduct;
