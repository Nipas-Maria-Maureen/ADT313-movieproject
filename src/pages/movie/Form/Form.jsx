import axios from "axios";
import "./Form.css";
import { useCallback, useEffect, useState } from "react";
import { useParams, useNavigate } from "react-router-dom";
const Form = () => {
  const [query, setQuery] = useState("");
  const [searchedMovieList, setSearchedMovieList] = useState([]);
  const [selectedMovie, setSelectedMovie] = useState(undefined);
  const [movie, setMovie] = useState(undefined);
  const [currentPage, setCurrentPage] = useState(1);
  const [totalPages, setTotalPages] = useState(0);
  const [formData, setFormData] = useState({
    title: "",
    overview: "",
    popularity: "",
    releaseDate: "",
    voteAverage: "",
  });
  const [error, setError] = useState("");
  const [isLoading, setIsLoading] = useState(false);
  const [cast, setCast] = useState([]);
  const [photos, setPhotos] = useState([]);
  const [videos, setVideos] = useState([]);
  let { movieId } = useParams();
  const navigate = useNavigate();
  const handleSearch = useCallback(() => {
    setError("");
    if (!query) {
      setError("Please enter a search term");
      return;
    }
    setIsLoading(true);
    setSearchedMovieList([]);
    axios({
      method: "get",
      url: `https://api.themoviedb.org/3/search/movie?query=${query}&include_adult=false&language=enUS&page=${currentPage}`,
      headers: {
        Accept: "application/json",
        Authorization:
          "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2Q4YTQwMGVlMzFkMzQ4MGYzNjdlMjk2OGMzODhhZSIsIm5iZiI6MTczMzE1MTAyNS4yNTQwMDAyLCJzdWIiOiI2NzRkYzkzMTc0NzM3NzhiYmQ5YWY3YzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4wKA26LOjYKY3fGsk-zmp0YOvGr7YPfi_IWUf6W7MSE", // Replace with your actual API key
      },
    })
      .then((response) => {
        if (response.data.results.length === 0) {
          setError("No movies found matching your search");
        } else {
          setSearchedMovieList(response.data.results);
          setTotalPages(response.data.total_pages);
        }
      })
      .catch(() => {
        setError(
          "Unable to search movies at this time. Please try again later."
        );
      })
      .finally(() => {
        setIsLoading(false);
      });
  }, [query, currentPage]);
  useEffect(() => {
    if (currentPage > 1) {
      handleSearch();
    }
  }, [currentPage, handleSearch]);
  const handleSelectMovie = (movie) => {
    setSelectedMovie(movie);
    setFormData({
      title: movie.original_title,
      overview: movie.overview,
      popularity: movie.popularity,
      releaseDate: movie.release_date,
      voteAverage: movie.vote_average,
    });
    setError("");
    fetchMovieDetails(movie.id);
  };
  const fetchMovieDetails = (movieId) => {
    setIsLoading(true);
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}/credits`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2Q4YTQwMGVlMzFkMzQ4MGYzNjdlMjk2OGMzODhhZSIsIm5iZiI6MTczMzE1MTAyNS4yNTQwMDAyLCJzdWIiOiI2NzRkYzkzMTc0NzM3NzhiYmQ5YWY3YzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4wKA26LOjYKY3fGsk-zmp0YOvGr7YPfi_IWUf6W7MSE",
        },
      })
      .then((response) => setCast(response.data.cast))
      .catch((error) => console.error("Error fetching cast and crew", error));
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}/images`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2Q4YTQwMGVlMzFkMzQ4MGYzNjdlMjk2OGMzODhhZSIsIm5iZiI6MTczMzE1MTAyNS4yNTQwMDAyLCJzdWIiOiI2NzRkYzkzMTc0NzM3NzhiYmQ5YWY3YzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4wKA26LOjYKY3fGsk-zmp0YOvGr7YPfi_IWUf6W7MSE",
        },
      })
      .then((response) => setPhotos(response.data.backdrops))
      .catch((error) => console.error("Error fetching photos", error));
    axios
      .get(`https://api.themoviedb.org/3/movie/${movieId}/videos`, {
        headers: {
          Authorization:
            "Bearer eyJhbGciOiJIUzI1NiJ9.eyJhdWQiOiI5M2Q4YTQwMGVlMzFkMzQ4MGYzNjdlMjk2OGMzODhhZSIsIm5iZiI6MTczMzE1MTAyNS4yNTQwMDAyLCJzdWIiOiI2NzRkYzkzMTc0NzM3NzhiYmQ5YWY3YzUiLCJzY29wZXMiOlsiYXBpX3JlYWQiXSwidmVyc2lvbiI6MX0.4wKA26LOjYKY3fGsk-zmp0YOvGr7YPfi_IWUf6W7MSE",
        },
      })
      .then((response) => setVideos(response.data.results))
      .catch((error) => console.error("Error fetching videos", error))
      .finally(() => setIsLoading(false));
  };
  useEffect(() => {
    if (movieId) {
      setIsLoading(true);
      setError("");
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          setMovie(response.data);
          const tempData = {
            id: response.data.tmdbId,
            original_title: response.data.title,
            overview: response.data.overview,
            popularity: response.data.popularity,
            poster_path: response.data.posterPath.replace(
              "https://image.tmdb.org/t/p/original/",
              ""
            ),
            release_date: response.data.releaseDate,
            vote_average: response.data.voteAverage,
          };
          setSelectedMovie(tempData);
          setFormData({
            title: response.data.title,
            overview: response.data.overview,
            popularity: response.data.popularity,
            releaseDate: response.data.releaseDate,
            voteAverage: response.data.voteAverage,
          });
          fetchMovieDetails(response.data.tmdbId);
        })
        .catch(() => {
          setError("Unable to load movie details. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [movieId]);
  const handleInputChange = (e) => {
    const { name, value } = e.target;
    setFormData((prevData) => ({
      ...prevData,
      [name]: value,
    }));
  };
  const handleCastChange = (index, field, value) => {
    const updatedCast = [...cast];
    updatedCast[index][field] = value;
    setCast(updatedCast);
  };
  const handleKeyPress = (e) => {
    if (e.key === "Enter") {
      e.preventDefault();
      setCurrentPage(1);
      handleSearch();
    }
  };
  const validateForm = () => {
    const errors = [];
    if (!formData.title) errors.push("Title is required");
    if (!formData.overview) errors.push("Overview is required");
    if (!formData.releaseDate) errors.push("Release date is required");
    if (!formData.popularity) errors.push("Popularity is required");
    if (!formData.voteAverage) errors.push("Vote average is required");
    if (!selectedMovie)
      errors.push("Please select a movie from search results");
    return errors;
  };

  const handleSave = async () => {
    const validationErrors = validateForm();
    if (validationErrors.length > 0) {
      setError(validationErrors.join(", "));
      return;
    }
  
    setIsLoading(true);
    setError("");
  
    const accessToken = localStorage.getItem("accessToken");
    if (!accessToken) {
      setError("You must be logged in to perform this action");
      setIsLoading(false);
      return;
    }
  
    try {
      // Step 1: Save Movie Details
      const moviePayload = {
        tmdbId: selectedMovie.id,
        title: formData.title,
        overview: formData.overview,
        popularity: parseFloat(formData.popularity),
        releaseDate: formData.releaseDate,
        voteAverage: parseFloat(formData.voteAverage),
        backdropPath: `https://image.tmdb.org/t/p/original/${selectedMovie.backdrop_path}`,
        posterPath: `https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`,
        isFeatured: 0,
      };
  
      const movieResponse = await axios({
        method: movieId ? "patch" : "post",
        url: movieId ? `/movies/${movieId}` : "/movies",
        data: moviePayload,
        headers: { Authorization: `Bearer ${accessToken}` },
      });
  
      const createdMovieId = movieResponse.data.id || movieId;

      // Step 2: Save Cast Data | alr working
      if (cast.length > 0) {
        for (let castMember of cast) {
          const castWithMovieId = {
            movieId: createdMovieId,
            name: castMember.name,
            url: `https://image.tmdb.org/t/p/original${castMember.profile_path}`,
            characterName: castMember.character,
          };
            
          try {
            await axios({
              method: "post",
              url: `/casts`,
              data: castWithMovieId, 
              headers: { Authorization: `Bearer ${accessToken}` },
            });
          } catch (error) {
            console.error("Error posting cast member:", error);
          }
        }
      }
      
  
      // Step 3: Upload Photos | alr working
      if (photos.length > 0) {
        let photoCount = 1
        for (let photo of photos) {
          const photosWithMovieId = {
            movieId: createdMovieId, 
            url: `https://image.tmdb.org/t/p/original${photo.file_path}`, 
            description: `Photo ${photoCount++} of movieId ${createdMovieId}`,
          };
            
          try {
            await axios({
              method: "post",
              url: `/photos`,
              data: photosWithMovieId, 
              headers: { Authorization: `Bearer ${accessToken}` },
            });
          } catch (error) {
            console.error("Error posting cast member:", error);
          }
        }
      }    
  
      // Step 4: Upload Videos
      console.log(videos)
      if (videos.length > 0) {
          for (let video of videos) {
            const videosWithMovieId = {
              movieId: createdMovieId, 
              url: 'https://www.youtube.com/embed/'+video.key,
              name: video.name,
              site: video.site,
              videoKey: video.key,
              videoType: video.type,
              official: video.official
            };
                
            try {
              await axios({
                method: "post",
                url: `/videos`,
                data: videosWithMovieId, 
                headers: { Authorization: `Bearer ${accessToken}` },
              });
            } catch (error) {
              console.error("Error posting cast member:", error);
            }
          }
        } 

      navigate("/main/movies");
    } catch (error) {
      console.error("Error saving movie:", error.response?.data || error.message);
      setError("An error occurred while saving the movie details.");
    } finally {
      setIsLoading(false);
    }
  };
  

  const handleUpdate = handleSave;
  useEffect(() => {
    if (movieId) {
      setIsLoading(true);
      setError("");
      axios
        .get(`/movies/${movieId}`)
        .then((response) => {
          const movieData = response.data;
          setSelectedMovie({
            id: movieData.tmdbId,
            original_title: movieData.title,
            overview: movieData.overview,
            popularity: movieData.popularity,
            poster_path: movieData.posterPath.replace(
              "https://image.tmdb.org/t/p/original/",
              ""
            ),
            release_date: movieData.releaseDate,
            vote_average: movieData.voteAverage,
          });
          setFormData({
            title: movieData.title,
            overview: movieData.overview,
            popularity: movieData.popularity,
            releaseDate: movieData.releaseDate,
            voteAverage: movieData.voteAverage,
            videos: movieData.videos || [],
            cast: movieData.cast || [],
          });
        })
        .catch(() => {
          setError("Unable to load movie details. Please try again later.");
        })
        .finally(() => {
          setIsLoading(false);
        });
    }
  }, [movieId]);
  const [activeTab, setActiveTab] = useState("Videos");
  return (
    <>
    <div className="form-container">
      <h1>{movieId !== undefined ? "Edit" : "Create"} Movie</h1>
      {error && <div className="error-message">{error}</div>}
      {isLoading && <div className="loading-message">Loading...</div>}
      {movieId === undefined && (
        <>
          <div className="search-container">
            <div className="search-box">
              Search Movie:{" "}
              <input
                type="text"
                value={query}
                onChange={(e) => {
                  setQuery(e.target.value);
                  setError("");
                  <div className="search-container">
                    <label htmlFor="movie-search" className="search-label">
                      Search Movie:
                    </label>
                    <div className="search-input-container">
                      <input
                        id="movie-search"
                        type="text"
                        value={query}
                        onChange={(e) => {
                          setQuery(e.target.value);
                          setError("");
                        }}
                        onKeyPress={handleKeyPress}
                        placeholder="Enter movie title..."
                        disabled={isLoading}
                        className="search-input"
                      />
                      {/* <button
                        className="search-button"
                        type="button"
                        onClick={() => {
                          setCurrentPage(1);
                          handleSearch();
                        }}
                        disabled={isLoading || !query.trim()}
                      >
                        {isLoading ? "Searching..." : "Search"}
                      </button> */}
                    </div>
                  </div>;
                }}
                onKeyPress={handleKeyPress}
                placeholder="Enter movie title..."
                disabled={isLoading}
              />
            </div>
            <button
              className="search-button"
              type="button"
              onClick={() => {
                setCurrentPage(1);
                handleSearch();
              }}
              disabled={isLoading || !query.trim()}
            >
              {isLoading ? "Searching..." : "Search"}
            </button>
            
          </div>
          <div className="searched-movie">
              {searchedMovieList.map((movie) => (
                <p
                  key={movie.id}
                  onClick={() => handleSelectMovie(movie)}
                  className={selectedMovie?.id === movie.id ? "selected" : ""}
                >
                  {movie.original_title}
                </p>
              ))}
            </div>
            {totalPages > 1 && (
              <div className="pagination">
                <button
                  className="pagination-button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.max(1, prev - 1))
                  }
                  disabled={currentPage === 1 || isLoading}
                >
                  Previous
                </button>
                <span>
                  Page {currentPage} of {totalPages}
                </span>
                <button
                  className="pagination-button"
                  onClick={() =>
                    setCurrentPage((prev) => Math.min(totalPages, prev + 1))
                  }
                  disabled={currentPage === totalPages || isLoading}
                >
                  Next
                </button>
              </div>
            )}
          <hr />
        </>
      )}
      <div className="form-container">
        <form onSubmit={(e) => e.preventDefault()}>
          {selectedMovie && (
            <div className="movie-details">
              <div className="form-fields">
                <img
                  className="poster-image"
                  src={`https://image.tmdb.org/t/p/original/${selectedMovie.poster_path}`}
                  alt={formData.title}
                />
                <div class="field-group">
                  <div className="field">
                    <label htmlFor="title">Title:</label>
                    <input
                      type="text"
                      name="title"
                      id="title"
                      value={formData.title}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="overview">Overview:</label>
                    <textarea
                      className="overview"
                      rows={10}
                      name="overview"
                      id="overview"
                      value={formData.overview}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="popularity">Popularity:</label>
                    <input
                      type="number"
                      name="popularity"
                      id="popularity"
                      value={formData.popularity}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      step="0.1"
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="releaseDate">Release Date:</label>
                    <input
                      type="date"
                      name="releaseDate"
                      id="releaseDate"
                      value={formData.releaseDate}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      required
                    />
                  </div>
                  <div className="field">
                    <label htmlFor="voteAverage">Vote Average:</label>
                    <input
                      type="number"
                      name="voteAverage"
                      id="voteAverage"
                      value={formData.voteAverage}
                      onChange={handleInputChange}
                      disabled={isLoading}
                      step="0.1"
                    />
                  </div>
                </div>
              </div>
            </div>
          )}
           {selectedMovie && (
        <div className="tabs-container">
          {/* Tab Buttons */}
          <div className="tabs">
            <button
              className={`tab-button ${activeTab === "Videos" ? "active" : ""}`}
              onClick={() => setActiveTab("Videos")}
            >
              Videos
            </button>
            <button
              className={`tab-button ${activeTab === "Photos" ? "active" : ""}`}
              onClick={() => setActiveTab("Photos")}
            >
              Photos
            </button>
            <button
              className={`tab-button ${activeTab === "Cast" ? "active" : ""}`}
              onClick={() => setActiveTab("Cast")}
            >
              Cast
            </button>
          </div>

          {/* Tab Content */}
          <div className="tab-content">
            {activeTab === "Videos" && (
              <div className="">
                <div className="videos">
                {videos.length > 0 ? (
                  videos.map((video) => (
                    <div key={video.id} className="video-item">
                      <iframe
                        src={`https://www.youtube.com/embed/${video.key}`}
                        title={video.name}
                        frameBorder="0"
                        allowFullScreen
                      ></iframe>
                    </div>
                  ))
                ) : (
                  <p>No videos available.</p>
                )}
              </div>
              </div>
            )}

            {activeTab === "Photos" && (
              <div className="photo-gallery">
                <div className="photo-grid">
                  {photos.slice(0, 12).map((photo) => (
                    <img
                      key={photo.file_path}
                      src={`https://image.tmdb.org/t/p/original${photo.file_path}`}
                      alt="Movie Photo"
                      className="photo-item"
                    />
                  ))}
                </div>
              </div>
            )}

            {activeTab === "Cast" && (
              <div className="">
                <div className="cast">
                {cast.length > 0 ? (
                  cast.map((member) => (
                    <div key={member.id} className="cast-item">
                      <div className="cast-image-container">
                        <img
                          src={
                            member.profile_path
                              ? `https://image.tmdb.org/t/p/w500/${member.profile_path}`
                              : "/cast-placeholder.jpg"
                          }
                          alt={member.name}
                          className="cast-image"
                        />
                      </div>
                      <h3>{member.name}</h3>
                      <p>Character: {member.character}</p>
                    </div>
                  ))
                ) : (
                  <p>No cast information available.</p>
                )}
              </div>
              </div>
            )}
          </div>
        </div>
      )}
          <div className="button-container">
            <button
              className="btn-save btn-primary"
              type="button"
              onClick={movieId ? handleUpdate : handleSave}
              disabled={isLoading}
            >
              {isLoading ? "Saving..." : "Save"}
            </button>
            <button
              className="cancel"
              type="button"
              onClick={() => navigate("/main/movies")}
              disabled={isLoading}
            >
              Cancel
            </button>
          </div>
        </form>
      </div>
      </div>
    </>
  );
};
export default Form;
