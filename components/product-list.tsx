/* "use client"

import { useState } from "react";
import ListProduct from "./list-product";
import {InitialProducts} from "@/app/(tabs)/products/page";
import { getMoreProducts } from "@/app/(tabs)/products/actions";

interface ProductListProps {
  initialProducts: InitialProducts
}

export default function ProductList({initialProducts}: ProductListProps) {
    const [products, setProducts] = useState(initialProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);

    const onLoadMoreClick = async() => {
      setIsLoading(true);
      const newProducts = await getMoreProducts(page + 1);

      if(newProducts.length !== 0) {
        setPage((prev) => prev + 1);
        setProducts(prev => [...prev, ...newProducts]);
      } else {
        setIsLastPage(true);
      }
      setIsLoading(false);
    }

  return(
        <div className="p-5 flex flex-col gap-5">
          {products.map((product) => (
            <ListProduct key={product.id} {...product} />
          ))}
          {isLastPage ? null : (<button
            onClick={onLoadMoreClick}
            disabled={isLoading}
            className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95">
            {isLoading ? "로딩 중" : "더 보기"}
          </button>
          )}
        </div>
      );
} */


///////////////////


"use client"

import { useEffect, useRef, useState } from "react";
import ListProduct from "./list-product";
import {InitialProducts} from "@/app/(tabs)/products/page";
import { getMoreProducts } from "@/app/(tabs)/products/actions";

interface ProductListProps {
  initialProducts: InitialProducts
}

export default function ProductList({initialProducts}: ProductListProps) {
    const [products, setProducts] = useState(initialProducts);
    const [isLoading, setIsLoading] = useState(false);
    const [page, setPage] = useState(0);
    const [isLastPage, setIsLastPage] = useState(false);

    const trigger = useRef<HTMLSpanElement>(null); 

    useEffect(() => {
      const observer = new IntersectionObserver( // new IntersectionObserver(관찰하는 요소에 대한 콜백함수, 관찰 옵션): 관찰자 객체를 생성함.
        async (entries: IntersectionObserverEntry[], observer: IntersectionObserver) => 
          { // 콜백함수의 첫번째 매개변수에는 '관찰하는 요소들에 대한 정보'가 담김.
            // 콜백함수의 두번째 매개변수에는 '관찰자 객체'가 담김.

          console.log(entries);

          const element = entries[0];
            if(element.isIntersecting && trigger.current) { // 요소가 화면에 보일 경우 isIntersecting 속성은 true값을 가짐.
              observer.unobserve(trigger.current); // 관찰자 객체.unobserve(요소): 해당 요소에 대한 관찰을 멈춤.
              setIsLoading(true);

              const newProducts = await getMoreProducts(page + 1);
              if(newProducts.length !== 0) {
                setPage((prev) => prev + 1);
                setProducts(prev => [...prev, ...newProducts]);
              } else {
                setIsLastPage(true);
              }
              setIsLoading(false);
            }
          }, 
          {
            threshold: 1.0, // 요소의 전체가 보일때 콜백함수를 실행함.
            rootMargin: "0px 0px -100px 0px"
          }
      )

        if(trigger.current) {
            observer.observe(trigger.current); //  관찰자 객체.observe(요소): 해당 요소를 관찰함.
          }

          return () => { // 
            observer.disconnect(); //  관찰자 객체.disconnect(): 관찰을 종료함.
          }
    }, [page])



  return(
        <div className="p-5 flex flex-col gap-5">
          {products.map((product) => (
            <ListProduct key={product.id} {...product} />
          ))}
          <span 
            ref={trigger}
            // style={{marginTop: `${page +1 * 900} vh`}}
            className="text-sm font-semibold bg-orange-500 w-fit mx-auto px-3 py-2 rounded-md hover:opacity-90 active:scale-95">
            {isLoading ? "로딩 중" : "더 보기"}
          </span>
        </div>
      );
}