import QrReader from 'react-qr-scanner'
import { useCallback, useState } from 'react';
import { Button, Modal, Spin } from 'antd';
import { CheckCircleOutlined, CloseCircleOutlined, FormOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import useTechTalkService from '../hooks/useTechTalkService';

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

const VerifyTicket = ({eventId, onCheckedIn}) => {
  const [loading, setLoading] = useState(false);
  const [isValid, setValid] = useState(null);
  const [checkInInfo, setCheckInInfo] = useState(null);
  const [modalVisible, setModalVisible] = useState(false);
  const {verifyTicket, checkInTicket} = useTechTalkService();

  const handleShowModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
    setValid(null);
  }, []);

  const handleScan = useCallback(async (data) => {
    if (data && !modalVisible) {
      handleShowModal();
      try {
        setLoading(true);
        const {ticketId, checkInCode} = JSON.parse(data.text);
        setValid(await verifyTicket(eventId, ticketId, checkInCode));
        setCheckInInfo({
          eventId,
          ticketId,
          checkInCode,
        });
      } catch (err) {
        console.error(err);
        setValid(false);
      } finally {
        setLoading(false);
      }
    }
  }, [handleShowModal, modalVisible, verifyTicket, eventId]);

  const handleError = useCallback((err) => {
    console.error(err)
  }, []);

  const handleCheckInTicket = useCallback(async () => {
    if (checkInInfo) {
      try {
        setLoading(true);
        await checkInTicket(checkInInfo.eventId, checkInInfo.ticketId, checkInInfo.checkInCode);
        onCheckedIn && await onCheckedIn();
        handleCloseModal();
      } finally {
        setLoading(false);
      }
    }
  }, [checkInTicket, checkInInfo, onCheckedIn, handleCloseModal]);

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
        closable={!loading}
        footer={null}
      >
        <Spin spinning={loading}>
          <S.ModalContainer>
            <br/>
            {isValid && (
              <>
                <S.ValidIcon />
                <br/>
                <br/>
                <h1>Valid Ticket!</h1>
                <br/>
                <Button type="primary" shape="round" icon={<FormOutlined />} size="large" onClick={handleCheckInTicket}>Check-in this ticket</Button>
              </>
            )}
            {isValid !== null && !isValid && (
              <>
                <S.InvalidIcon />
                <br/>
                <br/>
                <h1>Invalid Ticket!</h1>
              </>
            )}
          </S.ModalContainer>
        </Spin>
      </S.Modal>
    </div>
  )
}

export default VerifyTicket;
