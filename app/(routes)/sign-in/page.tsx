import type { Metadata } from "next";
import LoginForm from "./LoginForm";

export const metadata: Metadata = {
  description: "Sign in to your CineScope account to see and manage your movie list.",
  title: "Sign in",
  alternates: {canonical: "/sign-in"},
}

const LoginPage = () => {
  
  return (
    <section className=" h-screen">
      <LoginForm 
        heading="Sign In"
        buttonText="Sign in"
        signupText="Don’t have an account?"
        signupUrl="/sign-up"
      />
    </section>
  );
};

export default LoginPage;
