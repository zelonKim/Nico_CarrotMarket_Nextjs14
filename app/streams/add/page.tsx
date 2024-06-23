"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import { useFormState } from "react-dom";
import { startStream } from "./actions";

export default function AddStream() {
    const [state, action] = useFormState(startStream, null);
    return (
    <form action={action} className="p-5 flex flex-col gap-2">
        <FormInput name="title" required placeholder="Title or your stream." errors={state?.formErrors} />
        <FormButton text="Start streaming" />
    </form>
    )
}