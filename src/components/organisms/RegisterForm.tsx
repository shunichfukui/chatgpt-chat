// next13だとサーバーサイドレンダリングになってしまっていて、hook-formでバグが起きるのでここだけクライアントでレンダリングするように
"use client";

import Header from "@/components/atoms/Header";
import { TInputsForm } from "@/types";
import { createUserWithEmailAndPassword } from "firebase/auth";
import Link from "next/link";
import React from "react";
import { useForm, SubmitHandler } from "react-hook-form";
import { auth } from "../../../firebase";

const RegisterForm = () => {
  const {
    register,
    handleSubmit,
    formState: { errors },
  } = useForm<TInputsForm>();

  // FIXME: 後ほどhooksへ切り出す
  const onSubmit: SubmitHandler<TInputsForm> = async (data) => {
    await createUserWithEmailAndPassword(auth, data.email, data.password)
      .then((userCrendential) => {
        const user = userCrendential.user;
      })
      .catch((error) => {
        // console.error(error);
        // alert(error);
        if (error.code === "auth/email-already-in-use") {
          alert("このメールアドレスはすでに使用されています。");
        } else {
          alert(error.message);
        }
      });
  };

  return (
    <form
      onSubmit={handleSubmit(onSubmit)}
      className="bg-white p-8 rounded-lg shadow-md w-96"
    >
      <Header title={"新規登録"} />

      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          メールアドレス
        </label>
        <input
          {...register("email", {
            required: "メールアドレスは必須です。",
            pattern: {
              value:
                /^[a-zA-Z0-9_.+-]+@([a-zA-Z0-9][a-zA-Z0-9-]*[a-zA-Z0-9]*\.)+[a-zA-Z]{2,}$/,
              message: "不適切なメールアドレスです。",
            },
          })}
          type="text"
          className="mt-1 border-2 rounded-md w-full p-2"
        />
        {errors.email && (
          <span className="text-red-600 text-sm">{errors.email.message}</span>
        )}
      </div>
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-600">
          パスワード
        </label>
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
        {errors.password && (
          <span className="text-red-600 text-sm">
            {errors.password.message}
          </span>
        )}
      </div>

      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          新規登録
        </button>
      </div>

      <div className="mt-4 grid">
        <span className="text-gray-600 text-sm">
          既にアカウントをお持ちですか？
        </span>
        <Link
          href={"/auth/login"}
          className="text-blue-500 text-sm font-bold ml-1 hover:text-blue-700"
        >
          ログインページへ
        </Link>
      </div>
    </form>
  );
};

export default RegisterForm;
