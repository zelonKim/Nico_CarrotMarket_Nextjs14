import { getIronSession } from "iron-session";
import { cookies } from "next/headers";

interface SessionContent {
    id?: number;
}

export default function getSession() {
    return getIronSession<SessionContent>(cookies(), { 
        cookieName: "delicious-carrot", // 생성할 쿠키명
        password: process.env.COOKIE_PASSWORD! // 세션에 넣을 정보를 암호화 및 복호화 하기 위한 패스워드
    })
}