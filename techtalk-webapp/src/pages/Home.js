import { Button, DatePicker, Divider, Form, Input, InputNumber } from 'antd';
import Token from '../components/Token';
import styled from 'styled-components';
import { useCallback, useState } from 'react';
import { useNavigate } from 'react-router-dom';
import CreatedEventsLabel from '../components/CreatedEventsLabel';

const S = {
  SearchContainer: styled.div`
    text-align: center;
  `,
  Title: styled.div`
    font-size: 2.5rem;
    font-weight: bold;
    color: #fff;
    text-align: center;
    margin-bottom: 16px;
  `,
  Form: styled(Form)`
    .ant-form-item-label {
      min-width: 100px;

      label {
        color: #fff;
      }
    }
    .ant-form-item-extra {
      color: #fff;
      font-size: smaller;
      max-width: 204px;
    }
  `,
  SearchInput: styled(Input)`
    width: calc(100% - 50px) !important;
    max-width: 300px;
  `,
  CenterContainer: styled.div`
    width: 348px;
    padding: 24px;
    margin: auto;
    ${props => props.hasBackground && 'background: rgba(255,255,255,0.125);'}
    border-radius: 8px;
  `,
  Divider: styled(Divider)`
    font-size: 1.5rem !important;
    color: #fff !important;
    border-top-color: rgba(255,255,255,0.125) !important;
  `,
}

const Home = () => {
  const [eventId, setEventId] = useState();
  const navigate = useNavigate();

  const handleOnChangeEventId = useCallback((event) => {
    setEventId(event.target.value);
  }, []);

  const handleGoToEvent = useCallback(() => {
    navigate(`/event/${eventId}`);
  }, [eventId, navigate]);

  return (
    <div>
      <S.CenterContainer hasBackground style={{marginTop: 8, marginBottom: 12}}>
        <CreatedEventsLabel />
      </S.CenterContainer>
      <S.Title>Join a Tech Talk?</S.Title>
      <S.CenterContainer hasBackground>
        <Input.Group compact>
          <S.SearchInput placeholder="Enter your TechTalk ID" onChange={handleOnChangeEventId} />
          <Button type="primary" onClick={handleGoToEvent}>Go</Button>
        </Input.Group>
      </S.CenterContainer>
      <S.CenterContainer>
        <S.Divider>Or</S.Divider>
      </S.CenterContainer>
      <S.Title>Host a Tech Talk?</S.Title>
      <S.CenterContainer hasBackground>
        <S.Form
          layout="horizontal"
        >
          <Form.Item label="Name">
            <Input placeholder="e.g. Web3 Tech Talk"/>
          </Form.Item>
          <Form.Item label="Max Tickets">
            <InputNumber placeholder="e.g. 10"/>
          </Form.Item>
          <Form.Item label="Start Time" extra="Tickets are not available for sold after the start time.">
            <DatePicker showTime="HH:mm" onOk={() => {}} placeholder="Select start time" />
          </Form.Item>
          <Form.Item style={{ textAlign: 'center', paddingTop: 4 }}>
            <Button type="primary" htmlType="submit">Create (Cost&nbsp;<Token val={10 * (10 ** 18)}/>)</Button>
          </Form.Item>
        </S.Form>
      </S.CenterContainer>
    </div>
  )
}

export default Home;
