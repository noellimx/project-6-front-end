import * as React from "react";
import Carousel from "react-bootstrap/Carousel";
import axios from "axios";
import { MAny } from "../types/my-types";
import { responsivePropType } from "react-bootstrap/esm/createUtilityClasses";

type News = {
  title: string;
  abstract: string;
  url: string;
};

const CarouBody: React.FC<{ news: News[] }> = ({ news }) => {
  return (
    <Carousel className="p6c">
      {news.map((x: News) => {
        return (
          <Carousel.Item>
            <img
              className="d-block w-100"
              src="https://picsum.photos/id/321/3440/1440"
              width={"100%"}
              height={"100%"}
              alt="First slide"
            />
            <Carousel.Caption>
              <h3>{x.title}</h3>
              <p>{x.abstract}</p>
              <a href={x.url}>
                <u>Read More</u>
              </a>
            </Carousel.Caption>
          </Carousel.Item>
        );
      })}
    </Carousel>
  );
};

function News() {
  const [news, setNews] = React.useState([]);

  const options: MAny = {
    method: "GET",
    url: "https://api.nytimes.com/svc/news/v3/content/nyt/business.json?api-key=I33TGJlzvDObwqvH3Jm7VV54oKcUUKAT",
  };

  const getNews = async () => {
    const newscall = await axios
      .request(options)
      .then(function (response) {
        console.log("response.data", response.data);
        console.log(response);
        console.log(response.data.results);
        setNews(response.data.results);
      })
      .catch(function (error) {
        console.error(error);
      });

    return newscall;
  };

  React.useEffect(() => {
    getNews();
  }, []);

  console.log("news", news);
  console.log("news.0", news[0]);

  return <CarouBody news={news} />;
}

export default News;
