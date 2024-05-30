// "use client";

// import { TInputsForm } from "@/types";
// import { createUserWithEmailAndPassword } from "firebase/auth";
// import { SubmitHandler } from "react-hook-form";
// import { auth } from "../../firebase";
// import { useRouter } from "next/navigation";

// const useFormSubmit: SubmitHandler<TInputsForm> = async (data) => {
//   const router = useRouter();
//   console.log(data);
//   console.log(auth);

//   await createUserWithEmailAndPassword(auth, data.email, data.password)
//     .then((userCrendential) => {
//       const user = userCrendential.user;
//       router.push("/auth/login");
//     })
//     .catch((error) => {
//       console.error(error);
//       // alert(error);
//       if (error.code === "auth/email-already-in-use") {
//         alert("このメールアドレスはすでに使用されています。");
//       } else {
//         alert(error.message);
//       }
//     });
// };

// export default useFormSubmit;
