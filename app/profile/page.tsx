import db from "@/lib/db";
import getSession from "@/lib/session";
import { notFound, redirect } from "next/navigation";

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


export default async function Profile() {
    const user = await getUser();

    const logOut = async() => {
        "use server";
        const session = await getSession();
        await session.destroy();
        redirect("/");
    };

    return (
    <div>
        <h1>Welcome {user?.username}</h1>
        <form action={logOut}>
            <button>Log out</button>
        </form>
    </div>
    );

}