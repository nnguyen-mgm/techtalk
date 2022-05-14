import { useCallback, useEffect, useMemo, useState } from 'react';
import { Button, List, Modal, Spin } from 'antd';
import { ContainerOutlined } from '@ant-design/icons';
import styled from 'styled-components';
import QRCode from 'react-qr-code';
import useTechTalkService from '../hooks/useTechTalkService';

const S = {
  ItemList: styled(List.Item)`
    .ant-list-item-meta-avatar {
      margin-top: 6px;
    }
    .ant-list-item-meta-title {
      font-size: 1.5rem;
      margin: 0;
    }
  `,
}

const TicketItemList = ({ ticketId, checkedIn }) => {
  const [loading, setLoading] = useState(false);
  const [modalVisible, setModalVisible] = useState(false);
  const [qrValue, setQrValue] = useState(null);
  const {getCheckInCode} = useTechTalkService();

  const handleShowModal = useCallback(() => {
    setModalVisible(true);
  }, []);

  const handleCloseModal = useCallback(() => {
    setModalVisible(false);
  }, []);

  useEffect(() => {
    (async () => {
      setLoading(true);
      const checkInCode = await getCheckInCode(ticketId);
      setQrValue(JSON.stringify({
        ticketId,
        checkInCode
      }));
      setLoading(false);
    })();
  }, [ticketId, getCheckInCode]);

  useEffect(() => {
    if (checkedIn) {
      handleCloseModal();
    }
  }, [checkedIn, handleCloseModal]);

  const actions = useMemo(() => {
    if (checkedIn) {
      return [<Button disabled>Checked-in</Button>];
    }

    return [<Button type="primary" key="check-in-code" onClick={handleShowModal}>Get Check-in Code</Button>];
  }, [checkedIn, handleShowModal]);

  return (
    <S.ItemList actions={actions}>
      <List.Item.Meta
        avatar={<ContainerOutlined style={{ fontSize: '1.5rem' }}/>}
        title={`TTT #${ticketId}`}
      />
      <Modal
        title="Check-in Code"
        visible={modalVisible}
        onCancel={handleCloseModal}
        footer={null}
      >
        <center>
          {(!qrValue || loading) && (
            <Spin />
          )}
          {(qrValue && !loading) && (
            <>
              <QRCode value={qrValue} />
              <br/>
              <br/>
              <h3>Please show this QR Code to the event creator</h3>
            </>
          )}
        </center>
      </Modal>
    </S.ItemList>
  )
}

export default TicketItemList;
