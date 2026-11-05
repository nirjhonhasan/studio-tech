import { NextResponse } from 'next/server'
import type { NextRequest } from 'next/server'
import { auth } from './lib/auth'


export async function proxy(request: NextRequest) {

  const session = await auth.api.getSession({
    headers: request.headers
  })
  const user = session?.user;
  if(!user){
    return NextResponse.redirect(new URL('/login', request.url))
  }

  
}

export const config = {
   matcher: [
    '/add-studio',
    '/my-bookings',
    '/my-listings',
    '/dashboard',
    '/studios/:path*',
  ],
}