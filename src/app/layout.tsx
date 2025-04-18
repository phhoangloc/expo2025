
import Provider from "@/redux/component/provider";
import "../style/globals.css"

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
    <html lang="en">
      <body className={``}>
        <Provider>
          {children}
        </Provider>
      </body>
    </html>
  );
}
