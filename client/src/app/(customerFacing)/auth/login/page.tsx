"use client"
import { signInUser } from "@/app/actions/authActions";
import { FormError } from "@/components/form-error";
import { FormSuccess } from "@/components/form-success";
import { Input } from "@/components/ui/input";
import { LoginUserInput, loginUserSchema } from "@/lib/auth";
import { zodResolver } from "@hookform/resolvers/zod";
import { signIn } from "next-auth/react";
import Link from "next/link";
import { useRouter, useSearchParams } from "next/navigation";
import { Result } from "postcss";
import { Suspense, useState } from "react";
import { SubmitHandler, useForm } from "react-hook-form";
import { toast } from "react-toastify";


export default function Login(){

  const router = useRouter();
  const methods = useForm<LoginUserInput>({
    resolver: zodResolver(loginUserSchema),
    defaultValues:{
      email:"",
      password:""
    }
  });

  const [error, setError] = useState('');
  const [message, setMessage] = useState('');

  const searchParams = useSearchParams();
  const callbackUrl = searchParams.get('callbackUrl') || '/basket';

  const {
    reset,
    handleSubmit,
    register,
    formState: { errors,isValid,isSubmitting },
  } = methods;

  const onSubmit = async (data:LoginUserInput) =>{
    const result = await signInUser(data);
    
    if(result.status === 'success'){
          setMessage("User logged in successfully")
          toast.success("User logged in successfully")
          router.push('/catalog')
    }else{
      const errorMessage = typeof result.error === 'string' ? result.error : 'An error occurred';
      console.log(errorMessage)
      setError(errorMessage)
    }

  }
    return(
        <section className="m-8 flex gap-4 bg-neutral-900" onSubmit={handleSubmit(onSubmit)}>
        <div className="w-full lg:w-3/5 mt-24">
        <div className="text-center">
          <h2  className="font-bold mb-4">Sign In</h2>
          <div color="blue-gray" className="text-lg font-normal">Enter your email and password to Sign In.</div>
        </div>
        <Suspense fallback={<>Loading...</>}>
        <form className="mt-8 mb-2 mx-auto w-80 max-w-screen-lg lg:w-1/2">
          <div className="mb-1 flex flex-col gap-6">
            <label  color="blue-gray" className="-mb-3 font-medium">
              Email
            </label>
            <Input
              {...register('email')}
              className="text-black"
              placeholder="name@website.com"
              />
            {errors['email'] && (
            <span className='text-red-500 text-xs block'>
            {errors['email']?.message as string}
            </span>
            )}
            <label className="-mb-3 font-medium">
              Password
            </label>
            <Input
             {...register('password')}
              type="password"
              className="text-black"
              placeholder="********"
              
            />
            {errors['password'] && (
          <span className='text-red-500 text-xs block mb-2'>
            {errors['password']?.message as string}
          </span>
          )}
          </div>
          <FormError message={error}/>
          <FormSuccess message={message}/>
          <button className="bg-white w-full h-12 text-black hover:bg-black hover:text-white hover:border  mt-6" type="submit" disabled={!isValid || isSubmitting}>
            {isSubmitting ? 'Loading...':'Sign In'}
          </button>

          <button onClick={() => signIn('google',{ callbackUrl: '/catalog' })} color="white" className="bg-white text-black w-full h-10  flex mt-6 items-center gap-2 justify-center shadow-md" type="button">
              <svg width="17" height="16" viewBox="0 0 17 16" fill="none" xmlns="http://www.w3.org/2000/svg">
                <g clipPath="url(#clip0_1156_824)">
                  <path d="M16.3442 8.18429C16.3442 7.64047 16.3001 7.09371 16.206 6.55872H8.66016V9.63937H12.9813C12.802 10.6329 12.2258 11.5119 11.3822 12.0704V14.0693H13.9602C15.4741 12.6759 16.3442 10.6182 16.3442 8.18429Z" fill="#4285F4" />
                  <path d="M8.65974 16.0006C10.8174 16.0006 12.637 15.2922 13.9627 14.0693L11.3847 12.0704C10.6675 12.5584 9.7415 12.8347 8.66268 12.8347C6.5756 12.8347 4.80598 11.4266 4.17104 9.53357H1.51074V11.5942C2.86882 14.2956 5.63494 16.0006 8.65974 16.0006Z" fill="#34A853" />
                  <path d="M4.16852 9.53356C3.83341 8.53999 3.83341 7.46411 4.16852 6.47054V4.40991H1.51116C0.376489 6.67043 0.376489 9.33367 1.51116 11.5942L4.16852 9.53356Z" fill="#FBBC04" />
                  <path d="M8.65974 3.16644C9.80029 3.1488 10.9026 3.57798 11.7286 4.36578L14.0127 2.08174C12.5664 0.72367 10.6469 -0.0229773 8.65974 0.000539111C5.63494 0.000539111 2.86882 1.70548 1.51074 4.40987L4.1681 6.4705C4.8001 4.57449 6.57266 3.16644 8.65974 3.16644Z" fill="#EA4335" />
                </g>
                <defs>
                  <clipPath id="clip0_1156_824">
                    <rect width="16" height="16" fill="white" transform="translate(0.5)" />
                  </clipPath>
                </defs>
              </svg>
              <span>Sign in With Google</span>
           </button>
          <div className="flex items-center justify-between gap-2 mt-6">
            <div className="font-medium text-gray-300">
              <Link href="#">
                Forgot Password?
              </Link>
            </div>
          </div>
          
          <p className="text-center text-blue-gray-500 font-medium mt-4">
            Not registered?
            <Link href="/auth/register" className="text-gray-300 ml-1">Create account</Link>
          </p>

          
        </form>
        </Suspense>

      </div>
      <div className="w-2/5 h-full hidden lg:block">
        <img
          src="/imgs/login.jpg"
          className="h-full w-full object-cover rounded-3xl"
        />
      </div>
     </section>
    )
}