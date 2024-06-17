"use server"
import { PASSWORD_MIN_LENGTH, PASSWORD_REGEX, PASSWORD_REGEX_ERROR } from "@/lib/constants";
import {z} from "zod";
import { PrismaClient } from "@prisma/client";
import bcrypt, { hash } from "bcrypt";

import { cookies } from "next/headers";
import { redirect } from "next/navigation";
import getSession from "@/lib/session";

const db = new PrismaClient();


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



/* const checkUniqueUsername = async (username: string) => {
    // 중복 확인
    const user = await db.user.findUnique({
        where: {
            username 
        },
        select: { // 원하는 필드만 선택해서 가져옴.
            id: true,             
        }
    });
    if(user) { // 사용자가 폼에 입력한 username과 같은 username이 데이터베이스에 이미 있을 경우 (중복된 경우)
        return false
    } else { 
        return true
    }
} */


/* const checkUniqueEmail = async (email: string) => {
    const user = await db.user.findUnique({
        where: {
            email
        },
        select: {
            id: true,
        }
    });
    return !Boolean(user);
}*/

const formSchema = z.object({
    username: z.string({invalid_type_error: "User name must be a string",
                         required_error: "where is your username?"})
                .toLowerCase()
                .trim()
                //.transform(username => `⭐️${username}⭐️`) //.transform(변형 전의 데이터 => 변형 후의 데이터)
                .refine(checkUsername, "No potato allowed!"), // refine(체크 함수, "에러 메시지"): 체크 함수가 false를 반환하면 에러 메시지를 보여줌.
                //.refine(checkUniqueUsername, "The username is already using")
    email: z.string()
            .email()
            .toLowerCase(),
            //.refine(checkUniqueEmail, "The email is already using")
    password: z.string()
                .min(PASSWORD_MIN_LENGTH),
                // .regex(PASSWORD_REGEX, PASSWORD_REGEX_ERROR) // .regex(정규표현식, "에러 메시지"): 정규표현식과 일치하지 않을 경우, 에러 메시지를 보여줌.
    confirm_password: z.string().min(PASSWORD_MIN_LENGTH)
    })
    .superRefine(async({username}, ctx) => { // 체크함수의 인수로 컨텍스트(에러 묶음)를 받을 수 있음.
        const user = await db.user.findUnique({
            where: {
                username 
            },
            select: {
                id: true,
            }
        })
        if(user) {
            ctx.addIssue({ // 컨텍스트.addIssue()를 통해 에러를 설정함.
                code: 'custom',
                message: "The username is already using",
                path: ['username'],
                fatal: true, 
            });
            return z.NEVER; 
            // fatal: true와 return z.NEVER를 통해 이후에 나오는 refine()을 실행하지 않도록 해줌.
        }
    })
    .superRefine(async({email}, ctx) => { 
        const user = await db.user.findUnique({
            where: {
                email
            },
            select: {
                id: true,
            }
        })
        if(user) {
            ctx.addIssue({ 
                code: 'custom',
                message: "The email is already using",
                path: ['email'],
                fatal: true, 
            });
            return z.NEVER;
        }
    })
    .refine(checkPasswords, {
        message: "Both password must be same!", 
        path: ["confirm_password"], // 에러 메시지를 보여줄 곳의 ["키"]를 지정함.
    })


//////////////////

export async function createAccount(prevState:any, formData:FormData) {
    console.log(cookies()) // 현재 브라우저에 저장된 쿠키를 반환함.
    // {
    //     _parsed: Map(0) {},
    //     _headers: HeadersList {
    //       cookies: null,
    //       [Symbol(headers map)]: Map(0) {},
    //       [Symbol(headers map sorted)]: null
    //     }
    //   }


    // {
    //     _parsed: Map(1) {
    //       'delicious-carrot' => {
    //         name: 'delicious-carrot',
    //         value: 'Fe26.2*1*29c68a6be49ca82c60994afaea611d5e244d81e7a0bd014e1b3e54901e39a8ec*iHAZvENgwcdXIw4_5zulpA*LIs-RIKqEkB1a4tXIhyLLw*1719540179151*9d449e5d178e5f7155a391f8e4d093314fbae19f03062dca0ceb5677057bbf3c*BkGDUWCUiUMTVTbe4p8ceOQ0rOqyLd06yzdpF4L0HqQ~2',
    //         path: '/'
    //       }
    //     },
    //     _headers: HeadersList {
    //       cookies: [
    //         'delicious-carrot=Fe26.2*1*29c68a6be49ca82c60994afaea611d5e244d81e7a0bd014e1b3e54901e39a8ec*iHAZvENgwcdXIw4_5zulpA*LIs-RIKqEkB1a4tXIhyLLw*1719540179151*9d449e5d178e5f7155a391f8e4d093314fbae19f03062dca0ceb5677057bbf3c*BkGDUWCUiUMTVTbe4p8ceOQ0rOqyLd06yzdpF4L0HqQ~2; Path=/'
    //       ],
    //       [Symbol(headers map)]: Map(1) { 'set-cookie' => [Object] },
    //       [Symbol(headers map sorted)]: null
    //     }
    //   }

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
    const result = await formSchema.safeParseAsync(data); // console.log(result); // { success: false, error: [Getter] }

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
        console.log(result.error.flatten())
        return result.error.flatten();
    } else {
        const hashedPassword = await bcrypt.hash(result.data.password, 12); // .hash(데이터, 횟수): 데이터를 해당 횟수만큼 해싱해줌.
        console.log(hashedPassword); // $2b$12$EpCNY0xKUBMk/g7/ZUn6E.UepHuAw/yyt7CgWDWwcNZNovHkeiRuG
        
       const user = await db.user.create({
            data: {
                username: result.data.username,
                email: result.data.email,
                password: hashedPassword,
            },
            select: {
                id: true,
            }
        });

       const session = await getSession();

        session.id = user.id // 세션에 넣을 정보
        await session.save() 

        redirect("profile");
    }


}