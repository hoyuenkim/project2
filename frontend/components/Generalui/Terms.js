import React, { useCallback, useState, useMemo } from 'react';
import { List, Modal, Col, Row, Card } from 'antd';
import { CheckCircleFilled, CheckCircleOutlined } from '@ant-design/icons';

import { useChecked } from './CustomHooks';
const Terms = ({ setTerms }) => {
  const CheckCircleStyle = useMemo(() => {
    return { color: '#40A9FF', marginRight: '3%' };
  }, []);

  const terms = [
    { title: '개인정보동의', content: '개인정보를 동의해주세요' },
    { title: '3자정보동의', content: '3자 정보동의를 해주세요' },
  ];
  const [allTerms, setAllTerms] = useState(false);
  const [individualInformationModal, setIndividualInformationModal] =
    useChecked(false);
  const [thirdPartyInformationModal, setThirdPartyInformationModal] =
    useChecked(false);

  const setModals = [
    setIndividualInformationModal,
    setThirdPartyInformationModal,
  ];
  const modals = [individualInformationModal, thirdPartyInformationModal];

  const toggleAllTerms = useCallback(() => {
    setAllTerms((prev) => !prev);
    if (!allTerms) {
      setTerms.map((term) => {
        term[2](true);
      });
    } else {
      setTerms.map((term) => {
        term[2](false);
      });
    }
  }, [allTerms]);

  return (
    <>
      <List
        header={'약관동의'}
        bordered={true}
        itemLayout={'horizontal'}
        dataSource={terms}
        renderItem={(term, index) => {
          return (
            <List.Item
              key={index}
              actions={[<div onClick={setModals[index]}>자세히보기</div>]}
            >
              <List.Item.Meta
                title={
                  <>
                    <Row>
                      <Col span={2}>
                        {setTerms[index][0] ? (
                          <CheckCircleFilled
                            style={CheckCircleStyle}
                            onClick={setTerms[index][1]}
                          />
                        ) : (
                          <CheckCircleOutlined
                            style={CheckCircleStyle}
                            onClick={setTerms[index][1]}
                          />
                        )}
                      </Col>
                      <Col span={22}>{term.title}</Col>
                    </Row>
                  </>
                }
              />
              <Modal
                title={term.title}
                visible={modals[index]}
                onOk={setModals[index]}
                onCancel={setModals[index]}
              >
                {term.content}
              </Modal>
            </List.Item>
          );
        }}
      />
      <Card bordered={false}>
        {allTerms ? (
          <CheckCircleFilled
            style={CheckCircleStyle}
            onClick={toggleAllTerms}
          />
        ) : (
          <CheckCircleOutlined
            style={CheckCircleStyle}
            onClick={toggleAllTerms}
          />
        )}
        전체 동의하기
      </Card>
    </>
  );
};

export default Terms;
