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


export const metadata: Metadata = {
  manifest: '/manifest.json',
  appleWebApp: {
    capable: true,
    statusBarStyle: 'default',
    title: 'Njinga',
  },
  icons: {
    apple: [
      { url: 'https://njinga-worker.njinga.workers.dev/icon-180.png', sizes: '180x180' },
    ],
    icon: [
      { url: 'https://njinga-worker.njinga.workers.dev/angola-flag-png.png', sizes: '192x192' },
      { url: 'https://njinga-worker.njinga.workers.dev/angola-flag-png.png', sizes: '512x512' },
    ],
  },
  title: "NJINGA | Página Inicial",
  description: `Plataforma digital de regulamentação de imóveis em Angola:
registe o seu imóvel, crie o seu UIP/PIU, pague os seus impostos 
e conecte-se à inovação tecnológica do país`,
  keywords:["imoveis", "angola", "registo","impostos","UIP"],
  openGraph:
    {
      images:['https://njinga-worker.njinga.workers.dev/photo.png'] , 
      description:`Plataforma digital de regulamentação de imóveis em Angola:
registe o seu imóvel, crie o seu UIP/PIU, pague os seus impostos 
e conecte-se à inovação tecnológica do país`,
      title:'NJINGA – Portal Imobiliário de Angola',  
  },
  twitter:{
    images:['https://njinga-worker.njinga.workers.dev/photo.png'],
    description:`Plataforma digital de regulamentação de imóveis em Angola:
registe o seu imóvel, crie o seu UIP/PIU, pague os seus impostos 
e conecte-se à inovação tecnológica do país`,
    title:'NJINGA – Portal Imobiliário de Angola'
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
