
import RegisterForm from "./RegisterForm";

export async function generateMetadata() {
  const title = "CineScope — Register";
  const description = "Sign up for CineScope to create your own movie list.";
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
