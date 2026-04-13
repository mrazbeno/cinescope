
import type { Metadata } from "next";
import RegisterForm from "./RegisterForm";

export const metadata: Metadata = {
  description: "Sign up for CineScope to create your own movie list.",
  title: "Sign up",
  alternates: {canonical: "/sign-up"},
}

const RegisterPage = () => {
  return (
    <section className=" h-screen">
      <RegisterForm
        heading = "Sign Up"
        buttonText = "Create Account"
        signupText = "Already a user?"
        signupUrl = "/sign-in"
      />
    </section>
  );
};

export default RegisterPage;
