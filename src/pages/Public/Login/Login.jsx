import { useState, useRef, useCallback, useEffect } from "react";
import "./Login.css";
import { useNavigate } from "react-router-dom";
import { useDebounce } from "../../util/hooks/useDebounce";
import { FontAwesomeIcon } from "@fortawesome/react-fontawesome";
import { faEye, faEyeSlash } from "@fortawesome/free-solid-svg-icons";
import axios from "axios";

function Login() {
  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [isFieldsDirty, setIsFieldsDirty] = useState(false);
  const emailRef = useRef();
  const passwordRef = useRef();
  const [isShowPassword, setIsShowPassword] = useState(false);
  const userInputDebounce = useDebounce({ email, password }, 2000);
  const [debounceState, setDebounceState] = useState(false);
  const [status, setStatus] = useState("idle");

  const navigate = useNavigate();

  const handleShowPassword = useCallback(() => {
    setIsShowPassword((value) => !value);
  }, [isShowPassword]);

  const handleOnChange = (event, type) => {
    setDebounceState(false);
    setIsFieldsDirty(true);

    if (type === "email") setEmail(event.target.value);
    if (type === "password") setPassword(event.target.value);
  };

  const handleLogin = async () => {
    const data = { email, password };
    setStatus("loading");

    await axios({
      method: "post",
      url: "/admin/login",
      data,
      headers: { "Access-Control-Allow-Origin": "*" },
    })
      .then((res) => {
        localStorage.setItem("accessToken", res.data.access_token);
        navigate("/main/movies");
        setStatus("idle");
      })
      .catch((e) => {
        console.error(e);
        setStatus("idle");
      });
  };

  const handleKeyDown = (e) => {
    if (e.key === "Enter") {
      e.preventDefault(); 
      if (email && password) {
        handleLogin();
      } else {
        setIsFieldsDirty(true);
      }
    }
  };

  useEffect(() => {
    setDebounceState(true);
  }, [userInputDebounce]);

  return (
    <div className="Login">
      <div className="main-container">
        <h3>Welcome Back!</h3>
        <p className="subtext">Sign in to continue to your account</p>
        <form onKeyDown={handleKeyDown}>
          <div className="form-container">
            <div className="form-group">
              <label htmlFor="email">E-mail:</label>
              <input
                type="text"
                id="email"
                name="email"
                ref={emailRef}
                onChange={(e) => handleOnChange(e, "email")}
              />
              {debounceState && isFieldsDirty && email === "" && (
                <span className="errors">Email is required</span>
              )}
            </div>
            <div className="form-group">
              <label htmlFor="password">Password:</label>
              <div className="password-container">
                <input
                  type={isShowPassword ? "text" : "password"}
                  id="password"
                  name="password"
                  ref={passwordRef}
                  onChange={(e) => handleOnChange(e, "password")}
                />
                <FontAwesomeIcon
                  icon={isShowPassword ? faEyeSlash : faEye}
                  className="password-toggle-icon"
                  onClick={handleShowPassword}
                />
              </div>
              {debounceState && isFieldsDirty && password === "" && (
                <span className="errors">Password is required</span>
              )}
            </div>
            <button
              className="btn-primary"
              type="button"
              disabled={status === "loading"}
              onClick={() => {
                if (email && password) {
                  handleLogin();
                } else {
                  setIsFieldsDirty(true);
                }
              }}
            >
              {status === "idle" ? "Login" : "Loading..."}
            </button>
            <div className="register-container">
              <small>Don't have an account?</small>
              <a href="/register">
                <small> Register</small>
              </a>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
}

export default Login;
