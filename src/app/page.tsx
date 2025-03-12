import { HomeSlider } from "@/components/HomeSlider";
import Marquee from "react-fast-marquee"
import { TbChristmasTree } from "react-icons/tb";

export default function Home() {
  return (
    <main className="pt-[63.99px]">
      <div className="p-3 sm:p-5">
      <HomeSlider/>
      </div>
      
    <Marquee pauseOnHover className="py-6 bg-complement dark:bg-complement-dark text-2xl text-text-dark cursor-pointer ">
      <div className="flex gap-5">
      <div className="flex "><TbChristmasTree/>&nbsp;Christmas Sale: Save Up to 70%&nbsp;<TbChristmasTree/></div>
      <div className="flex"><TbChristmasTree/>&nbsp;Christmas Sale: Save Up to 70%&nbsp;<TbChristmasTree/></div>
      <div className="flex"><TbChristmasTree/>&nbsp;Christmas Sale: Save Up to 70%&nbsp;<TbChristmasTree/></div>
      </div>
    </Marquee>
    </main>
  );
}
