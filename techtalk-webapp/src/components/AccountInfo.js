import { Button, Descriptions, Typography } from 'antd';
import styled from 'styled-components';
import Token from './Token';
import useTechTalkService from '../hooks/useTechTalkService';
import { useCallback } from 'react';

const S = {
  Descriptions: styled(Descriptions)`
    max-width: 348px;
    margin: auto;

    .ant-descriptions-title, .ant-descriptions-item-content {
      color: #fff;
    }
    
    .ant-btn {
      margin-left: 8px;
      margin-right: 4px;
      float: right;
    }
  `,
}

function AccountInfo() {
  const {hasWeb3, wallet, setAllowance } = useTechTalkService();

  const handleSetAllowance = useCallback(async () => {
    const allowance = window.prompt('Allowance:');
    if (allowance !== null) {
      await setAllowance(allowance);
    }
  }, [setAllowance]);

  if (!hasWeb3) {
    return (
      <center>
        <Typography.Text type="warning">You need to install Metamask or use a Web3 browser</Typography.Text>
      </center>
    );
  }

  return (
    <S.Descriptions title="Your Wallet" size="small" bordered column={1}>
      <Descriptions.Item label="Balance">
        <Token val={wallet.balance}/>
      </Descriptions.Item>
      <Descriptions.Item label="Allowance">
        <Token val={wallet.allowance}/>
        <Button size="small" type="primary" onClick={handleSetAllowance}>Set allowance</Button>
      </Descriptions.Item>
    </S.Descriptions>
  );
}

export default AccountInfo;
