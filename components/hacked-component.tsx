"use client"; // 클라이언트 컴포넌트

import { fetchFromAPI } from "@/app/extras/actions"; 

export default function HackedComponent({data}: any) {
    fetchFromAPI();
    return <h1>hacked</h1>;
}