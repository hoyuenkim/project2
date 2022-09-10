import { Form, Input } from 'antd';
import axios from 'axios';

const BizcdeForm = ({ bizcode, onChangeBizcode }) => {
  axios.defaults.baseURL = `${process.env.BACKEND_IP}`;
  return (
    <Form.Item
      name="bizcode"
      validateTrigger="onBlur"
      rules={[
        {
          required: true,
          message: '사업자 등록번호를 입력해주세요',
        },
        () => ({
          async validator(rule, value) {
            if (!value || !value.match(/\d{1}/g) || !value.length === 10) {
              return Promise.reject('형식에 맞지 않은 사업자 등록번호입니다');
            } else {
              function checkBizID(bizID) {
                var checkID = new Array(1, 3, 7, 1, 3, 7, 1, 3, 5, 1);
                var tmpBizID,
                  i,
                  chkSum = 0,
                  c2,
                  remander;
                bizID = bizID.replace(/-/gi, '');

                for (i = 0; i <= 7; i++) chkSum += checkID[i] * bizID.charAt(i);
                c2 = '0' + checkID[8] * bizID.charAt(8);
                c2 = c2.substring(c2.length - 2, c2.length);
                chkSum += Math.floor(c2.charAt(0)) + Math.floor(c2.charAt(1));
                remander = (10 - (chkSum % 10)) % 10;

                if (Math.floor(bizID.charAt(9)) == remander) return true;
                return false;
              }
              if (checkBizID(value)) {
                const result = await axios.post('/user/confirm/bizcode', {
                  bizcode: value,
                });
                if (!result.data) {
                  return Promise.resolve();
                } else {
                  return Promise.reject('이미 존재하는 사업자 등록번호입니다');
                }
              } else {
                return Promise.reject('형식에 맞지 않은 사업자 등록번호입니다');
              }
            }
          },
        }),
      ]}
    >
      <Input
        prefix={'* 사업자등록번호'}
        size={`large`}
        name={'bizcode'}
        value={bizcode}
        initialValue={bizcode}
        onChange={onChangeBizcode}
      />
    </Form.Item>
  );
};

export default BizcdeForm;
