import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const ModalWindow = props => {

  console.log(props);

  const {show, hide, modalType} = props
  
  //loginCredentials state setup/handling and changes watching
  const [loginCredentials, setLoginCredentials] = useState({});

  const handleLoginCredentials = (creds) => {
    console.log(creds);
    const {login, password} = {login: creds.target[0].value, password:creds.target[1].value};
    console.log(login + password);
    setLoginCredentials({
      login: login,
      password: password
    })   
  }

//Следим за изменением state у loginCredentials
  useEffect(() => {
    console.log(loginCredentials)
  }, [loginCredentials])

  return (
    <>
      {/* <Button variant="primary" onClick={handleShow}>
        Launch demo modal
      </Button> */}
      <Modal show={show} onHide={hide}>
        <Modal.Header closeButton>
          <Modal.Title>{modalType}</Modal.Title>
        </Modal.Header>
        <Modal.Body>
        <Form onSubmit={handleLoginCredentials}>
          <Form.Group className="mb-3" controlId="formBasicEmail">
            <Form.Label>Email address</Form.Label>
            <Form.Control type="email" placeholder="Enter email" required/>
            <Form.Text className="text-muted">
              We'll never share your email with anyone else.
            </Form.Text>
          </Form.Group>

          <Form.Group className="mb-3" controlId="formBasicPassword">
            <Form.Label>Password</Form.Label>
            <Form.Control type="password" placeholder="Password" required/>
          </Form.Group>
          <Button variant="primary" type="submit">
            Submit
          </Button>
        </Form>
        </Modal.Body>
        {/* <Modal.Footer>
          <Button variant="secondary" onClick={hide}>
            Close
          </Button>
          <Button variant="primary" onClick={hide}>
            Save Changes
          </Button>
        </Modal.Footer> */}
      </Modal>
    </>
  );
}

export default ModalWindow;