import React, { useEffect, useState } from 'react';

import AudioFooter from '../components/audio/AudioFooter';
import AudioFilters from '../components/audioFilter/audioFilters';

import { Dropdown, Menu, Popconfirm, Modal, Form, Input, Select, Button, Spin } from 'antd'

import { EditOutlined, DeleteOutlined, EyeOutlined, PlusOutlined } from '@ant-design/icons'


const Audio = (props) => {

  const singersArray = []

  const { Option } = Select;

  const { SubMenu } = Menu;

  const [genre, setGenre] = useState(null);
  const [tracks, setTracks] = useState([])
  const [genres, setGenres] = useState({})

  const [loading, setLoading] = useState(false);
  const [singers, setSingers] = useState(null) 
  const [loadingGenres, setLoadingGenres] = useState(true)
  const [loadingSingers, setLoadingSingers] = useState(true);
  const [formLoading, setFormLoading] = useState(false)

  const [listenCountSort, setListenCountSort] = useState(false) 
  const [singerForm, setSingerForm] = useState({})

  const [editAudioForm] = Form.useForm()

  const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = () => {
        setShow(true)
    };


  useEffect(() => {
    fetchGenres()
    fetchSingers()
    fetchAudios()
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

const fetchAudios = () => {
    fetch('http://localhost:3002/audios/all-audios', {method: 'GET'})
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

  const addToPlaylistHandler = ( audioId, playlistId ) => {
    fetch('http://localhost:3002/playlists/add-to-playlist', {method: 'POST',
    headers: {"Content-Type": "application/json"},
    body: JSON.stringify({playlistId: playlistId, audioId: audioId}),
    })
    .then(result => result.json())
    .then(result => {
      props.notification(result.status, result.status == 'success' ? 'Success' : 'Error', result.message)
    })
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
        setSingerForm({...singerForm, id: item})
        props.setModal('edit_audio')
        }}> Edit 
      </Menu.Item>
      <Popconfirm onConfirm={() => handleAudioDelete(item)} placement="topRight" title={`You\'re about to delete track. Proceed?`} okText="Да" cancelText="Нет">
          <Menu.Item danger key="4" icon={<DeleteOutlined />}>
            Delete
          </Menu.Item>
      </Popconfirm>
    </Menu>)

  let audios;
  
  audios = tracks.map((el, index) => {
        return (
          <Dropdown overlay={audiosMenu(el._id)} trigger={['contextMenu']}>
            <div className="audio-item" key={el.title}>
                <div className="grid-play">
                  <img src="/images/play-button.svg" alt="play"/>
                </div>
                <div className="grid-album-cover">
                  <img src={"http://localhost:3002/" + el.imagePath} alt="albumCover"/>
                </div>
                <div className="grid-singers">{el.singers.map(el => {
                  return el.name }).join(', ')}
                </div>
                <div className="grid-title">{el.title}</div>
                <span className="grid-audio-item-duration">{el.duration}</span>
            </div>
          </Dropdown>
              
        )
      })

    
  const setGenreForFilter = (el) => {
    setGenre(el.target.id)
  }

  const toAudioPageHandler = (id) => {
    console.log(id)
    props.history.push( props.history.location.pathname + '/' + id)
  }

  const sortByListenCountHandler = () => {
    setListenCountSort(!listenCountSort)
  }

  singersArray.push(singers ? singers.map((el, idx) => {
    return <Option key={el._id}>
        <img style={{"width": "30px", "marginRight": "5px"}} src={'http://localhost:3002/' + el.imageUrl} role="img"></img>
        {el.name}
        </Option>
}) : null)

const isEmpty = (obj) => {
  for (let key in obj) {
    return false;
  }
  return true;
}

const handleAudioDelete = ( id ) => {
  fetch('http://localhost:3002/audios/delete-audio/' + id, {
    method: 'DELETE'})
  // setTimeout(() => window.location.reload(), 500)
}

const handleSongUpdate = async (e) => {

  setFormLoading(true)

  const audioFormData = new FormData();
      if(singerForm.id){
        audioFormData.append("id", singerForm.id)
      }
      if(singerForm.title){
        audioFormData.append("title", singerForm.title)
      }
      if(singerForm.singers && singerForm.singers.length >= 1){
        audioFormData.append("singers", JSON.stringify(singerForm.singers))
      }
      if(singerForm.genre){
        audioFormData.append("genre", singerForm.genre)
      }
      if(singerForm["audio-file"]){
        audioFormData.append("audio-file", singerForm["audio-file"])
      }
      if(singerForm["audio-image"]){
        audioFormData.append("audio-image", singerForm["audio-image"])
      }
      if(singerForm.duration){
        audioFormData.append("duration", singerForm.duration)
      }
      
  const result = await fetch('http://localhost:3002/audios/edit-audio', {
    method: 'POST',
    body: audioFormData})

  const parsedResult = await result.json()

  console.log(await parsedResult)

  props.notification('success', 'Success', await parsedResult.message)

  fetchAudios()

  props.setModal({modal: ''})

  editAudioForm.resetFields()
  
  setFormLoading(false)

  setTimeout(() => window.location.reload(), 500)
  
}

  return (
    <>
    <Modal title="Update audio" footer={false} visible={props.modal === 'edit_audio'} onCancel={() => {props.setModal({modal: ''}); editAudioForm.resetFields()}}>
      <Spin spinning={formLoading}>
            <Form form={editAudioForm} onFinish={handleSongUpdate} name="basic"  initialValues={{ remember: true, }} autoComplete="off" encType='multipart/form-data'>
                <Form.Item label="Audio title" name="audio-title" rules={[{required: false, message: 'Please input your username!',},]}>
                    <Input onChange={e => setSingerForm({...singerForm, title: e.target.value})} placeholder="Enter new audio title"/>
                </Form.Item>
                <Form.Item label="Audio Singers" name="singers" rules={[{ required: false, message: 'Please, select singers!',},]}>
                    <Select onChange={e => setSingerForm({...singerForm, singers: e})} mode="multiple" allowClear placeholder="Choose new audio singers" disabled={loadingSingers}>
                        {singersArray ? singersArray : null}
                    </Select>
                </Form.Item>
                <Form.Item label="Genre" name="genre" rules={[{ required: false, message: 'Please, select genre!',},]}>
                    <Select onChange={e => setSingerForm({...singerForm, genre: e})} placeholder="Select new genre" default={null} disabled={loadingGenres}>
                        {loadingGenres ? null : genres.map(res => {
                            return <Option key={res.name} value={res._id}>{res.name}</Option>})}
                    </Select>
                </Form.Item>
                <Form.Item label="Audio file" >
                    <Input onChange={(e) => setSingerForm({...singerForm, "audio-file": e.target.files[0]})} placeholder="Audio file" type="file"/>
                </Form.Item>
                <Form.Item label="Audio Image" >
                    <Input onChange={(e) => setSingerForm({...singerForm, "audio-image": e.target.files[0]})} type="file"/>
                </Form.Item>
                <Form.Item label="Duration" name="duration" rules={[{ required: false, message: 'Please input your username!', },]}>
                    <Input onChange={e => setSingerForm({...singerForm, duration: e.target.value})} placeholder="Select new duration(Please use XX:XX format)"/>
                </Form.Item>
                <Form.Item wrapperCol={{ offset: 10, span: 18, }}>
                    <Button type="primary" htmlType="submit">
                        Submit
                    </Button>
                </Form.Item>
            </Form>
        </Spin>
    </Modal>
      <div className="container">
        <div className='audio-search-wrapper'>
              <input type="text" placeholder='What song are you searching for?'/>
              <Button type="primary"><span><PlusOutlined style={{ verticalAlign: 'middle', }}/> <span>New Audio</span> </span></Button>
              <div className='audio-search-sort-by-wrapper'>
                <img style={{width: '24px', height: '24px'}} src="images/sort-by.svg" alt="" />
                <div 
                    className='audio-search-sort-by-item' 
                    onClick={sortByListenCountHandler}> Listen Count 
                    <img 
                      src={listenCountSort ? 'images/sort-down.svg' : 'images/sort-up.svg'} 
                      alt="sort" />
                  </div>
              </div>
        </div>
         <div className="audio-container-wrapper">

          <div style={{marginLeft: '1%'}}>
          <div style={{ margin: '10px'}}>
            <img style={{width: '24px', height: '24px'}} src="images/genres.svg" alt="genres"/>
            <span className='audio-container-wrapper-span'>Genres</span>
          </div>
            <AudioFilters clicked={setGenreForFilter}/>
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
