import type { Metadata } from "next";
import { Geist, Geist_Mono, Inter } from "next/font/google";
import "./globals.css";
import {Provider} from '../../components/ui/provider'
import dynamic from "next/dynamic";
import "stream-chat-react/dist/css/v2/index.css";
import { NotificationProvider } from "@/context/notificationContext";
import { NextIntlClientProvider } from "next-intl";
import { getMessages } from "next-intl/server";


const  AuthContextProvider= dynamic(
  () => import("../../context/authContext"),
);
const  Navbar = dynamic(
  () => import("../../components/custom/Navbar"),
 
);
const   TopNavbar = dynamic(
  () => import("../../components/custom/TopNavbar"),

);
const geistSans = Geist({
  variable: "--font-geist-sans",
  subsets: ["latin"],
});

const inter = Inter({
  variable: "--font-Inter",
  weight:['100','200','300','400','500','600','700','800','900'],
  subsets: ["latin"],
});

export const metadata2: Metadata = {
  title: "Njinga | Pagina Inicial",
  description: "Plataforma digital de regulamentacao de imoveis em Angola",
};
export const metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Njinga',
  },
}

export default async function RootLayout({
  children,
  params
}: {
  children: React.ReactNode
  params: Promise<{ locale: string }>
}) {

  const { locale } = await params
  const messages = await getMessages()
  return (
    <html lang={locale} suppressHydrationWarning>
      <body
        className={inter.className}
      >
        <NextIntlClientProvider messages={messages}>
            <AuthContextProvider>
        
            <Provider>
              <NotificationProvider>     
                  <TopNavbar/>
                  <Navbar name={undefined} image={undefined} islogged={false}/>
                  {children}
            
              </NotificationProvider>
            </Provider>
          
              
          </AuthContextProvider>
        </NextIntlClientProvider>
       
      </body>
    </html>
  );
}
