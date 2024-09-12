import { ActionResult } from '@/types'
import clsx from 'clsx'
import { CircleCheck, CircleX, Loader2 } from 'lucide-react'
import React from 'react'

type Props ={
    result:ActionResult<string> | null
}

export default function ResultMessage({result}:Props) {
    if(!result){
        return <Loader2 className="animate-spin" size={32} />
    }
    const textColorClass = result.status === 'success' ? 'text-green-500' : 'text-red-500';
  return (
    <div className={clsx('p-3 rounded-xl w-full flex items-center justify-center gap-x-2 text-sm mb-5',{
        'text-danger-900 bg-danger-50':result.status =='error',
        'text-success-800 bg-success-50':result.status =='success'
    })}>
      {result.status === 'success'?(
        <CircleCheck className='text-green-500' size={32}/>
      ):(
        <CircleX className='text-red-500' size={32}/>
      )
      }
      <p className={textColorClass}>{result.status === 'success'? result.data:result.error as string}</p>
    </div>
  )
}
