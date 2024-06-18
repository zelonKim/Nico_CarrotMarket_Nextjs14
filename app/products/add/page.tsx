"use client";

import FormButton from "@/components/form-btn";
import FormInput from "@/components/form-input";
import { PhotoIcon } from "@heroicons/react/24/solid";
import { useState } from "react";
import { uploadProduct } from "./actions";
// import { getUploadUrl, uploadProduct } from "./actions";
import { useFormState } from "react-dom";
import { useForm } from "react-hook-form";
import { zodResolver } from "@hookform/resolvers/zod";
import { ProductType, productSchema } from "./schema";




// File System을 통한 이미지 처리

export default function AddProduct() {
    const [preview, setPreview] = useState("");
    const [uploadUrl, setUploadUrl] = useState("");

    const onImageChange = (event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = event;
        if(!files) {
            return;
        }
        const file = files[0];
        const url = URL.createObjectURL(file); // URL.createObjectURL(파일): 해당 파일을 브라우저의 메모리에 업로드한 후, 그 URL을 반환함.
        console.log(url); // blob:http://localhost:3000/6e5452bc-1f71-4cb5-bc15-706bdde5647d
        setPreview(url);
    };

    const [state, action] = useFormState(uploadProduct, null);

    return (
        <div>
            <form action={action} className="p-5 flex flex-col gap-5">
                <label 
                    htmlFor="photo" 
                    className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
                    style={{ backgroundImage: `url(${preview})` }} 
                >
                    {preview === "" ? 
                        <>
                        <PhotoIcon className="w-20" />
                        <div className="text-neutral-400 text-sm"> 사진을 추가해주세요. {state?.fieldErrors.photo} </div> 
                        </>
                    : null}
                </label>
                <input onChange={onImageChange} type="file" id="photo" name="photo" accept="image/*" className="hidden" />
                
                <FormInput name="title" required placeholder="제목" type="text" errors={state?.fieldErrors.title} />
                <FormInput name="price" type="number" required placeholder="가격" errors={state?.fieldErrors.price}/>
                <FormInput name="description" type="text" required placeholder="자세한 설명" errors={state?.fieldErrors.description}/>
                <FormButton text="작성 완료" />
            </form>
        </div>
    )
}



///////////////////////////




/*
// CloudFlare를 통한 이미지 처리

 export default function AddProduct() {
  const [preview, setPreview] = useState("");
  const [uploadUrl, setUploadUrl] = useState("");
  const [photoId, setImageId] = useState("");

  const onImageChange = async (event: React.ChangeEvent<HTMLInputElement>) => {
    const {
      target: { files },
    } = event;
    if (!files) {
      return;
    }
    const file = files[0];
    const url = URL.createObjectURL(file);
    setPreview(url);

    const { success, result } = await getUploadUrl();
    if (success) {
      const { id, uploadURL } = result;
      setUploadUrl(uploadURL);
      setImageId(id);
    }
  };

  const interceptAction = async (_: any, formData: FormData) => {
    const file = formData.get("photo");
    if (!file) {
      return;
    }
    const cloudflareForm = new FormData();
    cloudflareForm.append("file", file);

    const response = await fetch(uploadUrl, {
      method: "post",
      body: cloudflareForm,
    });

    if (response.status !== 200) {
      return;
    }

    const photoUrl = `https://imagedelivery.net/aSbksvJjax-AUC7qVnaC4A/${photoId}`;
    formData.set("photo", photoUrl);
    return uploadProduct(_, formData);
  };

  const [state, action] = useFormState(interceptAction, null);

  return (
    <div>
      <form action={action} className="p-5 flex flex-col gap-5">
        <label
          htmlFor="photo"
          className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
          style={{
            backgroundImage: `url(${preview})`,
          }}
        >
          {preview === "" ? (
            <>
              <PhotoIcon className="w-20" />
              <div className="text-neutral-400 text-sm">
                사진을 추가해주세요.
                {state?.fieldErrors.photo}
              </div>
            </>
          ) : null}
        </label>
        <input
          onChange={onImageChange}
          type="file"
          id="photo"
          name="photo"
          accept="image/*"
          className="hidden"
        />
        <FormInput
          name="title"
          required
          placeholder="제목"
          type="text"
          errors={state?.fieldErrors.title}
        />
        <FormInput
          name="price"
          type="number"
          required
          placeholder="가격"
          errors={state?.fieldErrors.price}
        />
        <FormInput
          name="description"
          type="text"
          required
          placeholder="자세한 설명"
          errors={state?.fieldErrors.description}
        />
        <FormButton text="작성 완료" />
      </form>
    </div>
  );
} 
*/




