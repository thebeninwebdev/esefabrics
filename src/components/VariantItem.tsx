import * as React from "react"

import {
  Select,
  SelectContent,
  SelectGroup,
  SelectItem,
  SelectLabel,
  SelectTrigger,
  SelectValue,
} from "@/components/ui/select"

export function SelectDemo({subVariants}:{subVariants:string[]}) {
  return (
    <Select>
      <SelectTrigger className="w-[150px] border-2 p-2 rounded-md border-complement outline-none placeholder:text-text tracking-wider dark:border-complement-dark dark:placeholder:text-text-dark bg-transparent dark:bg-[#1a1a1a] ring-0 focus:ring-0 focus:outline-0">
        <SelectValue placeholder="Select a variant" />
      </SelectTrigger>
      <SelectContent className="bg-background dark:bg-background-dark">
        <SelectGroup>
          {subVariants?.map((subVariant:string,idx:number) => (
            <SelectItem key={idx} value={subVariant} className="">{subVariant.toUpperCase()}</SelectItem>
        ))}
        </SelectGroup>
      </SelectContent>
    </Select>
  )
}
