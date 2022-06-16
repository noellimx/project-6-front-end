// import Navbar from 'react-bootstrap/Navbar';
import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";

export default function MyNavbar() {
  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">GoMoon</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Nav className="me-auto">
          <NavDropdown title="Forex" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">EUR/USD</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">FX 2</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">FX 3</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Futres" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">futures 1</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">futures 2</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">futures 3</NavDropdown.Item>
          </NavDropdown>
          <NavDropdown title="Stocks" id="basic-nav-dropdown">
            <NavDropdown.Item href="#action/3.1">APPLE</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.2">stock 2</NavDropdown.Item>
            <NavDropdown.Item href="#action/3.3">stock 3</NavDropdown.Item>
          </NavDropdown>
        </Nav>
      </Container>
    </Navbar>
  );
}