//////////////////////////



// CloudFlare를 통한 이미지 처리 + React Hook Form

/*
export default function AddProduct() {
    const [preview, setPreview] = useState("");
    const [uploadUrl, setUploadUrl] = useState("");
    const [photoId, setPhotoId] = useState("");
    const [file, setFile] = useState<File|null>(null);

    const { register, handleSubmit, setValue, setError, formState:{errors} } = useForm<ProductType>({
        resolver: zodResolver(productSchema), // zodResolver(스키마): 유효성 검사의 결과를 받아옴.
    })

    const onImageChange = async(event: React.ChangeEvent<HTMLInputElement>) => {
        const {
            target: { files },
        } = event;
        if(!files) {
            return;
        }
        const file = files[0];
        const url = URL.createObjectURL(file); 
        setPreview(url);
        setFile(file);

        const {success, result} = await getUploadUrl();
        if(success) {
            const {id, uploadURL} = result;
            setUploadUrl(uploadURL);
            setValue("photo", `https://imagedelivery.net/juWL4wJkg2RvbQ4iiA59DQ/${id}`);
        }
    };


    const onSubmit = handleSubmit(async (data: ProductType) => {
        if(!file) {
            return;
        }
        const cloudflareForm = new FormData();
        cloudflareForm.append("file", file);

        const response = await fetch(uploadUrl, {
            method: "post",
            body: cloudflareForm
        })
        if(response.status !== 200){
            return;
        }
        
        const formData = new FormData();
        formData.append("title", data.title)
        formData.append("price", data.price + "")
        formData.append("description", data.description)
        formData.append("photo", data.photo)
        const errors = await uploadProduct(formData);
        if(errors) {
            // setError("");
        }
    })

    const onValid = async() => {
        await onSubmit()
    }

    return (
        <div>
            <form action={onValid}  className="p-5 flex flex-col gap-5">
                <label 
                    htmlFor="photo" 
                    className="border-2 aspect-square flex items-center justify-center flex-col text-neutral-300 border-neutral-300 rounded-md border-dashed cursor-pointer bg-center bg-cover"
                    style={{ backgroundImage: `url(${preview})` }} 
                >
                    {preview === "" ? 
                        <>
                        <PhotoIcon className="w-20" />
                        <div 
                            className="text-neutral-400 text-sm"> 
                            사진을 추가해주세요. 
                            <br />
                            <span className="text-red-500 font-medium">{errors.photo?.message} </span>
                        </div> 
                        </>
                    : null}
                </label>
                <input 
                    onChange={onImageChange} 
                    type="file"
                    id="photo" 
                    name="photo" 
                    accept="image/*" 
                    className="hidden"
                />
                <FormInput 
                    required 
                    placeholder="제목"
                     type="text" 
                     errors={[errors.title?.message ?? ""]}
                     {...register("title")} 
                />
                <FormInput 
                    type="number" 
                    required 
                    placeholder="가격" 
                    errors={[errors.price?.message ?? ""]}
                    {...register("price")}
                />
                <FormInput 
                    type="text" 
                    required 
                    placeholder="자세한 설명"
                    errors={[errors.description?.message ?? ""]}
                    {...register("description")}
                />
                <FormButton text="작성 완료" />
            </form>
        </div>
    )
}
*/