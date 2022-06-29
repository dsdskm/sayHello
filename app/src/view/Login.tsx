import React from "react";
import { Button } from "@mui/material";
import { signInWithEmailAndPassword, signOut } from "firebase/auth";
import { useState } from "react";
import { auth, db } from "../config/firebase_config";
import { addDoc, collection } from "firebase/firestore";
const Login = () => {
  const [email, setEmail] = useState<string>("");
  const [password, setPassword] = useState<string>("");

  const handleChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const id: string = e.target.id;
    const value: string = e.target.value;
    console.log(`handleChange id=${id} value=${value}`);
    if (id === "email") {
      setEmail(value);
    } else if (id === "password") {
      setPassword(value);
    }
  };

  const onLoginClick = () => {
    console.log(`onLoginClick email=${email} password=${password}`);
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        if (user) {
          addLoginData();
          alert("로그인 성공");
        }
      })
      .catch((error) => {
        addLoginFailtData();
        alert("로그인 실패");
      });
  };

  const onLogOutClick = () => {
    signOut(auth).then(() => {
      addLogoutData();
      alert("로그아웃 성공");
    });
  };

  const addLoginData = async () => {
    await addDoc(collection(db, "test"), {
      value: "login",
    });
  };

  const addLogoutData = async () => {
    await addDoc(collection(db, "test"), {
      value: "logout",
    });
  };

  const addLoginFailtData = async () => {
    await addDoc(collection(db, "test"), {
      value: "logfail",
    });
  };
  return (
    <>
      <div className="App">
        <form className="form">
          <input id="email" onChange={handleChange} type="text" />
          <input id="password" onChange={handleChange} type="password" />

          <Button type="button" color="primary" onClick={onLoginClick}>
            Log in
          </Button>
          <Button type="button" color="primary" onClick={onLogOutClick}>
            Log out
          </Button>
        </form>
      </div>
    </>
  );
};

export default Login;
