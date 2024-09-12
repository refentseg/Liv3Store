import { veifyEmail } from '@/app/actions/authActions'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Loader2, Mail } from 'lucide-react';
import React, { useState } from 'react'
import ResultMessage from '@/components/ResultMessage';
import { ActionResult } from '@/types';

export default async function VerifyEmail({searchParams}:{searchParams:{token:string}}) {
    const result = await veifyEmail(searchParams.token);
  return (
    <div>
        <div className='mt-[110px]'>
            <h1 className="text-2xl font-semibold mb-4">Verification</h1>
        </div>
        <div className='w-auto mb-6 rounded-lg bg-neutral-950 p-6 shadow-md md:justify-center'>
            <div className='flex flex-col space-y-4 items-center'>
                <div className="flex flex-row items-center">
                    <p>Verifying your email address. Please wait...</p>
                </div>
                <div>
                    <ResultMessage result={result}/>
                    <a
                    href="/auth/login"
                    className="ml-4 bg-white rounded-full text-black px-8 py-3 text-md font-semibold hover:bg-gray-300 transition duration-300 mt-10 items-center justify-center"
                    >
                    Go Back
                    </a>
                </div>
            </div>
        </div>
        
    </div>
  )
}
