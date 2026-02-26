import { useEffect, useState } from "react";
import axios from "axios";
import { useNavigate } from "react-router-dom";

export default function AdminPage() {
  const [photos, setPhotos] = useState([]);
  const [file, setFile] = useState(null);
  const navigate = useNavigate();

  const fetchPhotos = async () => {
    const res = await axios.get(`${import.meta.env.VITE_API_URL}/api/photos`);
    setPhotos(res.data);
  };

  useEffect(() => {
    fetchPhotos();
  }, []);

  const uploadPhoto = async () => {
    const formData = new FormData();
    formData.append("image", file);
    await axios.post(`${import.meta.env.VITE_API_URL}/api/photos`, formData);
    fetchPhotos();
  };

  const deletePhoto = async (id) => {
    await axios.delete(`${import.meta.env.VITE_API_URL}/api/photos/${id}`);
    fetchPhotos();
  };

  return (
    <div>
      <button onClick={() => navigate("/")}>
        Back to Globe
      </button>
      <h2>Admin Panel</h2>

      <input type="file" onChange={e => setFile(e.target.files[0])} />
      <button onClick={uploadPhoto}>Upload</button>

      {photos.map(photo => (
        <div key={photo._id}>
          <img src={photo.url} width="100" />
          <button onClick={() => deletePhoto(photo._id)}>
            Delete
          </button>
        </div>
      ))}
    </div>
  );
}