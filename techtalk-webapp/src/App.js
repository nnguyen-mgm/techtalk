import { Descriptions, Layout } from 'antd';
import styled from 'styled-components';
import { Link, Outlet } from 'react-router-dom';
import AccountInfo from './components/AccountInfo';

const {Header, Footer, Content} = Layout;

const S = {
  Header: styled(Header)`
    display: flex;
    justify-content: space-between;
    align-items: center;
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    z-index: 100;
    padding: 0 16px;
    color: #fff;
  `,
  AppLogo: styled.img`
    height: 50px;
    margin-top: -12px;
    margin-right: 8px;
  `,
  HeaderTitle: styled.span`
    font-weight: bold;
    font-size: 1.75rem;
    color: #fff;
  `,
  Content: styled(Content)`
    min-height: 100vh;
    margin-bottom: -70px;
    padding: 80px 16px 86px 16px;
    background: #062441;
    color: #fff;
  `,
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
  Form: styled.div`
    width: calc(100% - 200px);
    max-width: 300px;
    margin: auto;
    
    .ant-form-item-label {
      min-width: 110px;
      
      label {
        color: #fff;
      }
    }
  `,
  Footer: styled(Footer)`
    text-align: center;
    background: #001529;
    color: #fff;
    z-index: 1;
  `
}

function App() {
  return (
    <Layout>
      <S.Header>
        <Link to="/">
          <S.AppLogo src="/logo.png" />
          <S.HeaderTitle>Tech Talk Ticket</S.HeaderTitle>
        </Link>
      </S.Header>
      <S.Content>
        <AccountInfo />
        <br/>
        <Outlet />
      </S.Content>
      <S.Footer>
        Token:&nbsp;
        <a href={`/`} target="_blank" rel="noreferrer">TTC</a>
        &nbsp;-&nbsp;
        <a href={`/`} target="_blank" rel="noreferrer">TTT</a>
      </S.Footer>
    </Layout>
  );
}

export default App;
