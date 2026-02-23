import React from 'react'

export default function AuthLayout({
  children,
}: Readonly<{children: React.ReactNode;}>)
 { return (
   <div style={{flex:1, width:'100%', height:'100%'}}>
        {children}
   </div>
  )
}

