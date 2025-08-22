import { fetchSession } from "@/lib/user";
import LoginForm from "./_components/LoginForm";
import { redirect } from "next/navigation";
export default function LoginPage() {
  return <LoginForm></LoginForm>;
}

export const metadata = {
  title: "Login",
  description: "Login to your account",
};
