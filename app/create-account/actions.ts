"use server"
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import {z} from "zod";

// 스키마 생성
// const usernameSchema = z.string().min(3).max(10); // 데이터는 스트링 타입이여야 하며, 최소 3글자에서 최대 10글자 이내여야 함.

// const formSchema = z.object({
//     username: z.string().min(3).max(10),
//     email: z.string().email(),
//     password: z.string().min(10),
//     confirm_password: z.string().min(10)
// })



function checkUsername(username: string) {
    return !username.includes("potato");
}

function checkPasswords({password, confirm_password} : {password: string, confirm_password: string}) {
    return password === confirm_password
}


const formSchema = z.object({
    username: z.string({invalid_type_error: "User name must be a string",
                         required_error: "where is your username?"})
                .toLowerCase()
                .trim()
                .transform(username => `⭐️${username}⭐️`) //.transform(변형 전의 데이터 => 변형 후의 데이터)
                .refine(checkUsername, "No potato allowed!"), 
                 // refine(체크 함수, "에러 메시지"): 체크 함수가 false를 반환하면 에러 메시지를 보여줌.
    email: z.string().email().toLowerCase(),
    password: z.string().min(PASSWORD_MIN_LENGTH).regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR),
                             // .regex(정규표현식, "에러 메시지"): 정규표현식과 일치하지 않을 경우, 에러 메시지를 보여줌.
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH)
}).refine(checkPasswords, {
        message: "Both password must be same!", 
        path: ["confirm_password"], // 에러 메시지를 보여줄 곳의 ["키"]를 지정함.
    })






//////////////////

export async function createAccount(prevState:any, formData:FormData) {
    const data ={
        username: formData.get("username"),
        email: formData.get("email"),
        password: formData.get("password"),
        confirm_password: formData.get("confirm_password")
    };

    // 스키마 적용
    // usernameSchema.parse(data.username); // 스키마.parse(검사할 데이터)
    // formSchema.parse(data);

    // .parse()는 유효성 검사가 실패하면 에러를 던짐. -> 따라서, try catch 구문으로 감싸줘야 함.
    /*       
        try {
            formSchema.parse(data);
        } catch(e) {
            console.log(e)
        } 
    */

    // .safeParse()는 유효성 검사가 실패해도 에러를 던지지 않음.  대신, 유효성 검사 결과를 반환함.
    const result = formSchema.safeParse(data);
    // console.log(result); // { success: false, error: [Getter] }



  
    // if(!result.success) {
    //     console.log(result.error);
    // }
    /* 
    ...
    errors: [
        {
          code: 'too_small',
          minimum: 10,
          type: 'string',
          inclusive: true,
          exact: false,
          message: 'String must contain at least 10 character(s)',
          path: [Array]
        },
        {
          code: 'too_small',
          minimum: 10,
          type: 'string',
          inclusive: true,
          exact: false,
          message: 'String must contain at least 10 character(s)',
          path: [Array]
        }
      ]
    } 
    */
    
    //////////////////


    if(!result.success) {
        // console.log(result.error.flatten()); // .flatten()은 에러 객체를 축약해줌.
        console.log(result.error.flatten())
        return result.error.flatten();
    } else {
        console.log(result.data);
    }
    /*     
    fieldErrors: {
        password: [ 'String must contain at least 10 character(s)' ],
        confirm_password: [ 'String must contain at least 10 character(s)' ]
      } 
    */

}