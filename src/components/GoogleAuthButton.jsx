import { useGoogleLogin } from "@react-oauth/google";
import { toast } from "@/components/Toaster";
import { useAuth } from "@/controllers/AuthController";
import { useRouter } from "@/lib/router";

function GoogleButton({ text }) {
  const { googleLogin } = useAuth();
  const router = useRouter();

  const login = useGoogleLogin({
    onSuccess: async (tokenResponse) => {
      try {
        await googleLogin({ accessToken: tokenResponse.access_token });
        toast("Google login successful", "success");
        router.push("/dashboard");
      } catch (error) {
        toast(error.message || "Google login failed", "error");
      }
    },
    onError: () => toast("Google login failed", "error")
  });

  return (
    <button type="button" onClick={() => login()} className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-white border border-slate-200 text-[14px] font-medium hover:bg-slate-50 transition">
      <span className="w-4 h-4 rounded-full bg-linear-to-br from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center text-[10px] font-bold text-white">G</span>{text}
    </button>
  );
}

export function GoogleAuthButton({ text = "Continue with Google" }) {
  const clientId = import.meta.env.VITE_GOOGLE_CLIENT_ID;

  if (!clientId) {
    return (
      <button type="button" onClick={() => toast("Google login is not configured on this installation", "error")} className="w-full inline-flex items-center justify-center gap-2.5 px-6 py-3 rounded-xl bg-white border border-slate-200 text-[14px] font-medium hover:bg-slate-50 transition">
        <span className="w-4 h-4 rounded-full bg-linear-to-br from-blue-500 via-red-500 to-yellow-500 flex items-center justify-center text-[10px] font-bold text-white">G</span>{text}
      </button>
    );
  }

  return <GoogleButton text={text} />;
}
