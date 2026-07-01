import { useEffect, useState } from "react";
import { useParams, Link } from "react-router-dom";
import { toast } from "react-toastify";
import axios from "axios";


const AlbumDetail = () => {
  const { albumId } = useParams();

  const [albumDetail, setAlbumDetail] = useState(null);
  const [images, setImages] = useState([]);
  const [showFavorites, setShowFavorites] = useState(false);
  const [showModal, setShowModal] = useState(false);

  const [file, setFile] = useState(null);
  const [tags, setTags] = useState("");
  const [person, setPerson] = useState("");
  const [isFavorite, setIsFavorite] = useState(false);
  const [uploading, setUploading] = useState(false);
  const [userId, setUserId] = useState("");
  const [tagFilter, setTagFilter] = useState("");

  const [selectedImage, setSelectedImage] = useState(null);
  const [panel, setPanel] = useState(null);
  const [commentText, setCommentText] = useState("");

  const getAlbum = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/albums/${albumId}`, {
        withCredentials: true,
      });
      setAlbumDetail(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  const getImages = async () => {
    try {
      let url = showFavorites
        ? `${process.env.REACT_APP_API_URL}/albums/${albumId}/images/favorites`
        : `${process.env.REACT_APP_API_URL}/albums/${albumId}/images`;
      if (tagFilter.trim() !== "") {
        url += `?tags=${encodeURIComponent(tagFilter.trim())}`;
      }
      const res = await axios.get(url, { withCredentials: true });
      setImages(res.data);
    } catch (error) {
      console.error(error);
    }
  };

  useEffect(() => {
    getAlbum();
  }, [albumId]);

  useEffect(() => {
    getImages();
  }, [albumId, showFavorites, tagFilter]);

  useEffect(() => {
    getMe();
  }, []);

  const getMe = async () => {
    try {
      const response = await axios.get(`${process.env.REACT_APP_API_URL}/auth/me`, {
        withCredentials: true,
      });
      if (response) {
        setUserId(response.data?.userId);
      }
    } catch (error) {
      console.log(error);
    }
  };

  const handleUpload = async (e) => {
    e.preventDefault();
    if (!file) return;

    const formData = new FormData();
    formData.append("image", file);
    formData.append("tags", tags);
    formData.append("person", person);
    formData.append("isFavorite", isFavorite);

    try {
      setUploading(true);
      await axios.post(`${process.env.REACT_APP_API_URL}/albums/${albumId}/images`, formData, {
        withCredentials: true,
        headers: { "Content-Type": "multipart/form-data" },
      });
      setFile(null);
      setTags("");
      setPerson("");
      setIsFavorite(false);
      setShowModal(false);
      getImages();
      toast.success("Image uploaded");
    } catch (error) {
      toast.error(error.response?.data?.message || "Upload failed");
    } finally {
      setUploading(false);
    }
  };

  const openImage = (image) => {
    setSelectedImage(image);
    setPanel(null);
    setCommentText("");
  };

  const closeImage = () => {
    setSelectedImage(null);
    setPanel(null);
  };

  const handleDeleteImage = async (imageId) => {
    try {
      const response = await axios.delete(
        `${process.env.REACT_APP_API_URL}/albums/${albumId}/images/${imageId}`,
        { withCredentials: true },
      );
      if (response) {
        setImages(images.filter((img) => img._id !== imageId));
        if (selectedImage && selectedImage._id === imageId) closeImage();
      }
      toast.info("Image deleted")
    } catch (error) {
      console.log(error);
      toast.error("Error while trying to delete image");
    }
  };

  const handleComment = async (e) => {
    e.preventDefault();
    try {
      const response = await axios.post(
        `${process.env.REACT_APP_API_URL}/albums/${albumId}/images/${selectedImage._id}/comments`,
        { comment: commentText },
        { withCredentials: true },
      );
      if (response) {
        setSelectedImage(response.data);
        setCommentText("");
        setPanel(null);
      }
      toast.success("Comment added")
    } catch (error) {
      console.log(error);
      toast.error("Error while adding comment.");
    }
  };

  const toggleFavourite = async (imageId, isFavorite) => {
    try {
      const response = await axios.patch(
        `${process.env.REACT_APP_API_URL}/albums/${albumId}/images/${imageId}/favorite`,
        { isFavorite },
        { withCredentials: true },
      );
      if (response) {
        setImages(
          images.map((img) =>
            img._id === imageId
              ? { ...img, isFavorite: !img.isFavorite }
              : img,
          ),
        );
      }
    } catch (error) {
      console.log(error);
      alert("Error while toggling the favourite image");
    }
  };

  const isOwner = userId && albumDetail && userId === albumDetail.ownerId;

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <Link to="/albums" className="btn btn-link text-secondary ps-0 mb-3">
          ← Back to albums
        </Link>

        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-start align-items-sm-center gap-3 mb-4">
          <div>
            <h1 className="fw-bold mb-1 fs-3 fs-md-1">
              {albumDetail ? albumDetail.name : "Loading…"}
            </h1>
            {albumDetail && albumDetail.description && (
              <p className="text-secondary mb-0">{albumDetail.description}</p>
            )}
          </div>
          {isOwner && (
            <button
              className="btn btn-primary flex-shrink-0"
              onClick={() => setShowModal(true)}
            >
              + Upload Image
            </button>
          )}
        </div>

        <div className="d-flex flex-column flex-sm-row gap-3 mb-4 align-items-stretch align-items-sm-center">
          <div className="btn-group" role="group">
            <button
              className={`btn ${!showFavorites ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setShowFavorites(false)}
            >
              All
            </button>
            <button
              className={`btn ${showFavorites ? "btn-dark" : "btn-outline-dark"}`}
              onClick={() => setShowFavorites(true)}
            >
              Favorites
            </button>
          </div>

          <input
            className="form-control"
            style={{ maxWidth: "320px" }}
            placeholder="Filter by tag (e.g. beach)"
            value={tagFilter}
            onChange={(e) => setTagFilter(e.target.value)}
          />
        </div>

        {images.length === 0 ? (
          <div className="text-center text-secondary py-5">
            <p className="mb-0">
              {showFavorites
                ? "No favorite images yet."
                : "No images in this album yet."}
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {images.map((image) => (
              <div className="col-6 col-md-4 col-lg-3" key={image._id}>
                <div
                  className="card border-0 shadow-sm h-100"
                  role="button"
                  onClick={() => openImage(image)}
                >
                  <div className="ratio ratio-1x1">
                    <img
                      src={image.imageUrl}
                      alt={image.name}
                      style={{
                        objectFit: "cover",
                        width: "100%",
                        height: "100%",
                      }}
                      className="rounded-top"
                    />
                    <div className="img-overlay d-flex justify-content-between align-items-start p-2">
                      <button
                        className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center border-0"
                        style={{
                          width: "34px",
                          height: "34px",
                          backgroundColor: "rgba(0,0,0,0.5)",
                        }}
                        title={image.isFavorite ? "Unfavorite" : "Favorite"}
                        onClick={(e) => {
                          e.stopPropagation();
                          toggleFavourite(image._id, !image.isFavorite);
                        }}
                      >
                        <i
                          className={`bi ${image.isFavorite ? "bi-heart-fill text-danger" : "bi-heart text-white"}`}
                        ></i>
                      </button>

                      {isOwner && (
                        <button
                          className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center border-0"
                          style={{
                            width: "34px",
                            height: "34px",
                            backgroundColor: "rgba(0,0,0,0.5)",
                          }}
                          title="Delete"
                          onClick={(e) => {
                            e.stopPropagation();
                            handleDeleteImage(image._id);
                          }}
                        >
                          <i className="bi bi-trash-fill text-white"></i>
                        </button>
                      )}
                    </div>
                  </div>
                  <div className="card-body">
                    <p className="card-text small fw-semibold mb-1">
                      {image.name}
                    </p>
                    {image.person && (
                      <p className="card-text text-secondary small mb-1">
                        {image.person}
                      </p>
                    )}
                    {image.tags && image.tags.length > 0 && (
                      <div className="d-flex flex-wrap gap-1">
                        {image.tags.map((tag, i) => (
                          <span key={i} className="badge text-bg-light">
                            {tag}
                          </span>
                        ))}
                      </div>
                    )}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {showModal && (
        <>
          <div
            className="modal d-block"
            tabIndex="-1"
            onClick={() => setShowModal(false)}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Upload Image</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleUpload}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Image file</label>
                      <input
                        type="file"
                        accept="image/*"
                        className="form-control"
                        onChange={(e) => setFile(e.target.files[0])}
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">
                        Tags (comma-separated)
                      </label>
                      <input
                        className="form-control"
                        value={tags}
                        onChange={(e) => setTags(e.target.value)}
                        placeholder="beach, sunset"
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Person</label>
                      <input
                        className="form-control"
                        value={person}
                        onChange={(e) => setPerson(e.target.value)}
                        placeholder="Name of person in photo"
                      />
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShowModal(false)}
                    >
                      Cancel
                    </button>
                    <button
                      type="submit"
                      className="btn btn-primary"
                      disabled={uploading}
                    >
                      {uploading ? "Uploading…" : "Upload"}
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {selectedImage && (
        <>
          <div className="modal d-block" tabIndex="-1" onClick={closeImage}>
            <div
              className="modal-dialog modal-dialog-centered modal-lg"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">
                    {selectedImage.name}
                  </h5>
                  <button
                    type="button"
                    className="btn-close ms-auto"
                    onClick={closeImage}
                  ></button>
                </div>

                <div className="modal-body text-center p-0 bg-dark">
                  <img
                    src={selectedImage.imageUrl}
                    alt={selectedImage.name}
                    className="img-fluid"
                    style={{
                      width: "auto",
                      maxHeight: "70vh",
                      objectFit: "contain",
                    }}
                  />
                </div>

                <div
                  className="px-3 pt-3"
                  style={{ maxHeight: "220px", overflowY: "auto" }}
                >
                  <p className="fw-semibold small mb-2">
                    Comments ({selectedImage.comments?.length || 0})
                  </p>
                  {selectedImage.comments &&
                  selectedImage.comments.length > 0 ? (
                    selectedImage.comments.map((c, i) => (
                      <div key={c._id || i} className="d-flex gap-2 mb-2">
                        <div
                          className="rounded-circle bg-secondary text-white d-flex align-items-center justify-content-center flex-shrink-0"
                          style={{
                            width: "32px",
                            height: "32px",
                            fontSize: "0.8rem",
                          }}
                        >
                          {(c.author?.email || "?").charAt(0).toUpperCase()}
                        </div>
                        <div className="bg-light rounded px-3 py-2 flex-grow-1">
                          <p className="small fw-semibold mb-0">
                            {c.author?.email || "Unknown"}
                          </p>
                          <p className="small mb-0">{c.text}</p>
                          {c.createdAt && (
                            <p
                              className="text-secondary mb-0"
                              style={{ fontSize: "0.7rem" }}
                            >
                              {new Date(c.createdAt).toLocaleString()}
                            </p>
                          )}
                        </div>
                      </div>
                    ))
                  ) : (
                    <p className="text-secondary small mb-0">No comments yet.</p>
                  )}
                </div>

                {panel === "comment" && (
                  <form onSubmit={handleComment} className="p-3 border-top">
                    <label className="form-label small">Add a comment</label>
                    <div className="d-flex gap-2">
                      <input
                        className="form-control"
                        value={commentText}
                        onChange={(e) => setCommentText(e.target.value)}
                        placeholder="Say something…"
                        required
                      />
                      <button type="submit" className="btn btn-primary">
                        Post
                      </button>
                    </div>
                  </form>
                )}

                <div className="modal-footer">
                  <button
                    className={`btn ${panel === "comment" ? "btn-secondary" : "btn-outline-secondary"}`}
                    onClick={() =>
                      setPanel(panel === "comment" ? null : "comment")
                    }
                  >
                    💬 Comment
                  </button>
                </div>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default AlbumDetail;