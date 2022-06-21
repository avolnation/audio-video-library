import React from "react";
import {Navbar, Container, Nav, NavDropdown} from "react-bootstrap"
import userIcon from "../images/user.png"

const NavBar = props => {
    return (
        <Navbar bg="light" expand="lg">
            <Container>
                <Navbar.Brand href="#home">Audio-Video Library</Navbar.Brand>
                <Navbar.Toggle aria-controls="basic-navbar-nav" />
                <Navbar.Collapse id="basic-navbar-nav">
                <Nav className="me-auto" justify="true">
                    <Nav.Link href="#home">Videos</Nav.Link>
                    <Nav.Link href="#link">Audios</Nav.Link>
                    <NavDropdown title="My Account" id="basic-nav-dropdown">
                    <Container>
                    <Navbar.Brand href="#home">
                        <img 
                        style={{"width": "30px", "height": "30px"}}
                        src={userIcon}
                        alt="User"/>
                    </Navbar.Brand>
                    </Container>
                    <NavDropdown.Item href="#action/3.1">My Profile</NavDropdown.Item>
                    <NavDropdown.Item href="#action/3.2">Favorites</NavDropdown.Item>
                    { props.authenticated ? 
                    <React.Fragment>
                        <NavDropdown.Divider />
                            <NavDropdown.Item 
                            style={{"color": "red"}} 
                            href="#action/3.3" >
                            Log out
                            </NavDropdown.Item>
                    </React.Fragment> 
                        : null
                    }
                    </NavDropdown>
                </Nav>
                </Navbar.Collapse>
            </Container>
        </Navbar>
    );
}

export default NavBar;


