import { z } from "zod";

export const productSchema = z.object({
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
    }),
})


export type ProductType = z.infer<typeof productSchema> // zod.infer<typeof 스키마>: 해당 스키마로부터 타입을 추론해서 가져옴.