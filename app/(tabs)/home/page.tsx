import ListProduct from "@/components/list-product";
import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import { unstable_cache as nextCache, revalidatePath } from "next/cache";
import Link from "next/link";

const getCachedProducts = nextCache(
  getInitialProducts, // 2. 이전에 캐시된 데이터가 없을 경우, 해당 함수로 데이터베이스에 접근함.
  ["home-products"] // 1. ['키']와 일치하는 이전에 캐시된 데이터를 찾음.
  // { revalidate: 30 } // 해당 시간(초)가 흐른 뒤, 새로운 request가 있을 경우, 다시 데이터베이스에 접근해서 최신 데이터를 가져옴.
);

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: {
      // 가져올 데이터의 필드를 선택함.
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    // take: 1, // 가져올 데이터의 개수를 지정함.
    orderBy: {
      created_at: "desc",
    },
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<
  typeof getInitialProducts
>; // Prisma.PromiseReturnType<typeof 함수명>: 해당 비동기 함수의 반환타입을 알아냄.

export const metadata = { title: "Home" };

// export const dynamic = "force-dynamic"; // 해당 URL을 빌드할때 dynamic으로 구성함으로써, 새로고침하거나 revalidate할때 모두 데이터베이스에 접근하도록 함.
// export const dynamic = "force-static"; // 해당 URL을 빌드할때 static으로 구성함으로써, revalidate할때만 데이터베이스에 접근하도록 함.
// export const dynamic = "auto"; // (기본값) 해당 URL을 빌드할때 Next.js가 자동적으로 구성하도록 함.

export const revalidate = 60; // 해당 시간(초)가 흐른 뒤, revalidate해줌.

export default async function Products() {
  const initialProducts = await getInitialProducts();
  const revalidate = async () => {
    "use server";
    revalidatePath("/home"); // 해당 URL경로의 모든 캐시에 대해 최신 데이터를 가져옴.
  };

  return (
    <div>
      <ProductList initialProducts={initialProducts} />
      <form action={revalidate}>
        <button>전체 갱신</button>
      </form>
      <Link
        href="/products/add"
        className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400"
      >
        <PlusIcon className="size-10" />
      </Link>
    </div>
  );
}
