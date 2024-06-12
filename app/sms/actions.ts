"use server"
import { z } from "zod"
import validator from "validator";
import { redirect } from "next/navigation";

const phoneSchema = z.string().trim().refine(phone => validator.isMobilePhone(phone, "ko-KR"), "Wrong phone format")

const tokenSchema = z.coerce.number().min(100000).max(999999);
// .coerce는 뒤에 나오는 데이터 타입으로 강제 형변환해줌.



interface ActionState {
    token: boolean
}

export async function smsLogin(prevState: ActionState, formData: FormData){ 
    // console.log(typeof formData.get("token")) // string
    // console.log(typeof tokenSchema.parse(formData.get("token"))) // number

    const phone = formData.get("phone");
    const token = formData.get("token");

    if(!prevState.token) {
        const result = phoneSchema.safeParse(phone);
        if(!result.success) {
            console.log(result.error.flatten()); // { formErrors: [ 'Wrong phone format' ], fieldErrors: {} }

            return {
                token: false,
                error: result.error.flatten()
            };
        } else {
            return {
                token: true,
            }
        }
    } else {
        const result = tokenSchema.safeParse(token);
        if(!result.success) {
            return {
                token: true,
                error:result.error.flatten()
            } 
        } else {
            redirect("/");
        }
    }
}