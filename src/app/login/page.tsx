"use client";

import { useActionState } from "react";
import Link from "next/link";
import { login, signup, type AuthFormState } from "./actions";

const inputClass =
  "w-full rounded-lg border border-gray-200 px-3 py-2 text-sm focus:outline-none focus:ring-2 focus:ring-indigo-400";

export default function LoginPage() {
  const [loginState, loginAction, loginPending] = useActionState<
    AuthFormState,
    FormData
  >(login, undefined);
  const [signupState, signupAction, signupPending] = useActionState<
    AuthFormState,
    FormData
  >(signup, undefined);

  return (
    <main className="flex min-h-screen flex-col items-center justify-center gap-10 bg-gradient-to-b from-slate-50 to-slate-200 px-4 py-16 dark:from-neutral-950 dark:to-neutral-900">
      <div className="w-full max-w-sm space-y-8">
        <div className="text-center">
          <h1 className="text-2xl font-bold text-neutral-800 dark:text-neutral-100">
            로그인 / 회원가입
          </h1>
          <p className="mt-1 text-sm text-neutral-500 dark:text-neutral-400">
            로그인하면 운세 기록이 계정에 저장돼요
          </p>
        </div>

        <form
          action={loginAction}
          className="space-y-3 rounded-2xl bg-white p-6 shadow-md"
        >
          <h2 className="text-sm font-semibold text-gray-700">
            이미 계정이 있어요
          </h2>
          <input
            name="email"
            type="email"
            placeholder="이메일"
            required
            className={inputClass}
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호"
            required
            className={inputClass}
          />
          {loginState?.error && (
            <p className="text-xs text-red-500">{loginState.error}</p>
          )}
          <button
            type="submit"
            disabled={loginPending}
            className="w-full rounded-lg bg-indigo-600 py-2 text-sm font-semibold text-white transition hover:bg-indigo-700 disabled:opacity-60"
          >
            {loginPending ? "로그인 중..." : "로그인"}
          </button>
        </form>

        <form
          action={signupAction}
          className="space-y-3 rounded-2xl bg-white p-6 shadow-md"
        >
          <h2 className="text-sm font-semibold text-gray-700">
            처음이에요, 계정 만들기
          </h2>
          <input
            name="email"
            type="email"
            placeholder="이메일"
            required
            className={inputClass}
          />
          <input
            name="password"
            type="password"
            placeholder="비밀번호 (6자 이상)"
            required
            className={inputClass}
          />
          {signupState?.error && (
            <p className="text-xs text-red-500">{signupState.error}</p>
          )}
          {signupState?.message && (
            <p className="text-xs text-green-600">{signupState.message}</p>
          )}
          <button
            type="submit"
            disabled={signupPending}
            className="w-full rounded-lg bg-pink-500 py-2 text-sm font-semibold text-white transition hover:bg-pink-600 disabled:opacity-60"
          >
            {signupPending ? "가입 중..." : "회원가입"}
          </button>
        </form>

        <div className="text-center">
          <Link
            href="/"
            className="text-xs text-gray-500 underline underline-offset-2"
          >
            ← 로그인 없이 계속 보기
          </Link>
        </div>
      </div>
    </main>
  );
}
