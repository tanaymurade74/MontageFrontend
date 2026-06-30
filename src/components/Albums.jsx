import { useState, useEffect } from "react";
import { useNavigate } from "react-router-dom";
import axios from "axios";
import { toast } from "react-toastify";

const COVERS = [
  "text-bg-primary",
  "text-bg-success",
  "text-bg-danger",
  "text-bg-warning",
  "text-bg-info",
  "text-bg-dark",
  "text-bg-secondary",
];

const pickCover = (id = "") => {
  let hash = 0;
  for (let i = 0; i < id.length; i++) {
    hash = id.charCodeAt(i) + ((hash << 5) - hash);
  }
  return COVERS[Math.abs(hash) % COVERS.length];
};

const Albums = () => {
  const navigate = useNavigate();

  const [albumList, setAlbumList] = useState([]);
  const [view, setView] = useState("created");

  const [showModal, setShowModal] = useState(false);
  const [name, setName] = useState("");
  const [description, setDescription] = useState("");

  const [editAlbum, setEditAlbum] = useState(null);
  const [editDescription, setEditDescription] = useState("");

  const [shareAlbum, setShareAlbum] = useState(null);
  const [shareEmail, setShareEmail] = useState("");

  const getCreatedAlbums = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/albums`, { withCredentials: true });
      setAlbumList(res.data);
      setView("created");
    } catch (error) {
      console.error(error);
    }
  };

  const getSharedAlbums = async () => {
    try {
      const res = await axios.get(`${process.env.REACT_APP_API_URL}/albums/shared`, {
        withCredentials: true,
      });
      setAlbumList(res.data);
      setView("shared");
    } catch (error) {
      console.error(error);
    }
  };

  const handleCreateAlbum = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/album`,
        { name, description },
        { withCredentials: true },
      );
      setName("");
      setDescription("");
      setShowModal(false);
      getCreatedAlbums();
      toast.success(`Album ${name} created successfully!!`)
    } catch (error) {
      console.error(error);
    }
  };

  const handleDeleteAlbum = async (albumId) => {
    try {
      await axios.delete(`${process.env.REACT_APP_API_URL}/albums/${albumId}`, { withCredentials: true });
      setAlbumList(albumList.filter((album) => album._id !== albumId));
      toast.info(`Album deleted`)
    } catch (error) {
      alert(error.response?.data?.error || "Error while deleting the album");
    }
  };

  const openEdit = (album) => {
    setEditAlbum(album);
    setEditDescription(album.description || "");
  };

  const handleEditAlbum = async (e) => {
    e.preventDefault();
    try {
      const res = await axios.patch(
        `${process.env.REACT_APP_API_URL}/albums/${editAlbum._id}`,
        { description: editDescription },
        { withCredentials: true },
      );
      setAlbumList(
        albumList.map((a) => (a._id === editAlbum._id ? res.data : a)),
      );
      setEditAlbum(null);
    } catch (error) {
      alert(error.response?.data?.error || "Failed to update album");
    }
  };

  const openShare = (album) => {
    setShareAlbum(album);
    setShareEmail("");
  };

  const handleShareAlbum = async (e) => {
    e.preventDefault();
    try {
      await axios.post(
        `${process.env.REACT_APP_API_URL}/albums/${shareAlbum._id}/share`,
        { emails: [shareEmail] },
        { withCredentials: true },
      );
      setShareAlbum(null);
      getCreatedAlbums();
      toast.success(`Album shared with ${shareEmail}`)
    } catch (error) {
      alert(error.response?.data?.error || "Failed to share album");
    }
  };

  const handleLogOut = async () => {
    try {
      const response = await axios.post(`${process.env.REACT_APP_API_URL}/auth/logout`, {
        withCredentials: true,
      });
      if (response) {
        navigate(`/`);
      }
    } catch (error) {
      console.log(error);
    }
  };

  useEffect(() => {
    getCreatedAlbums();
  }, []);

  return (
    <div className="bg-light min-vh-100 py-5">
      <div className="container">
        <h2 className="text-success mb-4 fs-4 fs-md-2">Welcome to Montage</h2>
        <div className="d-flex flex-column flex-sm-row justify-content-between align-items-stretch align-items-sm-center gap-3 mb-4">
          <h1 className="fw-bold mb-0 fs-3 fs-md-1">Albums</h1>
          <div className="d-flex gap-2">
            {view === "created" && (
              <button
                className="btn btn-primary flex-fill flex-sm-grow-0"
                onClick={() => setShowModal(true)}
              >
                + New Album
              </button>
            )}
            <button
              className="btn btn-outline-danger flex-fill flex-sm-grow-0"
              onClick={handleLogOut}
            >
              LogOut
            </button>
          </div>
        </div>

        <div className="btn-group mb-4" role="group">
          <button
            className={`btn ${view === "created" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={getCreatedAlbums}
          >
            Created
          </button>
          <button
            className={`btn ${view === "shared" ? "btn-dark" : "btn-outline-dark"}`}
            onClick={getSharedAlbums}
          >
            Shared
          </button>
        </div>

        {albumList.length === 0 ? (
          <div className="text-center text-secondary py-5">
            <p className="mb-0">
              {view === "shared"
                ? "No albums have been shared with you yet."
                : "You haven't created any albums yet."}
            </p>
          </div>
        ) : (
          <div className="row g-4">
            {albumList.map((album) => (
              <div className="col-12 col-sm-6 col-lg-4" key={album._id}>
                <div
                  className="card border-0 shadow-sm h-100 overflow-hidden"
                  role="button"
                  onClick={() => navigate(`/album/${album._id}`)}
                >
                  <div className="ratio ratio-21x9">
                    <div
                      className={`${pickCover(album._id)} d-flex align-items-center justify-content-center`}
                    >
                      <span className="display-4 fw-bold">
                        {(album.name || "?").charAt(0).toUpperCase()}
                      </span>
                    </div>
                    {view === "created" && (
                      <div className="position-absolute top-0 start-0 w-100 d-flex justify-content-start gap-2 p-2">
                        <button
                          className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center border-0"
                          style={{
                            width: "34px",
                            height: "34px",
                            backgroundColor: "rgba(0,0,0,0.5)",
                          }}
                          title="Edit"
                          onClick={(e) => {
                            e.stopPropagation();
                            openEdit(album);
                          }}
                        >
                          <i className="bi bi-pencil-fill text-white"></i>
                        </button>
                        <button
                          className="btn btn-sm rounded-circle d-flex align-items-center justify-content-center border-0"
                          style={{
                            width: "34px",
                            height: "34px",
                            backgroundColor: "rgba(0,0,0,0.5)",
                          }}
                          title="Share"
                          onClick={(e) => {
                            e.stopPropagation();
                            openShare(album);
                          }}
                        >
                          <i className="bi bi-share-fill text-white"></i>
                        </button>
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
                            handleDeleteAlbum(album._id);
                          }}
                        >
                          <i className="bi bi-trash-fill text-white"></i>
                        </button>
                      </div>
                    )}
                  </div>

                  <div className="card-body">
                    <h5 className="card-title fw-bold mb-1">{album.name}</h5>
                    {album.description && (
                      <p className="card-text text-secondary small mb-2">
                        {album.description}
                      </p>
                    )}
                    {album.sharedWith && album.sharedWith.length > 0 && (
                      <span className="badge rounded-pill text-bg-light">
                        Shared with {album.sharedWith.length}
                      </span>
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
                  <h5 className="modal-title">New Album</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShowModal(false)}
                  ></button>
                </div>
                <form onSubmit={handleCreateAlbum}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Name</label>
                      <input
                        className="form-control"
                        value={name}
                        onChange={(e) => setName(e.target.value)}
                        placeholder="e.g. City Lights"
                        required
                      />
                    </div>
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={description}
                        onChange={(e) => setDescription(e.target.value)}
                        placeholder="A short note about this album"
                      ></textarea>
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
                    <button type="submit" className="btn btn-primary">
                      Create Album
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Edit modal */}
      {editAlbum && (
        <>
          <div
            className="modal d-block"
            tabIndex="-1"
            onClick={() => setEditAlbum(null)}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Edit “{editAlbum.name}”</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setEditAlbum(null)}
                  ></button>
                </div>
                <form onSubmit={handleEditAlbum}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Description</label>
                      <textarea
                        className="form-control"
                        rows="3"
                        value={editDescription}
                        onChange={(e) => setEditDescription(e.target.value)}
                      ></textarea>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setEditAlbum(null)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Save
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}

      {/* Share modal */}
      {shareAlbum && (
        <>
          <div
            className="modal d-block"
            tabIndex="-1"
            onClick={() => setShareAlbum(null)}
          >
            <div
              className="modal-dialog modal-dialog-centered"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="modal-content">
                <div className="modal-header">
                  <h5 className="modal-title">Share “{shareAlbum.name}”</h5>
                  <button
                    type="button"
                    className="btn-close"
                    onClick={() => setShareAlbum(null)}
                  ></button>
                </div>
                <form onSubmit={handleShareAlbum}>
                  <div className="modal-body">
                    <div className="mb-3">
                      <label className="form-label">Share with email</label>
                      <input
                        type="email"
                        className="form-control"
                        value={shareEmail}
                        onChange={(e) => setShareEmail(e.target.value)}
                        placeholder="friend@example.com"
                        required
                      />
                      <div className="form-text">
                        The person must have signed in to Montage at least once.
                      </div>
                    </div>
                  </div>
                  <div className="modal-footer">
                    <button
                      type="button"
                      className="btn btn-outline-secondary"
                      onClick={() => setShareAlbum(null)}
                    >
                      Cancel
                    </button>
                    <button type="submit" className="btn btn-primary">
                      Share
                    </button>
                  </div>
                </form>
              </div>
            </div>
          </div>
          <div className="modal-backdrop fade show"></div>
        </>
      )}
    </div>
  );
};

export default Albums;
