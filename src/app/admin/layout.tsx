import type { Metadata } from 'next';

import SideNav from '@/components/SideNav';

import Header from '@/components/DashboardHeader';

export const metadata: Metadata = {
  title: 'Esefabrics- Admin page',
  description: 'Manage and monitor your site with every click',
};

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode;
}>) {
  return (
        <main><Header />
          <div className="flex">
            <SideNav />
            <div className="w-full overflow-x-auto">
              <div className="sm:h-[calc(99vh-60px)] overflow-auto ">
                <div className="w-full flex justify-center mx-auto overflow-auto h-[calc(100vh - 120px)] overflow-y-auto relative">
                  <div className="w-full md:max-w-6xl">   {children}
                  </div>
                </div>
              </div>
            </div>
          </div>
        </main>
  );
}