import React, { useState } from 'react'

import { Menu, Modal, Form, Input, Button } from 'antd'
import { PlusOutlined } from '@ant-design/icons'
// import audioList from '../audioList'
// import './AudioPage.css'
import Spinner from '../UI/Spinner'
import { useEffect } from 'react'

const Collection = (props) => {

    const [ likedSongs, setLikedSongs ] = useState([])
    const [ playlists, setPlaylists ] = useState([])
    const [ menuKey, setMenuKey ] = useState('playlists')


    const [ newPlaylistForm, setNewPlaylistForm ] = useState({})

    useEffect(() => {
        console.log(newPlaylistForm)
    }, [newPlaylistForm])

    const collectionMenuHandler = ({ key }) => {
        setMenuKey(key)
    }

    let collectionMenu;

    if(menuKey == 'playlists'){
        collectionMenu = 
        <> 
            <div style={{"display": "flex", "width": "150px", "height": "150px", "backgroundColor" : "#FAFAFA"}} className="playlist-img playlist-img-hover" onClick={() => props.setModal('new_playlist')}> 
                <PlusOutlined style={{ "margin": "auto auto", "fontSize": "100px", "color": "lightgray"}}/>
            </div> 
            <div style={{"width": "150px", "height": "150px", "backgroundColor" : "#FAFAFA"}} className="playlist-img"> 
            </div>
        </>
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
                            <p style={{"fontWeight": "bold", "fontSize":"1.5em"}}>Username</p>
                        </div>

                    </div>
                    <Menu defaultSelectedKeys={['playlists']} style={{"background":"none", "borderBottom":"2px solid lightgray", "margin": "5px 10px"}} mode="horizontal" onClick={collectionMenuHandler}>
                            <Menu.Item key='favorites'>Favorites</Menu.Item>
                            <Menu.Item key='playlists'>Playlists</Menu.Item>
                    </Menu>
                    <div style={{"margin": "35px", "display": "flex", "flexDirection": "row", "flexWrap": "wrap"}} className="collection-page-container">
                        {collectionMenu}
                    </div>                    
                </div>
            </div>
        </>
        
    )
}

export default Collection