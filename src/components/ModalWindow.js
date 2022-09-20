import React, { useEffect, useState } from 'react';
// import { Button, Modal, Form } from 'react-bootstrap';
import { Modal, Form, Button, Input } from 'antd'

import {notification} from 'antd'
const ModalWindow = props => {

  const notif = (type, title, message) => {
    notification[type](
      {
        message: title,
        description: message,
        placement: 'bottomRight'
      }
    )
  }

  console.log(props);

  const {show, hide, modalType} = props

  const [form] = Form.useForm()

  const signupHandler = () => {
    // notif('Success', 'Success', 'Success')
    fetch('http://localhost:3002/auth/signup', {method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(form.getFieldsValue())
    })
    .then(result => {
      return result.json()
    })
    .then(result => {
      notif(result.status, result.status == 'success' ? 'Success' : 'Error', result.message)
      console.log(result)
      form.resetFields()
      hide()
    })
  }

  const loginHandler = () => {
    fetch('http://localhost:3002/auth/login', {method: 'POST', 
      headers: {'Content-Type': 'application/json'},
      body: JSON.stringify(form.getFieldsValue())
    })
    .then(result => {
      return result.json()
    })
    .then(result => {
      if(result.status === 'success'){
        document.cookie = `token=${result.token}; path=/; max-age=3600`
        notif(result.status, 'Success', result.message)
        console.log(result)
        form.resetFields()
        hide()
        setTimeout(() => window.location.reload(), 1000)
      }
      if(result.status === 'error'){
        notif(result.status, 'Error', result.message)
        form.resetFields()
        hide()
      }
    })
  }

  return (
    modalType == 'Sign Up' ? 
    <>
      <Modal title={modalType} visible={show} onCancel={() => {hide(); form.resetFields()}} onOk={signupHandler}>
        <Form form={form}>
          <Form.Item
            name="email"
            label="E-mail"
            rules={[{required: true},]}>
            <Input/>
          </Form.Item>
          <Form.Item
            name="password"
            label="Password"
            rules={[{required: true},]}>
            <Input.Password />
          </Form.Item>
        </Form>
      </Modal>
    </> :
    <>
    <Modal title={modalType} visible={show} onCancel={() => {hide(); form.resetFields()}} onOk={loginHandler}>
      <Form form={form}>
        <Form.Item
          name="email"
          label="E-mail"
          rules={[{required: true},]}>
          <Input/>
        </Form.Item>
        <Form.Item
          name="password"
          label="Password"
          rules={[{required: true},]}>
          <Input.Password/>
        </Form.Item>
          {/* <Button>Forgot Password?</Button> */}
      </Form>
    </Modal>
  </>
    
  );
}

export default ModalWindow;