import React, { useState, useMemo, useRef } from 'react'

import { Dropdown, Popconfirm, Menu, Modal, Form, Input, Button, Avatar, Spin, Result, List, Skeleton, Select, Upload } from 'antd'
import { UploadOutlined, FileUnknownOutlined, UserOutlined, PlusOutlined, EyeOutlined, EditOutlined, DeleteOutlined } from '@ant-design/icons'

import { useEffect } from 'react'

const AdminPanel = (props) => {

    const {Option} = Select

    const [ likedSongs, setLikedSongs ] = useState([])

    const [ usersInfo, setUsersInfo ] = useState([])

    const [ usersInfoLoading, setUsersInfoLoading ] = useState(true)

    const [ menuKey, setMenuKey ] = useState('users')

    const [ singerId, setSingerId ] = useState(null)

    // const [ newPlaylistForm, setNewPlaylistForm ] = useState({})

    // const [ editPlaylistForm, setEditPlaylistForm ] = useState({})

    const [ editModalVisibility, setEditModalVisibility ] = useState(false)

    const [ newSingerModalShow, setNewSingerModalShow] = useState(false)

    const [ loadingSingers, setLoadingSingers ] = useState(true)

    const [ singers, setSingers ] = useState([])

    let updateUser = useRef({})

    const [updateSingerForm] = Form.useForm()
    const [newSingerForm] = Form.useForm()

    useEffect(() => {
        console.log(menuKey)
    }, [])

    const fetchUsers = () => {
        fetch(props.api_url + 'users/all-users/' + props.getCookie('token'), {method: 'GET'})
        .then(result => result.json())
        .then(result => {
            setUsersInfo(result)
            // props.notification(result.status, result.status.charAt(0).toUpperCase() + result.status.slice(1), result.message)
            setUsersInfoLoading(false)
        })
        .catch(err => console.log(err.message))
    }

    const fetchSingers = () => {
        fetch(props.api_url + 'singers/all-singers', {method: 'GET'})
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
    
        })
    }

    const handleSelect = (item) => {
        updateUser = {...updateUser, newRole: item, userToken: props.getCookie('token')}
        console.log(updateUser)
        if(updateUser.role == updateUser.newRole){
            props.notification('error', 'Error', `User ${updateUser.email} have this role already`)
            return null;
        }

        setUsersInfoLoading(true)

        fetch(props.api_url + 'users/change-role', 
        {method: 'POST', 
        body: JSON.stringify(updateUser), 
        headers: {'Content-Type': 'application/json'}})
        .then(result => result.json())
        .then(result => {
            updateUser = {}
            fetchUsers()
            props.notification(result.status, result.status.charAt(0).toUpperCase() + result.status.slice(1), result.message)
            console.log(result)
            // setUsersInfoLoading(false)
        })
        return null;
    }

    const singerCreationHandler = (values) => {
        console.log(values)
        // console.log(e.target.files)
        // console.log(form)
        const formData = new FormData();
      
        formData.append('name', values.name)
        formData.append('image', values.image.file)
      
        fetch(props.api_url + 'singers/add-singer', 
        {method: 'POST', 
        body: formData})
        .then(res => {
            return res.json()
        })
        .then(res => {
            fetchSingers()
            props.notification(res.status, res.status.charAt(0).toUpperCase() + res.status.slice(1), res.message)
            setNewSingerModalShow(false)
            newSingerForm.resetFields()
        })
      }

    const handleEditSinger = (values) => {

        const formData = new FormData();

        const token = props.getCookie('token');

        console.log(values);
        
        if(Object.keys(values).length >= 1){

            formData.append("token", token);

            formData.append("singerId", singerId)

            if(values.singerName){
                formData.append("singerName", values.singerName);
            }

            if(values.singerImage){
                formData.append("singerImage", values.singerImage.file);
            }

            setLoadingSingers(true);
            
            fetch( props.api_url + 'singers/edit-singer', 
            {method: 'POST', 
            body: formData})
            .then(res => {
                console.log(res);
                return res.json();
            })
            .then(res => {
                props.notification(res.status, res.status.charAt(0).toUpperCase() + res.status.slice(1), res.message);
                setEditModalVisibility(false);
                updateSingerForm.resetFields();
                fetchSingers();
            });
        }
        else{
            props.notification('error', 'Error', 'Something went wrong')
        }
    }

    const handleSingerDeletion = ( id ) => {
        fetch( props.api_url + 'singers/delete-singer/' + id, 
        {method: 'GET'})
        .then(res => {
            console.log(res);
            return res.json();
        })
        .then(res => {
            props.notification(res.status, res.status.charAt(0).toUpperCase() + res.status.slice(1), res.message);
            props.fetchPlaylists();
        })
    }

    const handleUserDeletion = (email) => {
        fetch('http://localhost:3002/users/delete-user/' + email, 
        {method: 'DELETE'})
        .then(res => {
            console.log(res);
            return res.json();
        })
        .then(res => {
            props.notification(res.status, res.status.charAt(0).toUpperCase() + res.status.slice(1), res.message);
            props.fetchPlaylists();
        })
    }

    useEffect(() => {
        fetchSingers();
    }, [])
    
    useEffect(() => {
        if(props.getCookie('token')){
            fetchUsers();
        }
    }, [])

    const collectionMenuHandler = ({ key }) => {
        setMenuKey(key);
    }

    const singersMenu = (item) => (
        <Menu>
          <Menu.Item key="1" icon={<EditOutlined />} onClick={() => {
            setEditModalVisibility(true);
            setSingerId(item._id)}}> 
            Edit 
          </Menu.Item>
          <Popconfirm placement="topRight" title={`You\'re about to delete playlist. Proceed?`} okText="Yes" cancelText="No" onConfirm={() => handleSingerDeletion(item._id)}>
              <Menu.Item danger key="2" icon={<DeleteOutlined />}>
                Delete
              </Menu.Item>
          </Popconfirm>
        </Menu>)

    const renderPlaylists = () => {

        let singersRender; 

        singersRender = 
        singers.length >= 1 ? 
        singers.map(el => {
            return (
                <>
                    <Dropdown overlay={singersMenu(el)} trigger={['contextMenu']}>
                        <div className="playlist-img playlist-img-hover" key={el._id} style={{"padding": "1%"}}>
                            <div style={{"display": "flex", "width": "150px", "height": "150px", "margin": "1% 1%", "background": `no-repeat url("http://localhost:3002/${el.imageUrl}")`, "backgroundSize" : "90%"}}/> 
                            <span>{el.name}</span>  
                        </div>
                    </Dropdown>                   
                </>
            ) 
        })
        : 
        <Spin size="large"/>

        let collectionMenu;
    
        if(menuKey == 'singers'){
            collectionMenu = (
                <>
                <div style={{"margin": "35px", "display": "flex", "flexDirection": "row", "flexWrap": "wrap"}} className="collection-page-container">
                    <div className="playlist-img playlist-img-hover" style={{"padding": "1%"}}>
                        <div style={{"display": "flex", "width": "150px", "height": "150px", "backgroundColor" : "#FAFAFA"}} className="playlist-img" onClick={() => setNewSingerModalShow(true)}> 
                            <PlusOutlined style={{ "margin": "auto auto", "fontSize": "100px", "color": "lightgray"}}/>
                        </div>
                    </div>
                    {loadingSingers ? <Spin/> : singersRender}
                </div> 
                </>
            )
        }

        if(menuKey == 'users'){
            collectionMenu = (
                <>
                {usersInfoLoading 
                ? 
                <div style={{margin: "15px", display: 'flex', justifyContent: 'center'}}>
                    <Spin size="large"/> 
                </div>
                :                 
                <List itemLayout='horizontal'
                >
                    {usersInfo.body ? usersInfo.body.map(item => {
                        return (
                            <div style={{"margin": "35px"}} className="collection-page-container">
                                <List.Item key={item.email} actions={[ props.username == item.email ? <span style={{color: 'black', fontWeight: "bold"}}> Can't manage your own role </span> : <Select id={item.email} key={item.email} defaultValue={item.role} onChange={(el) => { updateUser = { ...item }; handleSelect(el); }}><Option value="admin">Admin</Option><Option value="user">User</Option></Select>,/*<Button>Generate new password</Button>*/ props.username == item.email ? <span style={{color: 'black', fontWeight: "bold"}}> Can't delete your own account </span> : <Popconfirm title="You're about to delete this user. Proceed?" onConfirm={() => handleUserDeletion(item.email)}><Button type="danger">Remove account</Button></Popconfirm>]}>
                                    <Skeleton avatar title={false} loading={item.loading} active>
                                        <List.Item.Meta avatar={<UserOutlined style={{"fontSize": "64px"}}/>} title={item.email} description="Additional info here if presented"/>
                                    </Skeleton>
                                </List.Item>
                            </div>                    
                        )
                    }) 
                    : 
                    <div style={{margin: "15px", display: 'flex', justifyContent: 'center'}}>
                        <Spin size="large"/> 
                    </div>}
                </List>}
                </>
            )
        }

        return collectionMenu
    }

    return (
        <>
        {props.userRole == "admin" 
        ? 
        <> 
            {/* <Modal footer={false} title={'New playlist'} visible={props.modal == "new_playlist"} onCancel={() => props.setModal({modal: ''})} onOk={() => {props.setModal({modal: ''});}}>
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
        </Modal> */}

        <Modal footer={false} title="New Singer" visible={newSingerModalShow} onCancel={() => {setNewSingerModalShow(false); newSingerForm.resetFields()}}>
        <Form form={newSingerForm} labelCol={{ span: 24, }} onFinish={singerCreationHandler} encType="multipart/form-data">
            <Form.Item label="Singer name" name="name" required>
            <Input></Input>
            </Form.Item>
            <Form.Item label="Singer Image" name="image" showuploadlist="false" required>
                <Upload beforeUpload={() => false} status="removed">
                <Button icon={<UploadOutlined />}>Upload</Button>
                </Upload>
            </Form.Item>
            <Form.Item wrapperCol={{ offset: 10, span: 18, }}>
                <Button type="primary" htmlType="submit">Create</Button>
            </Form.Item>
        </Form>
        </Modal>

        <Modal footer={false} title={'Edit Singer'} visible={editModalVisibility} onCancel={() => {setEditModalVisibility(false); updateSingerForm.resetFields()}} onOk={() => {props.setModal({modal: ''});}}>
            <Form form={updateSingerForm} onFinish={handleEditSinger} encType='multipart/form-data'>
                <Form.Item name="singerName" label="New singer name">
                    <Input id="singerName"/>
                </Form.Item>
                <Form.Item label="New singer image" name="singerImage" showuploadlist="false">
                    <Upload beforeUpload={() => false}>
                        <Button icon={<UploadOutlined />}>Upload</Button>
                    </Upload>
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
                            <p>Admin panel</p>
                            <p style={{"fontWeight": "bold", "fontSize":"1.5em"}}>{props.username ? props.username : 'user'}</p>
                        </div>

                    </div>
                    <Menu defaultSelectedKeys={['users']} style={{"background":"none", "borderBottom":"2px solid lightgray", "margin": "5px 10px"}} mode="horizontal" onClick={collectionMenuHandler}>
                        <Menu.Item key='users'>Users</Menu.Item>
                        <Menu.Item key='singers'>Singers</Menu.Item>
                    </Menu>
                        {renderPlaylists()}
                </div>
            </div>
        </>
        :
        <Result
            status="404"
            title="404"
            subTitle="Sorry, the page you visited does not exist."
            extra={<Button type="primary">Back Home</Button>}
        />

        }
        
        </>
        
    )
}

export default AdminPanel