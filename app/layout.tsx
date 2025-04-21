import './globals.css'

export const metadata = {
  title: 'Legal cases',
  description: 'A cool project',
}

import Navigation from './components/ui/navigation';
import Providers from './providers';

export default function RootLayout({ children }) {
  return (
    <html lang="en">
      <body>
        <Navigation />
        
        <Providers>{children}</Providers>
      </body>
    </html>
  )
}