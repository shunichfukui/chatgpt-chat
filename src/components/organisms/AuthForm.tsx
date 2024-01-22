// next13だとサーバーサイドレンダリングになってしまっていて、hook-formでバグが起きるのでここだけクライアントでレンダリングするように
"use client";

import Header from "@/components/atoms/Header";
import { TInputsForm } from "@/types";
import { createUserWithEmailAndPassword, signInWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import { useRouter } from "next/navigation";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { auth } from "../../../firebase";
import AuthFormButton from "../molecules/authFormButton";

type TAuthFormProps = {
  isLoginPage: boolean;
};

const AuthForm: React.FC<TAuthFormProps> = ({ isLoginPage }) => {
  const router = useRouter();

  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TInputsForm>();

  const onSubmit: SubmitHandler<TInputsForm> = async (data) => {
    try {
      if (isLoginPage) {
        await signInWithEmailAndPassword(auth, data.email, data.password);
        router.push("/");
      } else {
        await createUserWithEmailAndPassword(auth, data.email, data.password);
        router.push("/auth/login");
      }
    } catch (error) {
      const errorMessage =
        error.code === "auth/user-not-found"
          ? "対象のユーザーが存在しません。"
          : error.code === "auth/email-already-in-use"
          ? "このメールアドレスはすでに使用されています。"
          : error.message;
      alert(errorMessage);
    }
  };

  return (
    <form onSubmit={handleSubmit(onSubmit)} className="bg-white p-8 rounded-lg shadow-md w-96">
      <Header title={isLoginPage ? "ログイン" : "新規登録"} />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">メールアドレス</label>
        <input
          {...register("email", {
            required: "メールアドレスは必須です。",
            pattern: {
              value: /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
              message: "不適切なメールアドレスです。",
            },
          })}
          type="text"
          className="mt-1 border-2 rounded-md w-full p-2"
        />
        {errors.email && <span className="text-red-600 text-sm">{errors.email.message}</span>}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">パスワード</label>
        <input
          type="password"
          {...register("password", {
            required: "パスワードは必須です。",
            minLength: {
              value: 6,
              message: "6文字以上入力してください。",
            },
          })}
          className="mt-1 border-2 rounded-md w-full p-2"
        />
        {errors.password && <span className="text-red-600 text-sm">{errors.password.message}</span>}
      </div>
      <AuthFormButton isLoginPage={isLoginPage} />
    </form>
  );
};

export default AuthForm;