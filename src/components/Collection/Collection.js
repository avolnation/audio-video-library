import React, { useState, useMemo } from 'react'

import { Dropdown, Popconfirm, Menu, Modal, Form, Input, Button, Spin } from 'antd'
import { PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import Spinner from '../UI/Spinner'

import { useEffect } from 'react'

const Collection = (props) => {

    const [ likedSongs, setLikedSongs ] = useState([])
    const [ menuKey, setMenuKey ] = useState('playlists')


    const [ newPlaylistForm, setNewPlaylistForm ] = useState({})

    // useEffect(() => {
    //     console.log(newPlaylistForm)
    // }, [newPlaylistForm])

    const collectionMenuHandler = ({ key }) => {
        setMenuKey(key)
    }

    const playlistsMenu = (item) => (
        <Menu>
          <Menu.Item key="1" icon={<EyeOutlined/>}>View</Menu.Item>
          <Menu.Item key="3" icon={<EditOutlined />} onClick={() => {
            props.setModal('edit_audio')
            }}> Edit 
          </Menu.Item>
          <Popconfirm placement="topRight" title={`You\'re about to delete track. Proceed?`} okText="Да" cancelText="Нет">
              <Menu.Item danger key="4" icon={<DeleteOutlined />}>
                Delete
              </Menu.Item>
          </Popconfirm>
        </Menu>)

    const renderPlaylists = () => {
        let playlistsRender; 

        playlistsRender = 
        props.playlists.length >= 1 ? 
        props.playlists.map(el => {
            return <>
            <Dropdown overlay={playlistsMenu(el._id)} trigger={['contextMenu']}>
            <div className="playlist-img playlist-img-hover" key={el._id} style={{"padding": "1%"}}>
                <div style={{"display": "flex", "width": "150px", "height": "150px", "margin": "1% 1%", "background": `no-repeat url("http://localhost:3002/${el.image}")`, "backgroundSize" : "90%"}} > 
                </div> 
                <span>{el.title}</span>  
            </div>
            </Dropdown>
            </>
        })
        : 
        <>
            <div> No playlists yet</div>
        </>
    
        let collectionMenu;
    
        if(menuKey == 'playlists'){
            collectionMenu = 
            <> 
                <div className="playlist-img playlist-img-hover" style={{"padding": "1%"}}>
                <div style={{"display": "flex", "width": "150px", "height": "150px", "backgroundColor" : "#FAFAFA"}} className="playlist-img" onClick={() => props.setModal('new_playlist')}> 
                    <PlusOutlined style={{ "margin": "auto auto", "fontSize": "100px", "color": "lightgray"}}/>
                </div>
                </div>
                {playlistsRender} 
                
            </>
        }
        if(menuKey == 'favorites'){
            collectionMenu = <h1>Hello</h1>
        }
        return collectionMenu
    }

    const handlePlaylistCreation = (e) => {

        const token = props.getCookie('token')

        const formData = new FormData();
    
        formData.append('playlist-title', newPlaylistForm["playlist-title"])
        formData.append('token', token)
        formData.append('playlist-image', newPlaylistForm["playlist-image"])
    
        fetch('http://localhost:3002/playlists/new-playlist', 
        {method: 'POST', 
        body: formData})
        .then(res => {
            console.log(res)
        })
      }

      const playlistsHere = useMemo(() => renderPlaylists(), [menuKey])


    return (
        <>
        <Modal footer={false} title={'New playlist'} visible={props.modal === 'new_playlist'} onCancel={() => props.setModal({modal: ''})} onOk={() => {props.setModal({modal: ''});}}>
                    <Form onFinish={handlePlaylistCreation} encType='multipart/form-data'>
                    <Form.Item
                        name="title"
                        label="Playlist name"
                        rules={[{required: true},]}>
                        <Input onChange={(e) => setNewPlaylistForm({...newPlaylistForm, "playlist-title": e.target.value})}/>
                    </Form.Item>
                    <Form.Item label="Cover Image">
                    <Input onChange={(e) => setNewPlaylistForm({...newPlaylistForm, "playlist-image": e.target.files[0]})} placeholder="Playlist cover" type="file"/>
                </Form.Item>
                    <Form.Item style={{"textAlign": "center", "margin": "0 auto"}}>
                    <Button type="primary" htmlType='submit'>Create playlist</Button>
                    </Form.Item>
                    </Form>
                </Modal>

            <div className="container">    
                <div className='collection-page-wrapper'>
                    <div style={{"margin": "10px", "display": "flex"}} className="audio-page-user-info">
                            <img style={{"marginRight": "20px","borderRadius": "50px", "width": "200px"}} src="https://i.pinimg.com/originals/37/6a/b1/376ab12a215b9f418806ac35b50e7299.jpg" alt="profile img"/>
                        <div style={{"marginTop": "10px"}} className="audio-page-username">
                            <p>Collection</p>
                            <p style={{"fontWeight": "bold", "fontSize":"1.5em"}}>{props.username ? props.username : 'user'}</p>
                        </div>

                    </div>
                    <Menu defaultSelectedKeys={['playlists']} style={{"background":"none", "borderBottom":"2px solid lightgray", "margin": "5px 10px"}} mode="horizontal" onClick={collectionMenuHandler}>
                            <Menu.Item key='favorites'>Favorites</Menu.Item>
                            <Menu.Item key='playlists'>Playlists</Menu.Item>
                    </Menu>
                    <div style={{"margin": "35px", "display": "flex", "flexDirection": "row", "flexWrap": "wrap"}} className="collection-page-container">
                        {playlistsHere}
                    </div>                    
                </div>
            </div>
        </>
        
    )
}

export default Collection