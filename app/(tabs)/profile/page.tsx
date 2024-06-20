import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";
import { Suspense } from "react";




async function getUser() {
    const session = await getSession()
    if(session.id) {
        const user = await db.user.findUnique({
            where: {
                id: session.id,
            },
        });
        if(user) {
            return user;
        }
    }
    // 세션 id가 없거나, 찾은 user가 없을 경우
    notFound(); // 404 에러 페이지를 보여줌.
}


async function Username(){
    await new Promise(resolve => setTimeout(resolve, 5000));
    const user = await getUser();
    return <h1>Welcome {user?.username}</h1>
}



export default async function Profile() {
    const logOut = async() => {
        "use server";
        const session = await getSession();
        await session.destroy();
        redirect("/");
    };

    return (
    <div>
        <Suspense fallback={"hello"}>
            <Username />
        </Suspense>
        <form action={logOut}>
            <button>Log out</button>
        </form>
    </div>
    );

}