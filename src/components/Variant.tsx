"use client"
import { useAppContext } from "@/context";

export const Variant = ({ subVariants, variantType }: { subVariants: string[], variantType: string }) => {
  const { addVariant, variants } = useAppContext();

  return (
    <div className="flex gap-3 flex-wrap w-full py-2">
      {subVariants?.map((subVariant, idx: number) => {
        const foundVariant = variants.find((variant:any) => variant.variant === subVariant)
        const isSelected = foundVariant
        const isSize = variantType === "size";

        const baseClass = isSize
          ? "w-11 h-11 rounded-full"
          : "py-2 px-3 rounded-md";

        const selectedClass = isSelected ? "bg-primary text-text-dark" : "";

        return (
          <span
            key={idx}
            onClick={() => addVariant({variantType,variant:subVariant})}
            className={`${baseClass} ${selectedClass} flex justify-center text-sm items-center cursor-pointer ease-in-out transition-colors duration-700 border hover:border-primary`}
          >
            {subVariant.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
};
