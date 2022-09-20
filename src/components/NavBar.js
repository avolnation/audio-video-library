import React, { useState } from "react";
import { DownOutlined, SmileOutlined } from '@ant-design/icons';
import { Dropdown, Menu, Space } from 'antd'
import ModalWindow from "./ModalWindow";
import "./NavBar.css"

const NavBar = props => {

    const [modalType, setModalType] = useState("");

    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);

    const handleShow = ({ key }) => {
        console.log(key)
        if(+key === 1){
            setModalType("Log In")
        }
        if(+key === 2){
            setModalType("Sign Up")
        }
        setShow(true)
    };

    const handleUserMenuClick = ({ key }) => {
      console.log(key)
      if(+key == 4){
        props.logout()
      }
    }


    const accountDropdown = 
    props.authenticated ? (<Menu onClick={handleUserMenuClick}
        items={[
          {
            key: '1',
            label: (
              <a style={{"textDecoration": "none"}} href="http://localhost:3000/collection">
                Collection
              </a>
            ),
          },
          props.userRole == 'admin' 
          ? 
          {
            key: '2',
            label: (
              <a style={{"textDecoration": "none"}} href="http://localhost:3000/admin-panel">
                Admin panel
              </a>
            ),
            // icon: <SmileOutlined />,
            disabled: false,
          }
          : 
          null,
          {
            key: '4',
            danger: true,
            label: 'Sign out',
          },
        ]}
  />) : (<Menu onClick={handleShow}
    items={[
      {
        key: '1',
        label: "Log In",
      },
      {
        key: '2',
        label: 'Sign Up',
        disabled: false,
      },
    ]}
/>)
        
    
    return (
        <>
            <ModalWindow notification={props.notif} modalType={modalType} show={show} hide={handleClose}></ModalWindow>
            <nav className="navigation">
                <ul className="navigation-items">
                    <li>
                        <a>Logo here</a>
                    </li>
                    <li>
                        <a href="http://localhost:3000/audios">Audios</a> 
                    </li>
                    {/* <li>
                        <a>Videos</a>
                    </li> */}
                    <li>
                        <Dropdown overlay={accountDropdown} trigger={['click']}>
                            <a onClick={(e) => e.preventDefault()}>
                                My account
                            </a>
                        </Dropdown>  
                    </li>
                                     
                </ul>  
            </nav>
        </>
    );
}

export default NavBar;


