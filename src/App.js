import './App.css';
import React, { useEffect, useState } from "react";
import InfiniteScroll from "react-infinite-scroll-component";
import Masonry, { ResponsiveMasonry } from "react-responsive-masonry"


export default function App() {

  const key = process.env.REACT_APP_UNSPLASH_ACCESS_KEY;
  const [images, setImages] = useState([]);
  const [page, setPage] = useState(1);
  const [query, setQuery] = useState("");
  const [error, setError] = useState(false);

  useEffect(() => {
    getImages()
  }, [page])

  const handleSearch = (e) => {
    setQuery(e.target.value)
  }

  function getImages() {
    let apiUrl = `https://api.unsplash.com/photos?`;
    if (query) apiUrl = `https://api.unsplash.com/search/photos?query=${query}`;
    apiUrl += `&page=${page}`;
    apiUrl += `&client_id=${key}`;

    fetch(apiUrl)
      .then((res) => res.json())
      .then((data) => {
        console.log(data)
        const imagesApi = data.results ?? data;
        if (imagesApi.length === 0) {
          setError(true);
          return
        }
        if (page === 1) {
          setImages(imagesApi);
          setError(false);
          return
        }
        setImages((images) => [...images, ...imagesApi]);
        setError(false);
      });
  }

  const handleSubmit = (e) => {
    e.preventDefault();
    getImages();
    setPage(1);
  }

  const addMoreImages = () => {
    setPage((prev) => prev + 1);
  }

  if (!key) {
    return (
      <a href="https://unsplash.com/developers"
        className="error"
      >
        Required: Get Your Unsplash API Key
      </a>
    )
  }

  return (
    <div className="app">
      <h3>Unsplash Image Gallery</h3>
      <form onSubmit={handleSubmit}>
        <input
          type="text"
          placeholder="Search Unsplash..."
          value={query}
          onChange={handleSearch}
        />
        <button>Search</button>
      </form>
      {error ? (
        <h3 className="search-error">No images matched your search criteria, try something else</h3>
      ) : (<InfiniteScroll
        dataLength={images.length}
        next={addMoreImages}
        hasMore={true}
        loader={<h4>Loading...</h4>}
      >
        <ResponsiveMasonry
          columnsCountBreakPoints={{ 350: 2, 750: 2, 900: 3 }}
        >
          <Masonry gutter="10px">
            {images.map((image, index) => (
              <a
                className="image"
                key={index}
                href={image.links.html}
                target="_blank"
                rel="noopener noreferrer"
              >
                <div>
                  <div  className="card">
                    <h5>Credit to:</h5>
                    <h5 className="user-name">{image.user.name}</h5>
                  </div>
                  <img
                    src={image.urls.regular}
                    alt={image.alt_description}
                  />
                </div>
              </a>
            ))}
          </Masonry>
        </ResponsiveMasonry>
      </InfiniteScroll>)}
    </div>
  );
}
