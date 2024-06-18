"use server"

import { File } from "buffer";
import fs from "fs/promises";
import db from "@/lib/db";
import getSession from "@/lib/session";
import { redirect } from "next/navigation";
import { z } from "zod";
//import { productSchema } from "./schema";



// File System을 통한 이미지 처리

const productSchema = z.object({
    photo: z.string({
        required_error: "Photo is required",
    }),
    title: z.string({
        required_error: "Title is required",
    }),
    description: z.string({
        required_error: "Description is required",
    }),
    price: z.coerce.number({
        required_error: "Price is required",
    })
})


export async function uploadProduct(_:any, formData: FormData) {
    const data = {
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description")
    }


    if(data.photo instanceof File) {
        const photoData = await data.photo.arrayBuffer(); // await blob.arrayBuffer(): 블롭을 일반적인 raw 바이너리 데이터 버퍼로 나타내줌.
        console.log(photoData);
            // ArrayBuffer {
            //     [Uint8Contents]: <ff d8 ff db 00 43 00 02 01 01 01 01 01 02 01 01 01 02 02 02 02 02 04 03 02 02 02 02 05 04 04 03 04 06 05 06 06 06 05 06 06 06 07 09 08 06 07 09 07 06 06 08 0b 08 09 0a 0a 0a 0a 0a 06 08 0b 0c 0b 0a 0c 09 0a 0a 0a ff db 00 43 01 02 02 02 02 02 02 05 03 03 05 0a 07 06 07 0a 0a 0a 0a 0a 0a 0a 0a 0a 0a ... 96127 more bytes>,
            //     byteLength: 96227
            // }
        await fs.appendFile(`./public/${data.photo.name}`, Buffer.from(photoData)) // fs.appendFile(경로, 데이터): 해당 경로에 해당 데이터가 담긴 파일을 생성해줌.
       
        data.photo = `/${data.photo.name}`;
    } 


    const result = productSchema.safeParse(data);

    if(!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if(session.id) {
            const product = await db.product.create({
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    price: result.data.price,
                    photo: result.data.photo,
                    user: {
                        connect: {
                            id: session.id
                        }
                    }
                },
                select: {
                    id: true
                }
            })
            redirect(`/products/${product.id}`)
        }
    }
} 




///////////////////////////////////////




/* 
// CloudFlare를 통한 이미지 처리

export async function uploadProduct(_:any, formData: FormData) {
    const data = {
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description")
    }

    const result = productSchema.safeParse(data);

    if(!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if(session.id) {
            const product = await db.product.create({
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    price: result.data.price,
                    photo: result.data.photo,
                    user: {
                        connect: {
                            id: session.id
                        }
                    }
                },
                select: {
                    id: true
                }
            })
            redirect(`/products/${product.id}`)
        }
    }
}



export async function getUploadUrl() {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/images/v2/direct_upload`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.CF_API_TOKEN}`
            },    
        }    
    );
    const data = await response.json();
    return data;
}
 */


///////////////////



// CloudFlare를 통한 이미지 처리 + React Hook Form
/* 
export async function uploadProduct(formData: FormData) {
    const data = {
        photo: formData.get("photo"),
        title: formData.get("title"),
        price: formData.get("price"),
        description: formData.get("description")
    }

    const result = productSchema.safeParse(data);

    if(!result.success) {
        return result.error.flatten();
    } else {
        const session = await getSession();
        if(session.id) {
            const product = await db.product.create({
                data: {
                    title: result.data.title,
                    description: result.data.description,
                    price: result.data.price,
                    photo: result.data.photo,
                    user: {
                        connect: {
                            id: session.id
                        }
                    }
                },
                select: {
                    id: true
                }
            })
            redirect(`/products/${product.id}`)
        }
    }
}


export async function getUploadUrl() {
    const response = await fetch(`https://api.cloudflare.com/client/v4/accounts/${process.env.CF_ACCOUNT_ID}/images/v2/direct_upload`,
        {
            method: "POST",
            headers: {
                Authorization: `Bearer ${process.env.CF_API_TOKEN}`
            },    
        }    
    );
    const data = await response.json();
    return data;
} */