import { Menus } from "@/lib/utils";
import {DesktopMenu} from "./DesktopMenu";
import {MobMenu} from "./MobileMenu";
import Image from "next/image";



export default function Header() {
  return (
    <div>
      <header className="h-16 text-[15px] fixed inset-0 flex-center bg-[#18181A] z-[9999]">
        <nav className=" px-3.5 flex-center-between w-full max-w-7xl mx-auto">
          <div className="flex-center gap-x-3 z-[999] relative">
            <Image src={"/logo.png"} alt="logo" width={342} height={63} className="object-contain w-28"/>
          </div>

          <ul className="gap-x-1 lg:flex-center hidden">
            {Menus.map((menu) => (
              <DesktopMenu key={menu.name} name={menu.name}/>
            ))}
          </ul>
          <div className="flex-center gap-x-5">
            <button
              aria-label="sign-in"
              className="bg-white/5 z-[999] relative px-3 py-1.5 shadow rounded-xl flex-center"
            >
              Sign In
            </button>
            <div className="lg:hidden">
              <MobMenu />
            </div>
          </div>
        </nav>
      </header>
    </div>
  );
}