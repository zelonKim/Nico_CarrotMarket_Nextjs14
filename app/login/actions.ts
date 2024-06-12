"use server";
import {z} from "zod";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";

/*
 export async function handleForm(prevState: any, formData: FormData) { // also, server action function can have a previous state
    console.log(prevState);
      // first login -> { potato: 1 }
      // second login -> { errors: [ 'wrong password', 'password is too short' ] }
      // third login -> { errors: [ 'wrong password', 'password is too short' ] 
    await new Promise(resolve => setTimeout(resolve, 3000));
    return {
      errors: ["wrong password", "password is too short"]
    }
} 
*/


// 스키마 정의
const formSchema = z.object({
  email: z.string().email().toLowerCase(),
  password: z.string({required_error: "Password is required"})
              .min(PASSWORD_MIN_LENGTH)
              .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
})


export async function login(prevState: any, formData: FormData) {  // 서버 액션
  const data = {
    email: formData.get("email"),
    password: formData.get("password")
  }
    // 스키마 적용
    const result = formSchema.safeParse(data);

      if(!result.success) {
        return result.error.flatten();
      } else {
        console.log(result.data);
      }

}