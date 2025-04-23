
import Provider from "@/redux/component/provider";
import "../style/globals.css"
import { Noto_Sans } from 'next/font/google'

// If loading a variable font, you don't need to specify the font weight
const noto = Noto_Sans({
  subsets: ['latin'],
  display: 'swap',
})
export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={noto.className}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
