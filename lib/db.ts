import { PrismaClient } from "@prisma/client";

const db = new PrismaClient();

    // await 클라이언트 객체.테이블명.쿼리 함수  // (테이블명은 소문자로 시작함.)
/* 
async function test1() {
    await db.user.create({ // 데이터베이스의 User 테이블에 해당 데이터를 생성함.
        data: {
            username: "aaa",
        }
    })
}
test1();
*/

/*
async function test2() {
    const result = await db.user.findMany({ // 데이터베이스의 User테이블에서 해당 데이터를 찾은 후, 그 결과를 반환함.
        where: {
            username: {
                contains: "a",
            },
        },
    })
    console.log(result);
    //  [
    //     {
    //       id: 1,
    //       username: 'aaa',
    //       email: null,
    //       password: null,
    //       phone: null,
    //       github_id: null,
    //       avatar: null,
    //       created_at: 2024-06-13T03:43:14.465Z,
    //       updated_at: 2024-06-13T03:43:14.465Z
    //     }
    //   ] 
}
test2()
*/


//////////////////////////



/*
 async function test3() {
    await db.sMSToken.create({
        data: {
            token: "121212",
            user: {
                connect: {
                    id: 3,
                }
            }
        }
    })
}
test3();
 */


/* 
async function test4() {
    const result = await db.sMSToken.findUnique({
        where: {
            token:"121212"
        }
    });
    console.log(result)
    // {
    //     id: 1,
    //     token: '121212',
    //     created_at: 2024-06-13T05:45:31.679Z,
    //     updated_at: 2024-06-13T05:46:35.678Z,
    //     userId: 3
    //   }
}
test4() 
*/

async function test5() {
    const result = await db.sMSToken.findUnique({
        where: {
            token:"121212"
        },
        include: {
            user: true // 실제 User 테이블의 내용을 포함하도록 해줌.
        }
    });
    console.log(result)
    // {
    //     id: 1,
    //     token: '121212',
    //     created_at: 2024-06-13T05:45:31.679Z,
    //     updated_at: 2024-06-13T05:46:35.678Z,
    //     userId: 3,
    //     user: {
    //       id: 3,
    //       username: 'nico',
    //       email: null,
    //       password: null,
    //       phone: null,
    //       github_id: null,
    //       avatar: null,
    //       created_at: 2024-06-13T04:14:14.028Z,
    //       updated_at: 2024-06-13T05:37:58.590Z
    //     }
    //   }
}
test5()

export default db;


