import loginImg from "../assets/login.png";
import Template from "../components/auth/Template"
import frame from "../assets/frame.png"
function LoginPage() {
  return (
    <Template
      title="Welcome Back"
      description1="Build skills for today, tomorrow, and beyond."
      description2="Education to future-proof your career."
      image={loginImg}
      formType="login"
      frame={frame}
    />
  );
}

export default LoginPage;
