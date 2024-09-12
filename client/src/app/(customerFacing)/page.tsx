import { Button } from "@/components/ui/button";
import { ToastContainer } from "react-toastify";

export default function HomePage(){
    return(
        <main className="h-[100vh] overflow-y-hidden">
        <div className="relative h-screen mt-[60px] md:mt-0">
          <img
            src="/hero/punk.jpg"
            alt="Featured Collection"
            className="relative h-screen w-screen md:w-full md:h-full object-cover object-center lg:object-top"
          />
          <div className="absolute inset-0 bg-black bg-opacity-50 flex flex-col items-center justify-center text-center">
            <h1 className="text-5xl font-bold tracking-tight text-white sm:text-6xl mb-4">
              REDEFINE STYLE
            </h1>
            <p className="text-xl text-gray-300 max-w-xl mb-8">
              Discover our latest collection that pushes the boundaries of fashion
            </p>
            <a
              href="/catalog"
              className="bg-white text-black px-8 py-3 text-lg font-semibold hover:bg-gray-200 transition duration-300"
            >
              Explore Now
            </a>
          </div>
        </div>
         
       </main>
    )
}