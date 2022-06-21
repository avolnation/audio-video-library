import React, { useState } from "react";
import {Navbar, Container, Nav, NavDropdown} from "react-bootstrap"
import userIcon from "../images/user.png"
import ModalWindow from "./ModalWindow";

const NavBar = props => {

    const [modalType, setModalType] = useState("");



    const [show, setShow] = useState(false);

    const handleClose = () => setShow(false);
    const handleShow = (e) => {
        if(e === 1){
            setModalType("signup")
        }
        if(e === 2){
            setModalType("login")
        }
        setShow(true)
    };



    return (
        <React.Fragment>
            <ModalWindow modalType={modalType} show={show} hide={handleClose}></ModalWindow>
            <Navbar bg="light" expand="lg">
                <Container>
                    <Navbar.Brand href="/">Audio-Video Library</Navbar.Brand>
                    <Navbar.Toggle aria-controls="basic-navbar-nav" />
                    <Navbar.Collapse id="basic-navbar-nav">
                    <Nav className="me-auto" justify="true">
                        <Nav.Link href="/videos">Videos</Nav.Link>
                        <Nav.Link href="/audios">Audios</Nav.Link>
                        <NavDropdown title="My Account" id="basic-nav-dropdown">
                        <Container>
                        <Navbar.Brand href="#home">
                            <img 
                            style={{"width": "30px", "height": "30px"}}
                            src={userIcon}
                            alt="User"/>
                        </Navbar.Brand>
                        </Container>
                        { props.authenticated ? 
                        <React.Fragment>
                            <NavDropdown.Item href="#action/3.1">My Profile</NavDropdown.Item>
                            <NavDropdown.Item href="#action/3.2">Favorites</NavDropdown.Item>
                            <NavDropdown.Divider />
                                <NavDropdown.Item 
                                style={{"color": "red"}} 
                                href="#action/3.3" >
                                Log out
                                </NavDropdown.Item>
                        </React.Fragment> 
                            : 
                            <React.Fragment>
                                <NavDropdown.Item onClick={() => handleShow(1)} href="#action/3.2">Sign Up</NavDropdown.Item>
                                <NavDropdown.Item onClick={() => handleShow(2)} href="#action/3.1">Log In</NavDropdown.Item>
                            </React.Fragment>
                        }
                        </NavDropdown>
                    </Nav>
                    </Navbar.Collapse>
                </Container>
            </Navbar>
        </React.Fragment>
    );
}

export default NavBar;


