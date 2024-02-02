import React from 'react';
import LoginButton from '../atoms/LoginButton';
import RegisterButton from '../atoms/RegisterButton';

type TAuthFormButtonProps = {
  isLoginPage: boolean;
};

const AuthFormButton: React.FC<TAuthFormButtonProps> = ({ isLoginPage }) => {
  return (
    <>
      {isLoginPage ? (
        // ログインページ
        <LoginButton />
      ) : (
        // 新規登録ページ
        <RegisterButton />
      )}
    </>
  );
};

export default AuthFormButton;
