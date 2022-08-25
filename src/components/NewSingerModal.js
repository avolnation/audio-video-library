import React, { useEffect, useState } from 'react';
import { Button, Modal, Form } from 'react-bootstrap';

const ModalWindow = props => {

  let {show, hide, modalType} = props

  let [form, setForm] = useState({name: '', image: {}})

  const onFileChange = e => {
    console.log(e.target.files[0])
  }

  const handleSingerCreation = (e) => {
    e.preventDefault()
    // console.log(e.target.files)
    console.log(form)
    const formData = new FormData();

    formData.append('name', form.name)
    formData.append('image', form.image)

    fetch('http://localhost:3002/singers/add-singer', 
    {method: 'POST', 
    body: formData})
    .then(res => {
        console.log(res)
    })
  }

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
        <Form 
            id="new-singer" 
            onSubmit={(e) => handleSingerCreation(e)} 
            encType='multipart/form-data'>
          <Form.Group className="mb-3" id="name" name="name" controlId="name">
            <Form.Label>Name</Form.Label>
            <Form.Control type="text" placeholder="Singer's name" onChange={(e) => setForm({...form, name: e.target.value})} value={form.name} required/>
          </Form.Group>

          <Form.Group className="mb-3" id="image" name="image" controlId="image">
            <Form.Label>Image URL</Form.Label>
            <Form.Control name="image" type="file" placeholder="image" onChange={(e) => setForm({...form, image: e.target.files[0]})} required/>
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