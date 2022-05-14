import { Button, Descriptions } from 'antd';
import styled from 'styled-components';
import Token from './Token';

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
  return (
    <S.Descriptions title="Your Wallet" size="small" bordered column={1}>
      <Descriptions.Item label="Balance">
        <Token val={1810000000}/>
      </Descriptions.Item>
      <Descriptions.Item label="Allowance">
        <Token val={10000000}/>
        <Button size="small" type="primary">Set allowance</Button>
      </Descriptions.Item>
    </S.Descriptions>
  );
}

export default AccountInfo;
