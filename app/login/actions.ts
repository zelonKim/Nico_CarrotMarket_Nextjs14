"use server";
import {z} from "zod";
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import db from "@/lib/db";
import bcrypt from "bcrypt";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";

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



const checkEmailExists = async (email:string) => {
  const user = await db.user.findUnique({
    where: {
      email
    },
    select: {
      id: true,
    }
  })
  if(user) { // 사용자가 입력한 이메일이 데이터베이스에 존재하는 경우 (로그인 정보가 올바른 경우)
    return true
  } else {
    return false
  }
}


// 스키마 정의
const formSchema = z.object({
  email: z.string().email().toLowerCase().refine(checkEmailExists, "The email does not exist."),
  password: z.string({required_error: "Password is required"})
              //.min(PASSWORD_MIN_LENGTH)
              //.regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR)
})


export async function login(prevState: any, formData: FormData) {  // 서버 액션
  const data = {
    email: formData.get("email"),
    password: formData.get("password")
  }
    // 스키마 적용
    const result = await formSchema.spa(data); // Alias of safeParseAsync

      if(!result.success) {
        return result.error.flatten();
      } else {
        const user = await db.user.findUnique({
          where: {
            email: result.data.email
          },
          select: {
            password: true,
            id: true
          }
        })
        const ok = await bcrypt.compare(result.data.password, user!.password ?? "") // .compare(해싱 이전의 비밀번호, 해싱 이후의 비밀번호): 두 비밀번호가 서로 같을 경우 true를 반환함.
        if(ok) {

          const session = await getSession();
          
          session.id = user!.id; 
          await session.save()

          redirect("/profile");

        } else {
          return {
            fieldErrors: {
              password: ["Wrong password"],
              email: [],
            }
          }
        }
      }
}