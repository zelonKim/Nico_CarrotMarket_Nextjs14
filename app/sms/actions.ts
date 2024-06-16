"use server"
import { z } from "zod"
import validator from "validator";
import { redirect } from "next/navigation";
import db from "@/lib/db";
import crypto from "crypto";
import getSession from "@/lib/session";
import twilio from "twilio";

interface ActionState {
    token: boolean
}


const phoneSchema = z.string().trim().refine(phone => validator.isMobilePhone(phone, "ko-KR"), "Wrong phone format")

async function getToken() {
    const token = crypto.randomInt(100000, 999999).toString(); // .randomInt(최소값, 최대값): 최소값과 최대값 사이의 랜덤한 정수를 생성함. 
    const exists = await db.sMSToken.findUnique({
        where: {
            token,
        },
        select: {
            id: true,
        }
    })
    if(exists) { // 이미 데이터베이스에 존재하는 토큰일 경우, 토큰을 다시 생성함.
        return getToken();
    } else {
        return token;
    }
}



async function tokenExists(token: number) {
    const exists = await db.sMSToken.findUnique({
        where: {
            token: token.toString(),
        },
        select: {
            id: true
        }
    })
    if(exists) { 
        return true
    } else {
        return false
    }
}

const tokenSchema = z.coerce.number().min(100000).max(999999).refine(tokenExists, "The token does not exist.");
// .coerce는 뒤에 나오는 데이터 타입으로 강제 형변환해줌.




////////////////////




export async function smsLogin(prevState: ActionState, formData: FormData){ 
    // console.log(typeof formData.get("token")) // string
    // console.log(typeof tokenSchema.parse(formData.get("token"))) // number

    const phone = formData.get("phone");
    const token = formData.get("token");

    if(!prevState.token) {
        const result = phoneSchema.safeParse(phone);
        if(!result.success) {
            return {
                token: false,
                error: result.error.flatten() //  { formErrors: [ 'Wrong phone format' ], fieldErrors: {} }
            };
        } else {
            // 이전의 토큰을 삭제함.
            await db.sMSToken.deleteMany({
                where: {
                    user: {
                        phone: result.data
                    }
                }
            })
            // 새로운 토큰을 생성함.
            const token = await getToken();

            await db.sMSToken.create({
                data: {
                    token,
                    user: {
                        connectOrCreate: { 
                            where: { // 데이터베이스에서 관계를 설정할 폰번호가 이미 존재하는지 찾음.
                                phone: result.data,
                            },
                            create: { // 관계를 설정할 폰번호가 존재하지 않는 경우, 새로 생성함.
                                username: crypto.randomBytes(10).toString("hex"), // .randomBytes(사이즈): 해당 사이즈만큼의 랜덤한 바이트를 생성함.
                                phone: result.data,
                            }
                        } 
                    }
                }
            })

            const client = twilio(
                process.env.TWILIO_ACCOUNT_SID,
                process.env.TWILIO_AUTH_TOKEN
            );

            await client.messages.create({
                body: `Your Karrot verification code is ${token}`,
                from: process.env.TWILIO_PHONE_NUMBER!,
                // to: result.data
                to: process.env.MY_PHONE_NUMBER!
            })
            return {
                token: true,
            }
        }
    } else {
        const result = await tokenSchema.spa(token);

        if(!result.success) {  // 데이터베이스에 해당 토큰이 존재하지 않는 경우
            return {
                token: true,
                error: result.error.flatten()
            } 
        } else { 
            // 데이터베이스에 해당 토큰이 존재하는 경우
            const token = await db.sMSToken.findUnique({
                where: {
                    token: result.data.toString(),
                },
                select: {
                    id: true,
                    userId: true,
                }
            })
            if(token) {
                const session = await getSession();
                session.id = token.userId;
                await session.save();

                await db.sMSToken.delete({
                    where: {
                        id: token.id
                    }
                })
            }
            redirect("/profile");
        }
    }
}