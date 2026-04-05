import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  description: "Sign in to your CineScope account to see and manage your movie list.",
  title: "Login",
  alternates: {canonical: "/login"},
}

const LoginPage = () => {
  
  return (
    <section className=" h-screen">
      <LoginForm 
        heading="Login"
        buttonText="Sign in"
        signupText="Don’t have an account?"
        signupUrl="/signup"
      />
    </section>
  );
};

export default LoginPage;
