'use client'

import { Menus } from "@/lib/utils";
import {DesktopMenu} from "./DesktopMenu";
import {MobMenu} from "./MobileMenu";
import Image from "next/image";
import ThemeSwitch from "./Themeswitch";
import { CiShoppingCart } from "react-icons/ci";
import Link from "next/link";
import { useAppContext } from "@/context";
import { Badge } from "./ui/badge";

export default function Header() {
  const {cart} = useAppContext()
  return (
    <div>
      <header className="h-16 text-[15px] fixed inset-0 flex-center bg-background dark:bg-background-dark bg- z-20 shadow-lg">
        <nav className=" px-3.5 flex-center-between w-full max-w-7xl mx-auto">
          <div className="flex-center gap-x-3 z-[999] relative">
            <Link href="/">
            <Image src={"/logo.png"} alt="logo" width={342} height={63} className="object-contain w-28"/>
            </Link>
          </div>

          <ul className="gap-x-1 lg:flex-center hidden">
            {Menus.map((menu) => (
              <DesktopMenu key={menu.name} name={menu.name}/>
            ))}
          </ul>
          <div className="flex-center gap-x-5">
            <div
              aria-label="theme switcher"
              className="bg-white/5 relative p-[.2rem] shadow rounded-full flex-center"
            >
              <ThemeSwitch/>
            </div>
            <Link href="/cart">
            <div
              aria-label="Shopping cart"
              className="bg-white/5 relative p-[.2rem] shadow rounded-full flex-center flex gap-2 cursor-pointer"
            >
              <Badge className="text-text-dark">{cart?.length}</Badge>
            <CiShoppingCart className="w-5 h-5"/>
            </div>
            </Link>
            
            <div className="lg:hidden">
              <MobMenu />
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}