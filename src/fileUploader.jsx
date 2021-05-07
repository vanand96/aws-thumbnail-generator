import React, { Component } from "react";
import { Modal, Form, Container, Button, ButtonToolbar } from "react-bootstrap";
import axios from "axios";

class Fileuploader extends Component {
  constructor(props) {
    super(props);
    this.state = {
      selectedFile: null,
      loaded: 0,
      setLoading: this.props.setLoading,
      setImageurl: this.props.setImageurl,
      setThumbnailurl: this.props.setThumbnailurl,
    };
  }

  render() {
    return (
      <Container fluid className="offset-md-3 col-md-6">
        <Form name="imageUploader">
          <h1 className="text-center">Thumbnail Generator</h1>
          <p>{"\n"}</p>
          <input
            type="file"
            id="file"
            name="file"
            onChange={this.onChangeHandler}
          />
        </Form>
        <Modal.Footer>
          <ButtonToolbar>
            <Button
              variant="primary"
              onClick={() =>
                this.handleSubmit(
                  this.props.setLoading,
                  this.props.setImageurl,
                  this.props.setThumbnailurl
                )
              }
            >
              Submit
            </Button>
            &nbsp;&nbsp;&nbsp;
            <Button variant="secondary" onClick={this.clearForm}>
              Clear
            </Button>
          </ButtonToolbar>
        </Modal.Footer>
      </Container>
    );
  }

  onChangeHandler = (event) => {
    if (this.checkMimeType(event) && this.checkFileSize(event)) {
      this.setState({
        selectedFile: event.target.files[0],
        fileName: event.target.files[0].name,
        fileType: event.target.files[0].name.split(".")[1],
        loaded: 0,
      });
      const file = event.target.files[0];
      const reader = new FileReader();
      reader.onloadend = () => {
        // use a regex to remove data url part
        const base64String = reader.result
          .replace("data:", "")
          .replace(/^.+,/, "");

        this.setState({ selectedFile: base64String });
        // setContent(base64String);
      };
      reader.readAsDataURL(file);
    }
  };

  uploadApi = async (setLoading, setImageurl, setThumbnailurl) => {
    try {
      const api =
        process.env.REACT_APP_API_ENDPOINT +
        "?imageType=" +
        this.state.fileType;

      axios
        .post(api, this.state.selectedFile)
        .then((response) => {
          setImageurl(response.data.imageUrl);
          console.log(response);
          this.getThumbnailAPI(
            response.data.thumbnailUrl,
            setLoading,
            setThumbnailurl
          );
        })
        .catch((error) => {
          console.log(error);
        });
    } catch (e) {
      console.log(e);
    }
  };

  getThumbnailAPI = async (awsthumbnailUrl, setLoading, setThumbnailurl) => {
    setTimeout(function () {
      try {
        axios.get(awsthumbnailUrl).then((response) => {
          console.log(response);
          setThumbnailurl(awsthumbnailUrl);
        });
        setLoading(false);
      } catch (e) {
        console.log(e);
      }
    }, 15000);
  };

  async handleSubmit(setLoading, setImageurl, setThumbnailurl) {
    setLoading(true);
    this.uploadApi(setLoading, setImageurl, setThumbnailurl);
  }

  async clearForm(e) {
    const form = document.forms.imageUploader;
    form.file.value = "";
  }

  checkMimeType = (event) => {
    let file = event.target.files[0];
    let err = "";

    const types = ["image/png", "image/jpeg", "image/gif"];
    if (types.every((type) => file.type !== type)) {
      err = file.type + " is not a supported format\n";
    }

    if (err !== "") {
      // if message not same old that mean has error
      event.target.value = null; // discard selected file
      console.log(err);
      return false;
    }
    return true;
  };

  checkFileSize = (event) => {
    let file = event.target.files[0];
    let size = 5242880;
    let err = "";
    if (file.size > size) {
      err = file.type + "is too large, please pick a smaller file\n";
    }
    if (err !== "") {
      event.target.value = null;
      console.log(err);
      return false;
    }
    return true;
  };
}

export default Fileuploader;
