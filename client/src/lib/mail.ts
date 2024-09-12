
import { NextApiRequest, NextApiResponse } from 'next';
import {Resend} from 'resend'
import WelcomeEmail from '@/emails/verify';
import { SES } from '@aws-sdk/client-ses';
import { render } from '@react-email/components';

const resend = new Resend(process.env.RESEND_API_KEY);

const SES_CONFIG = {
    accessKeyId: process.env.AWS_ACCESS_KEY,
    secretAccessKey:process.env.AWS_SECRET_ACCESS_KEY,
    region:process.env.AWS_SES_REGION
}

const ses = new SES(SES_CONFIG)

//using resend

// export async function sendVerificationEmail(email:string,token:string,user:string|''){
//     const link = `http://localhost:3000/auth/verify-email?token=${token}`;
//     return resend.emails.send({
//         from:'testing@resend.dev',
//         to:email,
//         subject:'Verify your email address',
//         react:WelcomeEmail({userFirstname:user,url:link})
//     })
// }

//Using AWS SES
export async function sendVerificationEmail(email:string,token:string,user:string|''){
    const link = `http://localhost:3000/auth/verify-email?token=${token}`;
    const htmlContent = render(WelcomeEmail({userFirstname:user,url:link}));
    
    const params = {
        Source: 'no-reply@liv3.online', // Replace with your verified SES email/domain
        Destination: {
            ToAddresses: [email],
        },
        Message: {
            Subject: {
                Data: 'Verify your email address',
                Charset: 'UTF-8',
            },
            Body: {
                Html: {
                    Data: htmlContent,
                    Charset: 'UTF-8',
                },
            },
        },
    };

    await ses.sendEmail(params);
}