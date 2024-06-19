import { NextRequest, NextResponse } from "next/server";
import db from "./lib/db";
import getSession from "./lib/session";

/*
export async function middleware(request: NextRequest) {
    // await db.user.findMany({}); // 미들웨어는 edge runtime에서 작동하므로, Prisma는 사용할 수 없음.

/*     
    console.log(request.url); 
    console.log("Hi I`m middleware.") 
*/
    // http://localhost:3000/
    // Hi I`m middleware.
    // http://localhost:3000/_next/static/css/app/layout.css?v=1718351861702
    // Hi I`m middleware.
    // http://localhost:3000/_next/static/chunks/webpack.js?v=1718351861702
    // Hi I`m middleware.
    // http://localhost:3000/_next/static/chunks/main-app.js?v=1718351861702
    // Hi I`m middleware.
    // http://localhost:3000/_next/static/chunks/app-pages-internals.js
    // Hi I`m middleware.
    // http://localhost:3000/_next/static/chunks/app/page.js
    // Hi I`m middleware.
    // http://localhost:3000/favicon.ico
    // Hi I`m middleware.


    ///////////////////////

    
/*     
    console.log(request.nextUrl.pathname); 
    console.log("Hi I`m middleware.") 
*/
    // /
    // Hi I`m middleware.
    // /_next/static/css/app/layout.css
    // Hi I`m middleware.
    // /_next/static/chunks/webpack.js
    // Hi I`m middleware.
    // /_next/static/chunks/main-app.js
    // Hi I`m middleware.
    // /_next/static/chunks/app-pages-internals.js
    // Hi I`m middleware.
    // /_next/static/chunks/app/page.js
    // Hi I`m middleware.
    // /favicon.ico
    // Hi I`m middleware.


    ///////////////

    /* 
    console.log(request.cookies.getAll()) // 요청에 담긴 쿠키를 가져옴. 
    */
    // [
    //     {
    //     name: 'delicious-carrot',
    //     value: 'Fe26.2*1*689c2cc8f44a030d03713031c7556eb6ddf3f736ae1f0a5d615813a3bae70071*9ci923j3aWnYJJ7iAfdMGg*oweKx0r6lBPoIBz2Bhnv3w*1719562631877*da33fe3430afc4aaedff88067cb104f0a2f4236bae5b48aaa506ad8b06724020*n4-fQv_NN-_NkmbhAyGvw5m9p6BXS9K_IOwdUMKcirw~2'
    //   }
    //   ]

    /////////////////

/*     if(request.nextUrl.pathname === "/profile") {
        return Response.redirect(new URL("/", request.url))
        // 사용자가 '/profile' 페이지로 접속할 경우, '/' 페이지로 리다이렉트시킴.
    }  
*/

    ////////////////


/*
    const pathname = request.nextUrl.pathname
    if(pathname === "/") {
        const response = NextResponse.next()
        response.cookies.set("middleware-cookie", "hello") // response.cookies.set("쿠키명", "쿠키값"): 쿠키를 설정함.
        return response;
    }
    if(pathname === "/profile") {
        return NextResponse.redirect(new URL("/", request.url))
    }  
}
*/



//////////////////




interface Routes {
    [key: string]: boolean;
}

const publicOnlyUrls: Routes = {
    "/": true,
    "/login": true,
    "/sms": true,
    "/create-account": true,
    "/github/start": true,
    "/github/complete": true
}


export async function middleware(request: NextRequest) {
    const session = await getSession();
    const exists = publicOnlyUrls[request.nextUrl.pathname]

    if(!session.id) { // 사용자가 로그아웃 상태인 경우
        if(!exists) { // 공개 전용 url이 아닐 경우
            return NextResponse.redirect(new URL("/", request.url))
        }
    } else { // 사용자가 로그인 상태인 경우
        if(exists) { // 공개 전용 url일 경우
            return NextResponse.redirect(new URL("/home", request.url))
        }
    }
}

export const config = {
    matcher: ["/((?!_next/static|_next/image|favicon.ico).*)"], // 미들웨어가 실행될 페이지를 지정함.
};

