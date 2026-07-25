import { redirect } from "next/navigation";
import { isAuthenticated } from "@/lib/auth";
import { LoginForm } from "@/components/dashboard/login-form";

export default async function DashboardLoginPage() {
  if (await isAuthenticated()) {
    redirect("/dashboard");
  }

  return <LoginForm />;
}
