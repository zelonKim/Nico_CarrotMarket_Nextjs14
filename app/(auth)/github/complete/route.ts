import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { NextRequest } from "next/server";

export async function GET(request: NextRequest) { // 기본적으로, Next.js는 GET 요청을 캐시에 저장해줌.
    const code = request.nextUrl.searchParams.get("code");
    if(!code) {
        return new Response(null, {
            status: 400,
        })
    }
    
    const accessTokenParams = new URLSearchParams({
        client_id: process.env.GITHUB_CLIENT_ID!,
        client_secret: process.env.GITHUB_CLIENT_SECRET!,
        code,
    }).toString()

    const accessTokenURL = `https://github.com/login/oauth/access_token?${accessTokenParams}`;
    
    const accessTokenResponse = await fetch(accessTokenURL, {
        method: "POST",
        headers: {
            Accept: "application/json"
        }
    });

    const {error, access_token} = await accessTokenResponse.json();

    if (error) { 
        return new Response(null, {
            status: 400,
        })
    }

    const userProfileResponse = await fetch("https://api.github.com/user", {
        headers: {
            "Authorization": `Bearer ${access_token}`
        },
        cache: "no-cache" // GET 요청을 캐시에 저장하지 않도록 함.
    })

    const { id, avatar_url, login } = await userProfileResponse.json();
    
    const user = await db.user.findUnique({
        where: {
            github_id: id + "",
        },
        select: {
            id: true,
        }
    });
    if(user) {
        const session = await getSession();
        session.id = user.id;
        await session.save();
        return redirect("/profile");
    }


    const newUser = await db.user.create({
        data: {
            username: login,
            github_id: id + "",
            avatar: avatar_url,
        },
        select: {
            id: true,
        }
    })
        const session = await getSession();
        session.id = newUser.id;
        await session.save();
        return redirect("/profile");

}