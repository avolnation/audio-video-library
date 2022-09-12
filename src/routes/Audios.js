import React, { useEffect, useState } from 'react';

import AudioFooter from '../components/audio/AudioFooter';
import AudioFilters from '../components/audioFilter/audioFilters';

import { Tooltip, Dropdown, Menu, Popconfirm, Modal, Form, Input, Upload, Select, Button, Spin } from 'antd'

import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined, UploadOutlined, ConsoleSqlOutlined, FileUnknownOutlined } from '@ant-design/icons'


const Audio = (props) => {

  const { Option } = Select;

  const { SubMenu } = Menu;

  const api_url = 'http://localhost:3002/';

  const singersArray = []

  //* Filters
  const [genre, setGenre] = useState(null);
  const [listenCountSort, setListenCountSort] = useState(false) 

  //* Genres | tracks | singers fetch on loading component
  const [tracks, setTracks] = useState([])
  const [genres, setGenres] = useState({})
  const [singers, setSingers] = useState(null) 

  //* Loading states
  const [loading, setLoading] = useState(false);
  const [loadingGenres, setLoadingGenres] = useState(true)
  const [loadingSingers, setLoadingSingers] = useState(true);
  const [formLoading, setFormLoading] = useState(false)
  const [editFormLoading, setEditFormLoading] = useState(false)

  //* Forms hooks
  const [editAudioForm] = Form.useForm()
  const [newAudio] = Form.useForm()
  const [newSingerForm] = Form.useForm()

  //* Audio id from updating and etc.
  const [audioId, setAudioId] = useState(null)

  const [newSingerModalShow, setNewSingerModalShow] = useState(false);

  useEffect(() => {
    fetchGenres()
    fetchSingers()
    fetchAudios()
}, [])


  const isEmpty = (obj) => {
    for (let key in obj) {
      return false;
    }
    return true;
  }

  //* Fetch Genres
  const fetchGenres = () => {
    fetch(api_url + 'genres/all-genres', {method: 'GET'})
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

//* Fetch Singers
const fetchSingers = () => {
    fetch(api_url + 'singers/all-singers', {method: 'GET'})
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

//* Fetch Audios
const fetchAudios = () => {
    fetch(api_url + 'audios/all-audios', {method: 'GET'})
    .then(result => {
        console.log(result)
        return result.json();
    })
    .then(result => {
        setTracks(result.audios)
        setLoading(false)
    })
    .catch(err => {
        console.log(err)
        setLoading(false);
    })
}

//* Audio to playlist handler
const addToPlaylistHandler = ( audioId, playlistId ) => {
  fetch(api_url + 'playlists/add-to-playlist', {method: 'POST',
  headers: {"Content-Type": "application/json"},
  body: JSON.stringify({playlistId: playlistId, audioId: audioId}),
  })
  .then(result => result.json())
  .then(result => {
    props.notification(result.status, result.status == 'success' ? 'Success' : 'Error', result.message)
  })
}

//* Delete audio handler
const audioDeleteHandler = ( id ) => {
  fetch(api_url + 'audios/delete-audio/' + id, {
    method: 'DELETE'})
    .then(result => {
      return result.json()
    })
    .then(result => {
      props.notification(result.status, result.status == 'success' ? 'Success' : 'Error', result.message)
      fetchAudios()
    })
  // setTimeout(() => window.location.reload(), 500)
}
  
//* Update audio handler
const audioUpdateHandler = async (values) => {

  setEditFormLoading(true)

  const audioFormData = new FormData();
      if(audioId){
        audioFormData.append("id", audioId)
      }
      if(values.title){
        audioFormData.append("title", values.title)
      }
      if(values.singers && values.singers.length >= 1){
        audioFormData.append("singers", JSON.stringify(values.singers))
      }
      if(values.genre){
        audioFormData.append("genre", values.genre)
      }
      if(values.audioFile){
        audioFormData.append("audio-file", values.audioFile.file)
      }
      if(values.audioImage){
        audioFormData.append("audio-image", values.audioImage.file)
      }
      if(values.duration){
        audioFormData.append("duration", values.duration)
      }
      
  const result = await fetch(api_url + 'audios/edit-audio', {
    method: 'POST',
    body: audioFormData})

  const parsedResult = await result.json()

  console.log(await parsedResult)

  props.notification('success', 'Success', await parsedResult.message)

  fetchAudios()

  props.setModal({modal: ''})

  editAudioForm.resetFields()
  
  setEditFormLoading(false)
  
}
  //* Create singer handler
  const singerCreationHandler = (values) => {
    console.log(values)
    // console.log(e.target.files)
    // console.log(form)
    const formData = new FormData();
  
    formData.append('name', values.name)
    formData.append('image', values.image.file)
  
    fetch(api_url + 'singers/add-singer', 
    {method: 'POST', 
    body: formData})
    .then(res => {
        return res.json()
    })
    .then(res => {
        props.notification(res.status, res.status == 'success' ? 'Success' : 'Error', res.message)
        setNewSingerModalShow(false)
        newSingerForm.resetFields()
    })
  }
  
  //* Create audio handler
  const audioCreationHandler = async (values) => {
  
      setFormLoading(true)
  
      const audioFormData = new FormData();
          audioFormData.append("title", values.title)
          audioFormData.append("singers", JSON.stringify(values.singers))
          audioFormData.append("genre", values.genre)
          audioFormData.append("audio-file", values.audioFile.file)
          audioFormData.append("audio-image", values.audioImage.file)
          audioFormData.append("duration", values.duration)
  
      const result = await fetch(api_url + 'audios/add-audio', {
          method: 'POST',
          body: audioFormData})
      
      const parsedResult = await result.json()
  
      console.log(await parsedResult)
  
      props.notification('success', 'Success', await parsedResult.message)
  
      newAudio.resetFields()
  
      setFormLoading(false)
  
      props.setModal('')
  
      fetchAudios()
      
  }
  
  const audiosMenu = (item) => (
    <Menu>
      <Menu.Item key="1" icon={<EyeOutlined />} onClick={() => toAudioPageHandler(item)}>Audio Info</Menu.Item> 
        {
          props.getCookie('token') ? 
        <SubMenu key="2" title={ <span style={{"display": "inline-flex", "alignItems": "center"}}> <PlusOutlined style={{"marginRight": "7px"}}/> <span>Add to playlist</span> </span>  }> 
        {/* Playlists from server (Fetch + render)*/}
          {props.playlists.length >= 1 ?
            props.playlists.map(el => {
              return <Menu.Item key={el._id} onClick={() => {
                addToPlaylistHandler(item, el._id)
              }}> 
                {el.title}
              </Menu.Item>
            })
             :
            <Menu.Item disabled={true}>No playlists</Menu.Item>
}            
        </SubMenu> : null
        }
      <Menu.Item key="3" icon={<EditOutlined />} onClick={() => {
        setAudioId(item)
        props.setModal('edit_audio')
        }}> Edit 
      </Menu.Item>
      <Popconfirm onConfirm={() => audioDeleteHandler(item)} placement="topRight" title={`You\'re about to delete track. Proceed?`} okText="Да" cancelText="Нет">
          <Menu.Item danger key="4" icon={<DeleteOutlined />}>
            Delete
          </Menu.Item>
      </Popconfirm>
    </Menu>)

  let audios;
  
  audios = tracks && tracks.length>=1 ? tracks.map((el, index) => {
        return (
          <Dropdown overlay={audiosMenu(el._id)} trigger={['contextMenu']}>
            <div className="audio-item" key={el.title}>
                <div className="grid-play">
                  <img src="/images/play-button.svg" alt="play"/>
                </div>
                <div className="grid-album-cover">
                  <img src={api_url + el.imagePath} alt="albumCover"/>
                </div>
                <div className="grid-singers">{el.singers.map(el => {
                  return el.name }).join(', ')}
                </div>
                <div className="grid-title">{el.title}</div>
                <span className="grid-audio-item-duration">{el.duration}</span>
            </div>
          </Dropdown>  
        )

      }) :
      <>
        <FileUnknownOutlined style={{"fontSize": "50px"}}/>
        <p>No Tracks Yet</p> 
      </>
 

  singersArray.push(singers ? singers.map((el, idx) => {
    return <Option key={el._id}>
        <img style={{"width": "30px", "marginRight": "5px"}} src={api_url + el.imageUrl} alt="singer"></img>
        {el.name}
        </Option>
}) : null)

const setGenreForFilter = (el) => {
  console.log(el.target.id)
  setGenre(el.target.id)
  fetch(api_url + 'audios/get-audios-by-genre/' + el.target.id, {method: 'GET',})
  .then(result => result.json())
  .then(result => {
    props.notification(result.status, result.status == 'success' ? 'Success' : 'Error', result.message)
    console.log(result)
    setTracks(result.body)
  })
}

const toAudioPageHandler = (id) => {
  console.log(id)
  props.history.push( props.history.location.pathname + '/' + id)
}

const sortByListenCountHandler = () => {
  setListenCountSort(!listenCountSort)
}

  // const dummyRequest = () => {
  //   return {status: 'done'};
  // }
    
  return (
    <>

    <Modal footer={false} title="New Singer" visible={newSingerModalShow} onCancel={() => setNewSingerModalShow(false)}>
      <Form form={newSingerForm} labelCol={{ span: 24, }} onFinish={singerCreationHandler} encType="multipart/form-data">
        <Form.Item label="Singer name" name="name" required>
          <Input></Input>
        </Form.Item>
        <Form.Item label="Audio file" name="image" showuploadlist="false" required>
            <Upload beforeUpload={() => false} status="removed">
              <Button icon={<UploadOutlined />}>Upload</Button>
            </Upload>
        </Form.Item>
        <Form.Item wrapperCol={{ offset: 10, span: 18, }}>
            <Button type="primary" htmlType="submit">Create</Button>
        </Form.Item>
      </Form>
    </Modal>

    <Modal footer={false} title="New audio" visible={props.modal === 'new_audio'} onCancel={() => {props.setModal('')}}>
      <Spin spinning={formLoading}>
        <Form form={newAudio} onFinish={audioCreationHandler} labelCol={{ span: 24, }} autoComplete="off" encType='multipart/form-data'>
            <Form.Item label="Audio title" name="title" rules={[{required: true, message: 'Please input your username!',},]}>
                <Input placeholder="Enter audio title"/>
            </Form.Item>
            <Form.Item label="Audio Singers" name="singers" rules={[{ required: true, message: 'Please, select singers!',},]}>
                <Select mode="multiple" allowClear placeholder="Choose audio singers" disabled={loadingSingers}>
                    {singersArray ? singersArray : null}
                </Select>
            </Form.Item>
              <Button style={{"marginTop": "5px"}} onClick={() => setNewSingerModalShow(true)}>New Singer</Button>
            <Form.Item label="Genre" name="genre" rules={[{ required: true, message: 'Please, select genre!',},]}>
                <Select placeholder="Select genre" default={null} disabled={loadingGenres}>
                    {loadingGenres ? null : genres.map(res => {
                        return <Option key={res.name} value={res._id}>{res.name}</Option>})}
                </Select>
            </Form.Item>
            <Form.Item label="Audio file" name="audioFile" showuploadlist="false" required>
              <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Audio Image" name="audioImage" showuploadlist="false" required>
              <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Duration" name="duration" rules={[{ required: true, message: 'Please input your username!', },]}>
                <Input placeholder="Please use XX:XX format"/>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 18, }}>
                <Button type="primary" htmlType="submit">
                    Create
                </Button>
            </Form.Item>
        </Form>
      </Spin>
    </Modal>

    <Modal title="Update audio" footer={false} visible={props.modal === 'edit_audio'} onCancel={() => {props.setModal({modal: ''}); editAudioForm.resetFields()}}>
      <Spin spinning={editFormLoading}>
        <Form form={editAudioForm} labelCol={{ span: 24, }} onFinish={audioUpdateHandler} name="basic"  initialValues={{ remember: true, }} autoComplete="off" encType='multipart/form-data'>
            <Form.Item label="Audio title" name="title" rules={[{required: false, message: 'Please input your username!',},]}>
                <Input placeholder="Enter new audio title"/>
            </Form.Item>
            <Form.Item label="Audio Singers" name="singers" rules={[{ required: false, message: 'Please, select singers!',},]}>
                <Select mode="multiple" allowClear placeholder="Choose new audio singers" disabled={loadingSingers}>
                    {singersArray ? singersArray : null}
                </Select>
            </Form.Item>
            <Form.Item label="Genre" name="genre" rules={[{ required: false, message: 'Please, select genre!',},]}>
                <Select placeholder="Select new genre" default={null} disabled={loadingGenres}>
                    {loadingGenres ? null : genres.map(res => {
                        return <Option key={res.name} value={res._id}>{res.name}</Option>})}
                </Select>
            </Form.Item>
            <Form.Item label="Audio file" name="audioFile" showuploadlist="false">
              <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
            <Form.Item label="Audio Image" name="audioImage" showuploadlist="false">
              <Upload beforeUpload={() => false}>
                <Button icon={<UploadOutlined />}>Upload</Button>
              </Upload>
            </Form.Item>
              <Form.Item label="Duration" name="duration" rules={[{ required: false, message: 'Please input your username!', },]}>
                  <Input placeholder="Select new duration(Please use XX:XX format)"/>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 18, }}>
                <Button type="primary" htmlType="submit">
                  Update
                </Button>
            </Form.Item>
        </Form>
      </Spin>
    </Modal>

    <div className="container">
      <div className='audio-search-wrapper'>
        <Input type="primary" placeholder='What song are you searching for?'/>
        <div className='audio-search-sort-by-wrapper'>
          <Tooltip title="New Audio">
            <Button shape="circle" icon={<PlusOutlined/>} onClick={() => props.setModal('new_audio')}/>
          </Tooltip>
          <img style={{"width": '24px', "height": '24px', "marginLeft": "10px"}} src="images/sort-by.svg" alt="" />
          <div className='audio-search-sort-by-item' onClick={sortByListenCountHandler}> Listen Count 
              <img src={listenCountSort ? 'images/sort-down.svg' : 'images/sort-up.svg'} alt="sort" />
          </div>
        </div>
      </div>
      <div className="audio-container-wrapper">
        <div style={{marginLeft: '1%'}}>
          <div style={{ margin: '10px'}}>
            <img style={{width: '24px', height: '24px'}} src="images/genres.svg" alt="genres"/>
            <span className='audio-container-wrapper-span'>Genres</span>
          </div>
            <AudioFilters clicked={setGenreForFilter} activeGenre={genre}/>
          </div>
        <div className="audio-pagination">
          <div style={{ margin: '10px'}}>
              <img style={{width: '24px', height: '24px'}} src="images/other-audios.svg" alt="audios"/>
              <span className='audio-container-wrapper-span'>Track List</span>
          </div>
          <div className="audio-item-wrapper">
            {audios}
          </div>
        </div>
      </div>  
    <AudioFooter />
    </div>    
      </> 
    )
} 

export default Audio;
