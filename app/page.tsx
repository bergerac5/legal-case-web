import LoginForm from "@/components/auth/LoginForm";
import backgroundPic from "../assets/BgPc.jpeg";
export default function Home() {
  return (
    <div className="relative w-screen h-screen overflow-hidden">
      <img
        src={backgroundPic.src}
        alt="Background"
        className="absolute top-0 left-0 w-full h-full object-fill"
      />
      <div className="relative z-10 flex items-center justify-center h-full">
        <LoginForm />
      </div>
    </div>
  );
}
