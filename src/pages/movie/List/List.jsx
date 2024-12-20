import { useNavigate } from "react-router-dom";
import "./List.css";
import { useEffect, useState } from "react";
import axios from "axios";

const Lists = () => {
  const accessToken = localStorage.getItem("accessToken");
  const navigate = useNavigate();
  const [lists, setLists] = useState([]);

  const getMovies = () => {
    axios.get("/movies").then((response) => {
      setLists(response.data);
    });
  };

  useEffect(() => {
    getMovies();
  }, []);

  const handleDelete = (id) => {
    const isConfirm = window.confirm(
      "Are you sure you want to delete this data?"
    );
    if (isConfirm) {
      axios
        .delete(`/movies/${id}`, {
          headers: {
            Authorization: `Bearer ${accessToken}`,
          },
        })
        .then(() => {
          setLists((prevLists) => prevLists.filter((movie) => movie.id !== id));
          alert("Movie deleted successfully!");
        })
        .catch((error) => {
          console.error("Error deleting movie:", error);
          alert("Failed to delete the movie. Please try again.");
        });
    }
  };

  return (
    <div className="lists-container">
      <div className="create-container">
        <button
          className="create"
          type="button"
          onClick={() => navigate("/main/movies/form")}
        >
          Create New
        </button>
      </div>
      <div className="table-container">
        <table className="movie-lists">
          <thead>
            <tr>
              <th>ID</th>
              <th>Title</th>
              <th>Actions</th>
            </tr>
          </thead>
          <tbody>
            {lists.map((movie) => (
              <tr key={movie.id}>
                <td className="id-cell">{movie.id}</td>
                <td className="title-cell"><img src={movie.posterPath} alt="Movie Poster" className="movie-poster" />{movie.title}</td>
                <td className="action-cell">
                  <button
                    className="edit"
                    type="button"
                    onClick={() => navigate(`/main/movies/form/${movie.id}`)}
                  >
                    Edit
                  </button>
                  <button
                    className="delete"
                    type="button"
                    onClick={() => handleDelete(movie.id)}
                  >
                    Delete
                  </button>
                </td>
              </tr>
            ))}
          </tbody>
        </table>
      </div>
    </div>
  );
};

export default Lists;
