import React, { useState, useMemo } from 'react'

import { Dropdown, Popconfirm, Menu, Modal, Form, Input, Button, Spin, notification } from 'antd'
import { UserOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { useEffect } from 'react'

const Collection = (props) => {

    const [ likedSongs, setLikedSongs ] = useState([])
    const [ menuKey, setMenuKey ] = useState('playlists')


    const [ newPlaylistForm, setNewPlaylistForm ] = useState({})

    const [ editPlaylistForm, setEditPlaylistForm ] = useState({})

    const [ editModalVisibility, setEditModalVisibility ] = useState(false)
 
    const collectionMenuHandler = ({ key }) => {
        setMenuKey(key)
    }

    const playlistsMenu = (item) => (
        <Menu>
          <Menu.Item key="1" icon={<EyeOutlined/>}>View</Menu.Item>
          <Menu.Item key="3" icon={<EditOutlined />} onClick={() => {
            setEditModalVisibility(true)
            setEditPlaylistForm({...editPlaylistForm, "playlist-id": item._id})}}> Edit 
          </Menu.Item>
          <Popconfirm placement="topRight" title={`You\'re about to delete playlist. Proceed?`} okText="Yes" cancelText="No" onConfirm={() => handlePlaylistDelete(item._id)}>
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
            <Dropdown overlay={playlistsMenu(el)} trigger={['contextMenu']}>
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
        .then(res => res.json())
        .then(res => {
            props.notification(res.status, res.status == 'success' ? 'Success' : 'Error', res.message)
            props.setModal('')
            props.fetchPlaylists()
        })
    }

    const handleEditPlaylist = (item) => {

        const token = props.getCookie('token')

        const formData = new FormData();
        
        formData.append("playlist-id", editPlaylistForm["playlist-id"])

        if(editPlaylistForm["playlist-title"]){
            formData.append('playlist-title', editPlaylistForm["playlist-title"])
        }
        if(token){
            formData.append('token', token)
        }
        if(editPlaylistForm["playlist-image"]){
            formData.append('playlist-image', editPlaylistForm["playlist-image"])
        }
        
        
        fetch('http://localhost:3002/playlists/edit-playlist', 
        {method: 'POST', 
        body: formData})
        .then(res => {
            console.log(res)
            return res.json()
        })
        .then(res => {
            props.notification(res.status, res.status == 'success' ? 'Success' : 'Error', res.message)
            setEditModalVisibility(false)
            props.fetchPlaylists()
        })
    }

    const handlePlaylistDelete = ( id ) => {
        fetch('http://localhost:3002/playlists/delete-playlist/' + id, 
        {method: 'GET'})
        .then(res => {
            console.log(res)
            return res.json()
        })
        .then(res => {
            props.notification(res.status, res.status == 'success' ? 'Success' : 'Error', res.message)
            props.fetchPlaylists()
        })
    }

    const playlistsHere = useMemo(() => renderPlaylists(), [menuKey])
    // const editModal = useMemo(() => renderEditModal, [props.modal])

    useEffect(() => {
        console.log(editPlaylistForm)
    }, [editPlaylistForm])


    return (
        <>
        <Modal footer={false} title={'New playlist'} visible={props.modal == "new_playlist"} onCancel={() => props.setModal({modal: ''})} onOk={() => {props.setModal({modal: ''});}}>
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

        <Modal footer={false} title={'Edit playlist'} visible={editModalVisibility} onCancel={() => {setEditModalVisibility(false); setEditPlaylistForm({})}} onOk={() => {props.setModal({modal: ''});}}>
            <Form onFinish={handleEditPlaylist} encType='multipart/form-data'>
             {/* initialValues={{"title": editPlaylistForm["playlist-title"] ? editPlaylistForm["playlist-title"] : null}}>*/}
                <Form.Item
                    name="title"
                    label="New playlist name"
                    rules={[{required: true},]}>
                    <Input id="playlist-title" onChange={(e) => setEditPlaylistForm({...editPlaylistForm, "playlist-title": e.target.value})}/>
                </Form.Item>
                <Form.Item label="New cover image">
                    <Input onChange={(e) => setEditPlaylistForm({...editPlaylistForm, "playlist-image": e.target.files[0]})} placeholder="Playlist cover" type="file"/>
                </Form.Item>
                <Form.Item style={{"textAlign": "center", "margin": "0 auto"}}>
                    <Button type="primary" htmlType='submit'>Save changes</Button>
                </Form.Item>
            </Form>
        </Modal>

            <div className="container">    
                <div className='collection-page-wrapper'>
                    <div style={{"margin": "10px", "display": "flex"}} className="audio-page-user-info">
                            <div style={{"margin": "2%", "borderRadius": "50px", "width": "150px"}}>
                                <UserOutlined style={{"fontSize": "124px"}}/>
                            </div>
                            
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