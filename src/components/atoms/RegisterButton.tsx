import Link from 'next/link';

const RegisterButton = () => {
  return (
    <>
      <div className="flex justify-end">
        <button
          type="submit"
          className="bg-blue-500 text-white font-bold py-2 px-4 rounded hover:bg-blue-700"
        >
          新規登録
        </button>
      </div>

      <div className="mt-4 grid text-center">
        <span className="text-gray-600 text-sm">既にアカウントをお持ちですか？</span>
        <Link
          href={'/auth/login'}
          className="text-blue-500 text-sm font-bold ml-1 hover:text-blue-700"
        >
          ログインページへ
        </Link>
      </div>
    </>
  );
};

export default RegisterButton;
