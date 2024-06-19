import ListProduct from "@/components/list-product";
import ProductList from "@/components/product-list";
import db from "@/lib/db";
import { PlusIcon } from "@heroicons/react/24/solid";
import { Prisma } from "@prisma/client";
import Link from "next/link";

async function getInitialProducts() {
  const products = await db.product.findMany({
    select: { // 가져올 데이터의 필드를 선택함.
      title: true,
      price: true,
      created_at: true,
      photo: true,
      id: true,
    },
    take: 1, // 가져올 데이터의 개수를 지정함.
    orderBy: {
      created_at: "desc",
    }
  });
  return products;
}

export type InitialProducts = Prisma.PromiseReturnType<typeof getInitialProducts>; // Prisma.PromiseReturnType<typeof 함수명>: 해당 비동기 함수의 반환타입을 알아냄.




export default async function Products() {
  const initialProducts = await getInitialProducts();
  return (
    <div>
      {/* <Link href="/home/recent">최근 제품</Link> */}
      <ProductList initialProducts={initialProducts} />
      <Link href="/products/add" className="bg-orange-500 flex items-center justify-center rounded-full size-16 fixed bottom-24 right-8 text-white transition-colors hover:bg-orange-400">
        <PlusIcon className="size-10" />
      </Link>
    </div>
  )
}