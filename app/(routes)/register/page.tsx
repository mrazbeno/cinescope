
import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  description: "Sign up for CineScope to create your own movie list.",
  title: "Register",
  alternates: {canonical: "/register"},
}

const RegisterPage = () => {
  return (
    <section className=" h-screen">
      <RegisterForm
        heading = "Signup"
        buttonText = "Create Account"
        signupText = "Already a user?"
        signupUrl = "/login"
      />
    </section>
  );
};

export default RegisterPage;
