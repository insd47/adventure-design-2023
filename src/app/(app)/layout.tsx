import { ThemeProvider } from "@insd47/library";
import "../globals.css";
import Header from "@/components/header";
import { Navigation } from "@/components";

import admin from "@/firebase/admin";
import { redirect } from "next/navigation";
import { cookies } from "next/headers";
import { checkLogin } from "@/firebase/auth";
const auth = admin.auth();
const db = admin.firestore();

export default async function RootLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const token = cookies().get("token");
  if (!(await checkLogin(token?.value))) return redirect("/login");

  return (
    <ThemeProvider>
      <html lang="en">
        <body>
          <div className="main_layout">
            <Header />
            <div className="main_layout_body">
              <Navigation />
              {children}
            </div>
          </div>
        </body>
      </html>
    </ThemeProvider>
  );
}
