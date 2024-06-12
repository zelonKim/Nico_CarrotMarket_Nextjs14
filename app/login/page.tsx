/* 
"use client";

import FormInput from "../components/form-input";
import FormButton from "../components/form-btn";
import SocialLogin from "../components/social-login";
import React from "react";

export default function Login() {

  const onClick = async () => {
    const response = await fetch("/www/users", {
      method: "POST",
      body: JSON.stringify({
        username: "nico",
        password: "1234"
      })
    });
    console.log(await response.json());
  }

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Login in with email and password</h2>
      </div>
      <form className="flex flex-col gap-3">
        <FormInput
            type="email"
            placeholder="Email"
            required
            errors={[]}
        />
        <FormInput
            type="password"
            placeholder="Password"
            required
            errors={[]}
        />
      </form>
        <span onClick={onClick}>
          <FormButton loading={false} text="Log in" />
        </span>
        <SocialLogin />
    </div>
  );
} 
*/

/////////////////////////////////


"use client"

import FormInput from "../components/form-input";
import FormButton from "../components/form-btn";
import SocialLogin from "../components/social-login";
import React from "react";
import { FormData } from "undici-types";
import { redirect } from "next/navigation";
import { useFormState } from "react-dom";
import { login } from "./actions";
import { PASSWORD_MIN_LENGTH } from "@/lib/constants";

export default function Login() {
/*
  // Server Action
  async function handleForm(formData: FormData) {
    "use server";
    await new Promise(resolve => setTimeout(resolve, 3000));
    // console.log(formData.get("email"), formData.get("password")); 
    // console.log("logged in");
    redirect("/")
    return {
      error: "wrong password"
    }
  }
*/

  const [state, action] = useFormState(login, null);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">안녕하세요!</h1>
        <h2 className="text-xl">Login in with email and password</h2>
      </div>

      <form action={action} className="flex flex-col gap-3">
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
            minLength={PASSWORD_MIN_LENGTH}
            errors={state?.fieldErrors.password}
        />
        <FormButton text="Log in" />
      </form>
        <SocialLogin />
    </div>
  );
} 