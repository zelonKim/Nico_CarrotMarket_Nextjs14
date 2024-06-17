"use client";

import { ChatBubbleOvalLeftEllipsisIcon } from "@heroicons/react/24/solid";
import Link from "next/link";
import FormInput from "../../../components/form-input";
import FormButton from "../../../components/form-btn";
import SocialLogin from "../../../components/social-login";
import { useFormState } from "react-dom";
import { createAccount } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function CreateAccount() {
  const [state, action] = useFormState(createAccount, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Fill in the form below to join!</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">
        <FormInput
            name="username"
            type="text"
            placeholder="Username"
            required
            errors={state?.fieldErrors.username}
            minLength={3}
            maxLength={10}
        />
        <FormInput
            name="email"
            type="email"
            placeholder="Email"
            required
            errors={state?.fieldErrors.email}
            />
        <FormInput
            name="password"
            type="password"
            placeholder="Password"
            required
            errors={state?.fieldErrors.password}
            minLength={PASSWORD_MIN_LENGTH}
        />
        <FormInput
            name="confirm_password"
            type="password"
            placeholder="Confirm Password"
            required
            errors={state?.fieldErrors.confirm_password}
            minLength={PASSWORD_MIN_LENGTH}
        />
        <FormButton
            text="Create Account"
        />
      </form>
        <SocialLogin />
    </div>
  );
}