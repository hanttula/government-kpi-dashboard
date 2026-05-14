export { default } from 'next-auth/middleware'

export const config = {
  // Only protect the /dashboard route — everything else is public
  matcher: ['/dashboard/:path*'],
}
