"use client";

import React from "react";
import AuthForm from "@/components/organisms/AuthForm";

const Login = () => {

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <AuthForm isLoginPage={true} />
    </div>
  );
};

export default Login;