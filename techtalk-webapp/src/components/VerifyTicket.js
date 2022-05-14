import QrReader from 'react-qr-scanner'
import { useCallback, useState } from 'react';
import { Button, Modal } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, FormOutlined } from '@ant-design/icons';
import styled from 'styled-components';

const S = {
  ValidIcon: styled(CheckCircleOutlined)`
    font-size: 10rem;
    color: #4caf50;
  `,
  InvalidIcon: styled(CloseCircleOutlined)`
    font-size: 10rem;
    color: #ff5722;
  `,
  Modal: styled(Modal)`
    .ant-modal-body {
      min-height: 375px;
    }
  `,
  ModalContainer: styled.div`
    text-align: center;
    min-height: 250px;
  `,
}

const VerifyTicket = () => {
  const [modalVisible, setModalVisible] = useState(false);
  const handleShowModal = useCallback(() => {
    setModalVisible(true);
  }, []);
  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);
  const handleScan = useCallback((data) => {
    if (data && !modalVisible) {
      console.log(data);
      handleShowModal();
    }
  }, [handleShowModal, modalVisible]);
  const handleError = useCallback((err) => {
    console.error(err)
  }, []);
  return (
    <div>
      <center>
        <QrReader
          delay={1000}
          style={{
            height: 240,
            width: 320,
          }}
          onError={handleError}
          onScan={handleScan}
        />
      </center>
      <S.Modal
        title="Verify Ticket"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <S.ModalContainer>
          <br/>
          <>
            <S.ValidIcon />
            <br/>
            <br/>
            <h1>Valid Ticket!</h1>
            <br/>
            <Button type="primary" shape="round" icon={<FormOutlined />} size="large">Check-in this ticket</Button>
          </>
          <>
            <S.InvalidIcon />
            <br/>
            <br/>
            <h1>Invalid Ticket!</h1>
          </>
        </S.ModalContainer>
      </S.Modal>
    </div>
  )
}

export default VerifyTicket;
