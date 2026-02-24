import nodemailer from "nodemailer"
import {configDotenv} from 'dotenv'
import { NextResponse } from "next/server";
configDotenv()

const transporter = nodemailer.createTransport({
  host:'smtp.hostinger.com',
  port:465,
  secure: true,
  auth: {
    user: process.env.EMAIL_USER,
    pass: process.env.EMAIL_PASS,
  },
});
const htmlTemplate = (code:number)=>{
   return(`<!DOCTYPE html>
<html lang="en">
<head>
<meta charset="UTF-8" />
<meta name="viewport" content="width=device-width, initial-scale=1.0" />
<title>Njinga Verification Code</title>
<style>
  body {
    margin: 0;
    padding: 0;
    background-color: #f4f6f9;
    font-family: Arial, Helvetica, sans-serif;
  }

  .container {
    max-width: 600px;
    margin: 40px auto;
    background: #ffffff;
    border-radius: 12px;
    overflow: hidden;
    box-shadow: 0 10px 30px rgba(0,0,0,0.08);
  }

  .header {
    text-align: center;
    padding: 30px 20px 10px 20px;
  }

  .logo {
    max-width: 220px;
  }

  .content {
    padding: 30px 40px;
    text-align: center;
  }

  h1 {
    margin: 0 0 15px 0;
    font-size: 24px;
    color: #111827;
  }

  p {
    font-size: 16px;
    color: #4b5563;
    line-height: 1.6;
  }

  .code-box {
    margin: 30px 0;
    padding: 20px;
    font-size: 32px;
    font-weight: bold;
    letter-spacing: 8px;
    color: #111827;
    background: #f9fafb;
    border-radius: 10px;
    border: 2px dashed #e5e7eb;
  }

  .footer {
    padding: 20px 40px 30px 40px;
    font-size: 13px;
    color: #9ca3af;
    text-align: center;
  }

  .highlight {
    color: #e11d48;
    font-weight: bold;
  }
  .logo-container {
  display: flex;
  align-items: center;
  gap: 20px;
}

/* Flag Circle */
.flag {
  width: 90px;
  height: 90px;
  border-radius: 50%;
  overflow: hidden;
  position: relative;
  border: 2px solid #000;
}

/* Top Red */
.flag-top {
  height: 50%;
  background: #ce1126;
}

/* Bottom Black */
.flag-bottom {
  height: 50%;
  background: #000000;
}

/* Yellow Symbol (Simplified Hammer & Star Shape) */
.symbol {
  position: absolute;
  width: 50px;
  height: 50px;
  background: #fcd116;
  border-radius: 50%;
  top: 20px;
  left: 20px;
  clip-path: polygon(
    50% 0%, 
    60% 30%, 
    100% 35%, 
    70% 55%, 
    80% 100%, 
    50% 75%, 
    20% 100%, 
    30% 55%, 
    0% 35%, 
    40% 30%
  );
}

/* Text */
.text h1 {
  margin: 0;
  font-size: 42px;
  letter-spacing: 2px;
  font-weight: 700;
}

.nj {
  color: #fcd116;
}

.text h1 {
  color: #000;
}

.text p {
  margin: 5px 0 0 0;
  font-size: 14px;
  color: #777;
}
  .logos{
     width:50px;
     height:50px
  }
    .jstyle{
      color:red;
    }
  @media screen and (max-width: 600px) {
    .content {
      padding: 25px;
    }
  }
</style>
</head>

<body>

  <div class="container">

    <div class="header">
      <div class="logo-container">
    <div>
      <img class="logos" src='https://r2-worker.isidrozau100.workers.dev/angola-flag-png.png'/>
    </div>

    <div class="text">
      <h1><span class="nj">N</span><span class="jstyle">J</span>INGA</h1>
      <p>Portal de registo digital de casas</p>
    </div>
  </div>
    </div>

    <div class="content">
      <h1>Verify Your Account</h1>
      <p>
        Welcome to <strong>Njinga</strong> — your digital house registration portal.
      </p>

      <p>
        Please use the verification code below to complete your sign-in process:
      </p>

      <div class="code-box">
        ${code}
      </div>

      <p>
        This code will expire in <span class="highlight">10 minutes</span>.
      </p>

      <p>
        If you did not request this code, you can safely ignore this email.
      </p>
    </div>

    <div class="footer">
      © 2026 Njinga. All rights reserved.<br />
      Portal de registo digital de casas
    </div>

  </div>

</body>
</html>`)
}
async function sendEmails(code:number,email:string){
    await transporter.sendMail({
        from:process.env.EMAIL_USER,
        to:email,
        subject:'Codigo de Verificacao da NJINGA',
        html:`${htmlTemplate(code)}`,
    })
}
export async function POST(request:Request){
    try {
        const data = await request.json();
        const {email} = data;
        const generatecode = Math.floor(Math.random() * 9999) + 1000;
        sendEmails(generatecode, email)
        console.log(email)
        return NextResponse.json({res:generatecode, message:'success'}); 
    } catch (error) {
         return NextResponse.json({res:false, message:false}); 
    }
    

}