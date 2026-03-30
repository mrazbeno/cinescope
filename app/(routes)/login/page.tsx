import LoginForm from "./LoginForm";

export async function generateMetadata() {
  const title = "CineScope — Login";
  const description = "Sign in to your CineScope account to see and manage your movie list.";
  const url = process.env.NEXT_PUBLIC_SITE_URL ?? "";

  return {
    title,
    description,
    alternates: { canonical: url || "/" },
    openGraph: {
      title,
      description,
      url,
      type: "website",
      siteName: "CineScope",
    },
    twitter: {
      card: "summary_large_image",
      title,
      description,
    },
  };
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
