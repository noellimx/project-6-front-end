// import Navbar from 'react-bootstrap/Navbar';
import * as React from "react";

import {Button, Container, Nav, NavDropdown, Navbar} from "react-bootstrap"
import AsyncSelect from "react-select/async";
import axios from "axios";
import config from "../config"
import { MAny } from "../utils/my-types";

const gomoonHttpsServer = config.httpsserver

const searchByValueUrl = async (searchVal) => {

  return axios.get(`https://${gomoonHttpsServer}/ticker/getallticker/${searchVal}`).then((response)=>{

    return response.data.results
  })
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

const removeToken=()=>{
  document.cookie = 'gm-token=; Path=/; Expires=Thu, 01 Jan 1970 00:00:01 GMT;'
  window.location.reload();
}

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
                  key={symbol}
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
          <AsyncSelect 
          className="searchbar-navbar"
          menuPlacement="auto"
          styles={{
            menuPortal: (base) => ({ ...base, zIndex: 9999 }),
            menu: (base) => ({ ...base, zIndex: 9999 }),
          }}
          onChange={(option: { value: MAny; label: string }) => {
            console.log("running on change")
            console.log(option);
            const { value: location } = option;
            setTicker(option.value)
          }}
          loadOptions={async (searchVal) => {
            const tickerResults = await searchByValueUrl(searchVal)
              console.log("is this ticker result from axios", tickerResults)
              console.log(tickerResults[0].description)
            
            const options = tickerResults.map((x) => {

              const  description  = x.description.replace("<em>", "").replace("</em>", "");
              const  exchange = x.exchange;
              const ticker = x.symbol

              return {
                value: `${exchange}:${ticker}`,
                label: description,
              };
            });
            return options;
          }}
          />
          <Button onClick={()=>{removeToken()}}>logout</Button>
        </Nav>
      </Container>
    </Navbar>
  );
}

