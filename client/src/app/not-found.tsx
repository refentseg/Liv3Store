import Link from "next/link";
import Image from "next/image"

export default function NotFoundPage(){
    return(
        <>
         <div className="h-screen justify-center">
                <center className="mt-24 m-auto">
                <Image src="/illu/ufo.svg" alt="UFO illustration" width={200} height={200} />
                <div className=" tracking-widest mt-4">
                <span className="text-gray-500 text-6xl block"><span>4  0  4</span></span>
                <span className="text-gray-500 text-xl">Sorry, We couldn't find what you are looking for!</span>

                </div>
                </center>
                <center className="mt-6">
                <Link href="/" className="text-red-900 font-mono text-xl bg-white border p-3 rounded-md hover:shadow-md">Go back </Link>
                </center>
         </div>
        </>
    )
}