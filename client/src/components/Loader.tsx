
import { OrbitProgress } from "react-loading-indicators";
interface Props {
    message?: string;
  }

export default function LoadingComponent({message}:Props){
    return(
        <div className="flex flex-col items-center justify-center min-h-screen text-center">
            <OrbitProgress variant="split-disc" color="#cf1324" size="medium" text="" textColor="" />
            {message && <p className="loading-message">{message}</p>}
        </div>
    )   
}