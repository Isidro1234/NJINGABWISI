import createMiddleware from 'next-intl/middleware'

export default createMiddleware({
  locales: ['pt','en' , 'ar', 'zh', 'yo' , 'vt', 'fr'],
  defaultLocale: 'pt'   
})

export const config = {
  matcher: ['/((?!api|_next|.*\\..*).*)']
}