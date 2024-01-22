import RegisterForm from "@/components/organisms/AuthForm";
import React from "react";

const Register = () => {

  return (
    <div className="h-screen flex flex-col items-center justify-center">
      <RegisterForm isLoginPage={false} />
    </div>
  );
};

export default Register;