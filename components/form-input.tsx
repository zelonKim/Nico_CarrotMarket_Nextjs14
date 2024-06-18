import { ForwardedRef, InputHTMLAttributes, forwardRef } from "react";

interface FormInputProps {
  name: string;
  errors?: string[];
}

const _FormInput = ({ name, errors=[], ...rest }: FormInputProps & InputHTMLAttributes<HTMLInputElement>, ref: ForwardedRef<HTMLInputElement>) => {
  return (
    <div className="flex flex-col gap-2">
        <input
          ref={ref}
          name={name}
          className="bg-transparent rounded-md w-full h-10 focus:outline-none ring-1 focus:ring-4 transition ring-neutral-200 focus:ring-orange-500 border-none placeholder:text-neutral-400"
          {...rest}
        />
        {errors.map((error, index) => (
            <span key={index} className="text-red-500 font-medium"> {error} </span>
        ))}
      </div>
    );
}

export default forwardRef(_FormInput); // forwardRef(컴포넌트명): Let your component expose a DOM node to a parent component using a ref.