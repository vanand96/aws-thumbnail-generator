import React, { useState } from "react";
import * as ReactBootStrap from "react-bootstrap";
import FileUploader from "./fileUploader.jsx";

const App = () => {
  const [imageurl, setImageurl] = useState(null);
  const [thumbnailurl, setThumbnailurl] = useState(null);
  const [loading, setLoading] = useState(false);

  return (
    <div className="App">
      {!loading ? (
        imageurl == null ? (
          <FileUploader
            setLoading={setLoading}
            setImageurl={setImageurl}
            setThumbnailurl={setThumbnailurl}
          />
        ) : (
          <img src={thumbnailurl} alt="thumbnail" />
        )
      ) : (
        <div className="d-flex justify-content-center">
          <h3>Running face detection algorithm...</h3>
          <ReactBootStrap.Spinner animation="border" variant="primary" />
        </div>
      )}
    </div>
  );
};

export default App;
