"use client";

import FormInput from "../../../components/form-input";
import FormButton from "../../../components/form-btn";
import SocialLogin from "../../../components/social-login";
import { useFormState } from "react-dom";
import { smsLogin } from "./actions";

const initialState = {
  token: false,
  error: undefined,
}

export default function SMSLogin() {
  const [state, action] = useFormState(smsLogin, initialState);

  return (
    <div className="flex flex-col gap-10 py-8 px-6">
      <div className="flex flex-col gap-2 *:font-medium">
        <h1 className="text-2xl">SMS Login</h1>
        <h2 className="text-xl">Verify your phone number</h2>
      </div>
      <form action={action} className="flex flex-col gap-3">

        {state.token ? (
          <FormInput
            name="token"
            type="number"
            placeholder="Verification code"
            required
            errors={state.error?.formErrors}
        />
        ) : (
        <FormInput
          name="phone"
          type="text"
          placeholder="Phone number"
          required
          errors={state.error?.formErrors}
      /> )}
      
        <FormButton
            text={state.token ? "Verify Token" : "Send Verification SMS"}
        />
      </form>
    </div>
  );
}