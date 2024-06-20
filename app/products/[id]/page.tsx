import db from "@/lib/db";
import getSession from "@/lib/session";
import { formatToDollar } from "@/lib/utils";
import { UserIcon } from "@heroicons/react/24/solid";
import Image from "next/image";
import Link from "next/link";
import { notFound } from "next/navigation";
import { unstable_cache as nextCache, revalidateTag } from "next/cache";


async function getIsOwner(userId: number) {
    // const session = await getSession();
    // if(session.id) {
    //     return session.id === userId
    // }
    return false;
}

/*
async function getProduct(id: number) {
  fetch("https://api.com", { 
    next: { // unstable_cache()의 options 인수를 지정할 수 있음.
      revalidate: 30,
      tags: ['hello']
    }
  })
}
*/


async function getProduct(id: number) {
  console.log("product");
    const product = await db.product.findUnique({
        where: {
            id,
        },
        include: {
            user: {
                select: {
                    username: true,
                    avatar: true
                }
            }
        }
    })
    return product;
}

const getCachedProduct = nextCache(
  getProduct,
  ['product-detail'],
  { tags: ['product-detail'] }
)


///////////////



async function getProductTitle(id: number) {
  console.log("title")
  const product = await db.product.findUnique({
      where: {
          id,
      },
      select: {
        title: true,
      },
  })
  return product;
}

const getCachedProductTitle = nextCache(
  getProductTitle,
  ['product-title'],
  { tags: ['product-title']}
)


////////////////



export async function generateMetadata({params}: {params:{id:string}}) {
  const product = await getCachedProductTitle(Number(params.id));
  return {
    title: product?.title,
  }
}


////////////////////////



export default async function ProductDetail({params}: {params:{id:string}}) {
    const id = Number(params.id); // Number(스트링 타입의 숫자값): 해당 '스트링 타입의 숫자값'을 '넘버 타입의 숫자값'으로 변환해줌. // 단, 인수가 숫자값이 아닐 경우에는 NaN (Not a Number)을 반환함.
    if(isNaN(id)) { 
        return notFound();
    }

    const product = await getCachedProduct(id);
    if(!product) {
        return notFound();
    }

    const isOwner = await getIsOwner(product.userId);
 
    const revalidate = async() => {
      "use server";
      revalidateTag('product-title') // revalidateTag('태그명'): 해당 태그의 캐시에 대해서만 최신 데이터를 가져옴.
    }



    return (
        <div>
          <div className="relative aspect-square">
            <Image fill className="object-cover" src={`${product.photo}`} alt={product.title} />
          </div>
          <div className="p-5 flex items-center gap-3 border-b border-neutral-700">
            <div className="size-10 overflow-hidden rounded-full">
              {product.user.avatar !== null ? (
                <Image
                  src={product.user.avatar}
                  width={40}
                  height={40}
                  alt={product.user.username}
                /> // <Image>컴포넌트는 필수 속성으로서 너비(width)와 높이(height)를 지정해줘야 함.
              ) : (
                <UserIcon />
              )}
            </div>
            <div>
              <h3>{product.user.username}</h3>
            </div>
          </div>
          <div className="p-5">
            <h1 className="text-2xl font-semibold">{product.title}</h1>
            <p>{product.description}</p>
          </div>
          <div className="fixed w-full bottom-0 left-0 p-5 pb-10 bg-neutral-800 flex justify-between items-center">
            <span className="font-semibold text-xl">
              {formatToDollar(product.price)}$
            </span>
            {/* {isOwner ? ( */}
              <form action={revalidate}>
                <button className="bg-red-500 px-5 py-2.5 rounded-md text-white font-semibold">
                  상단 제목만 갱신
                </button>
              </form>
            {/* ) : null} */}
            <Link
              className="bg-orange-500 px-5 py-2.5 rounded-md text-white font-semibold"
              href={``}
            >
              채팅하기
            </Link>
          </div>
        </div>
      );
    }


export const dynamicParams = true; // (기본값) pregenerated되지 않은 페이지들을 동적으로 생성해줌.
// export const dynamicParams = false; // pregenerated되지 않은 페이지들을 동적으로 생성해주지 않음.


export async function generateStaticParams() {  // 빌드할때 해당 URL경로를 Static Site Generation (SSG)으로 구성해줌.
  const products = await db.product.findMany({
    select: {
      id: true,
    }
  })
   // ProductDetail()함수의 인수로 전달될 수 있는 값을 배열로 반환해줌.
  return products.map(product => ({id: product.id+""}))
}