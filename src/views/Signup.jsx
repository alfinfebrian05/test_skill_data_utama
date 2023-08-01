import { useRef, useState } from "react";
import { Link } from "react-router-dom";
import axiosClient from "../axios-client";
import { useStateContext } from "../contexts/ContextProvider";

export default function Signup() {
  const [errors, setErrors] = useState();

  const nameRef = useRef();
  const emailRef = useRef();
  const passwordRef = useRef();
  const passwordConfirmationRef = useRef();

  const getTodayTimestamp = () => {
    var today = new Date();
    var year = today.getFullYear();
    var month = today.getMonth() + 1;
    var day = today.getDate();
    var hours = today.getHours();
    var minute = today.getMinutes();
    var second = today.getSeconds();

    return (
      year + "-" + month + "-" + day + " " + hours + ":" + minute + ":" + second
    );
  };

  console.log(getTodayTimestamp());

  const { setUser, setToken } = useStateContext();

  const formOnSubmit = (e) => {
    e.preventDefault();

    const payload = {
      name: nameRef.current.value,
      email: emailRef.current.value,
      password: passwordRef.current.value,
      password_confirmation: passwordConfirmationRef.current.value,
    };

    axiosClient
      .post("/signup", payload)
      .then(({ data }) => {
        setUser(data.user);
        setToken(data.token);
      })
      .catch((err) => {
        const response = err.response;

        if (response && response.status === 422) {
          setErrors(response.data.errors);
        }
      });
  };

  return (
    <div className="login-signup-form animated fadeInDown">
      <div className="form">
        <form onSubmit={formOnSubmit}>
          <h1 className="title">Signup for free</h1>
          {errors && (
            <div className="alert">
              {Object.keys(errors).map((key) => (
                <p key={key}>{errors[key][0]}</p>
              ))}
            </div>
          )}

          <input ref={nameRef} placeholder="Full Name" />
          <input ref={emailRef} type="email" placeholder="Email" />
          <input ref={passwordRef} type="password" placeholder="Password" />
          <input
            ref={passwordConfirmationRef}
            type="password"
            placeholder="Password Confirmation"
          />
          <button className="btn btn-block">Sign Up</button>
          <p className="message">
            Already Registered? <Link to="/login">Login to Account</Link>
          </p>
        </form>
      </div>
    </div>
  );
}
