import { Modal } from 'antd';

const ModalInterface = ({
  content,
  toggleModal,
  onChangeToggleModal,
  title,
}) => {
  return (
    <Modal
      title={title ? title : null}
      visible={toggleModal}
      onCancel={onChangeToggleModal}
      footer={null}
    >
      {content}
    </Modal>
  );
};

export default ModalInterface;
