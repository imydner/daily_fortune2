import Link from "next/link";
import { logout } from "@/app/login/actions";

export default function AuthStatus({ email }: { email: string | null }) {
  return (
    <div className="flex w-full max-w-sm items-center justify-end gap-3 text-xs text-gray-500 dark:text-gray-400">
      {email ? (
        <>
          <span>{email}님</span>
          <form action={logout}>
            <button
              type="submit"
              className="underline underline-offset-2 hover:text-gray-700 dark:hover:text-gray-200"
            >
              로그아웃
            </button>
          </form>
        </>
      ) : (
        <Link
          href="/login"
          className="underline underline-offset-2 hover:text-gray-700 dark:hover:text-gray-200"
        >
          로그인 / 회원가입
        </Link>
      )}
    </div>
  );
}
