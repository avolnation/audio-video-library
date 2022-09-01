import React, { useEffect, useState } from 'react';

import { Form, Input, Checkbox, Select, Upload, Spin, Button } from 'antd'

import NewSingerModal from '../components/NewSingerModal'

const Audio = (props) => {

    const { Option } = Select;
    const singersArray = []

    const [formLoading, setFormLoading] = useState(false)

    const [singerForm, setSingerForm] = useState({
        title: '', 
        singers: '',
        genre: '',
        "audio-file": {},
        "audio-image": {},
        duration: 0
        })

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true)
    };

    const [genres, setGenres] = useState(null) 
    const [singers, setSingers] = useState(null) 
    const [loadingGenres, setLoadingGenres] = useState(true);
    const [loadingSingers, setLoadingSingers] = useState(true);

    useEffect(() => {
        fetchGenres()
        fetchSingers()
    }, [])

    useEffect(() => {
        console.log(singerForm)
    }, [singerForm])


    const fetchGenres = () => {
        fetch('http://localhost:3002/genres/all-genres', {method: 'GET'})
        .then(result => {
            console.log(result)
            return result.json();
        })
        .then(result => {
            setGenres(result.genres)
            setLoadingGenres(false)
        })
        .catch(err => {
            console.log(err)
            setLoadingGenres(false);
        })
    }

    const fetchSingers = () => {
        fetch('http://localhost:3002/singers/all-singers', {method: 'GET'})
        .then(result => {
            console.log(result)
            return result.json();
        })
        .then(result => {
            setSingers(result.singers)
            setLoadingSingers(false);
        })
        .catch(err => {
            console.log(err)
            setLoadingSingers(false);
        })
    }

    const handleSongCreation = async (e) => {

        setFormLoading(true)

        const audioFormData = new FormData();
            audioFormData.append("title", singerForm.title)
            audioFormData.append("singers", JSON.stringify(singerForm.singers))
            audioFormData.append("genre", singerForm.genre)
            audioFormData.append("audio-file", singerForm["audio-file"])
            audioFormData.append("audio-image", singerForm["audio-image"])
            audioFormData.append("duration", singerForm.duration)

        const result = await fetch('http://localhost:3002/audios/add-audio', {
            method: 'POST',
            body: audioFormData})
        
        
        
        const parsedResult = await result.json()

        console.log(await parsedResult)

        props.notification('success', 'Success', await parsedResult.message)

        setFormLoading(false)
        
    }

    singersArray.push(singers ? singers.map((el, idx) => {
        return <Option key={el._id}>
            <img style={{"width": "30px", "margin-right": "5px"}} src={'http://localhost:3002/' + el.imageUrl} role="img"></img>
            {el.name}
            </Option>
    }) : null)
    
  return (
    <div className="form-container">
        <Spin spinning={formLoading}>
        <NewSingerModal show={show} hide={handleClose}/>
            <Form onFinish={handleSongCreation} name="basic" labelCol={{ span: 8, }} wrapperCol={{ span: 16, }} initialValues={{ remember: true, }} autoComplete="off" encType='multipart/form-data'>
                <Form.Item label="Audio title" name="audio-title" rules={[{required: true, message: 'Please input your username!',},]}>
                    <Input onChange={e => setSingerForm({...singerForm, title: e.target.value})} placeholder="Enter audio title"/>
                </Form.Item>
                <Form.Item label="Audio Singers" name="singers" rules={[{ required: true, message: 'Please, select singers!',},]}>
                    <Select onChange={e => setSingerForm({...singerForm, singers: e})} mode="multiple" allowClear placeholder="Choose audio singers" disabled={loadingSingers}>
                        {singersArray ? singersArray : null}
                    </Select>
                </Form.Item>
                <Form.Item label="Genre" name="genre" rules={[{ required: true, message: 'Please, select genre!',},]}>
                    <Select onChange={e => setSingerForm({...singerForm, genre: e})} placeholder="Select genre" default={null} disabled={loadingGenres}>
                        {loadingGenres ? null : genres.map(res => {
                            return <Option key={res.name} value={res._id}>{res.name}</Option>})}
                    </Select>
                </Form.Item>
                <Form.Item label="Audio file" required>
                    <Input onChange={(e) => setSingerForm({...singerForm, "audio-file": e.target.files[0]})} placeholder="Audio file" type="file"/>
                </Form.Item>
                <Form.Item label="Audio Image" required>
                    <Input onChange={(e) => setSingerForm({...singerForm, "audio-image": e.target.files[0]})} type="file"/>
                </Form.Item>
                <Form.Item label="Duration" name="duration" rules={[{ required: true, message: 'Please input your username!', },]}>
                    <Input onChange={e => setSingerForm({...singerForm, duration: e.target.value})} placeholder="Please use XX:XX format"/>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 8, span: 16, }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
            </Spin>
    </div>    
    )
  }

export default Audio;