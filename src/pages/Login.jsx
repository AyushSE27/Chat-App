import { useContext } from "react";
import { AuthContext } from "../context/AuthContext";

import { useState } from "react";
import axios from "axios";

function Login() {

  const { login } =
    useContext(AuthContext);

  const [formData, setFormData] =
    useState({
      email: "",
      password: "",
    });

  const handleChange = (e) => {

    setFormData({
      ...formData,
      [e.target.name]:
        e.target.value,
    });
  };

  const handleSubmit = async (e) => {

    e.preventDefault();

    try {

      const res =
        await axios.post(
          "http://localhost:5000/api/auth/login",
          formData
        );

      login(
        res.data.user,
        res.data.token
      );

      localStorage.setItem(
        "token",
        res.data.token
      );

      localStorage.setItem(
        "user",
        JSON.stringify(
          res.data.user
        )
      );

      alert(
        "Login Successful 🚀"
      );

      console.log(res.data);

      // redirect
      window.location.href =
        "/chat";

    } catch (error) {

      console.log(error);

      alert("Login Failed");
    }
  };

  return (

    <div
      style={{
        padding: "30px",
      }}
    >

      <h1>Login</h1>

      <form
        onSubmit={handleSubmit}
      >

        <input
          type="email"
          name="email"
          placeholder="Enter Email"
          onChange={
            handleChange
          }
        />

        <br />
        <br />

        <input
          type="password"
          name="password"
          placeholder="Enter Password"
          onChange={
            handleChange
          }
        />

        <br />
        <br />

        <button type="submit">
          Login
        </button>

      </form>

      <br />

      {/* REGISTER BUTTON */}

      <button
        onClick={() => {

          window.location.href =
            "/register";
        }}
      >

        Go To Register

      </button>

    </div>
  );
}

export default Login;