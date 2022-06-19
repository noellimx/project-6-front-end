// import Navbar from 'react-bootstrap/Navbar';
import * as React from "react";
import Navbar from "react-bootstrap/Navbar";
import Container from "react-bootstrap/Container";
import Nav from "react-bootstrap/Nav";
import NavDropdown from "react-bootstrap/NavDropdown";
import InputGroup from "react-bootstrap/InputGroup";
import Form from "react-bootstrap/Form";

import axios from "axios";

import { MAny } from "../utils/my-types";

const dummyVal = "GME";

const searchByValueUrl = async (val) => {
  const url = `https://symbol-search.tradingview.com/symbol_search/?text=${val}&hl=1&exchange=&lang=en&type=stock&domain=production`;
  // return fetch(`https://symbol-search.tradingview.com/symbol_search/?text=${val}&hl=1&exchange=&lang=en&type=stock&domain=production`)
  return axios.get(url, { headers: { "User-Agent": "_" } }).catch(console.log);
};

const loadTickers = (prefix) => {
  // base on prefix

  return [{ symbol: "..", desc: "..." }];
};

const loadMockMyFavourite = async (token) => {
  // ask server for my fav
  return [
    { symbol: "..", desc: "..." },
    { symbol: "..", desc: "..." },
  ];
};

const loadServerMyFav = async () => {}; // TODO
// const loadFavourite =
//   process?.env['ENV'] === 'production' ? loadServerMyFav : loadMockMyFavourite;

const loadFavourite = loadMockMyFavourite;

export default function MyNavbar({ setTicker }) {
  const [favs, setFavs] = React.useState<MAny>([]);
  React.useEffect(() => {
    (async () => {
      const favs = await loadMockMyFavourite("my-token");
      setFavs(favs);
    })();
    return () => {};
  }, []);

  return (
    <Navbar bg="light" expand="lg">
      <Container>
        <Navbar.Brand href="/">GoMoon</Navbar.Brand>
        <Navbar.Toggle aria-controls="basic-navbar-nav" />
        <Nav className="me-auto">
          <NavDropdown title="Favourites" id="basic-nav-dropdown">
            {favs.map(({ symbol, desc }) => {
              return (
                <NavDropdown.Item
                  onClick={() => {
                    setTicker(symbol);
                  }}
                >
                  {" "}
                  {desc}
                </NavDropdown.Item>
              );
            })}
          </NavDropdown>
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
            <NavDropdown.Item
              onClick={() => {
                setTicker("NASDAQ:AAPL");
              }}
            >
              APPLE
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={() => {
                setTicker("NASDAQ:GOOGL");
              }}
            >
              GOOGLE
            </NavDropdown.Item>
            <NavDropdown.Item
              onClick={() => {
                setTicker("NASDAQ:TSLA");
              }}
            >
              TESLA
            </NavDropdown.Item>

            {[].map(() => {
              const symbol = "...";
              const desc = "....";
              return (
                <NavDropdown.Item
                  onClick={() => {
                    setTicker(symbol);
                  }}
                >
                  {desc}
                </NavDropdown.Item>
              );
            })}
          </NavDropdown>
          <InputGroup className="ml-5">
            <Form.Control
              onChange={async (e) => {
                console.log(e.target.value);
                const result = await searchByValueUrl(e.target.value);

                console.log(result);
              }}
              placeholder="search"
              aria-label="Username"
              aria-describedby="basic-addon1"
            />
          </InputGroup>
        </Nav>
      </Container>
    </Navbar>
  );
}
