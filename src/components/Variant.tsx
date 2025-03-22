"use client"
import { useAppContext } from "@/context";

export const Variant = ({ subVariants, variantType }: { subVariants: string[], variantType: string }) => {
  const { selectedVariant, setSelectedVariant } = useAppContext();

  return (
    <div className="flex gap-3 flex-wrap w-full py-2">
      {subVariants?.map((subVariant, idx: number) => {
        const isSelected = selectedVariant === subVariant && variantType === "size";
        const isSize = variantType === "size";

        const baseClass = isSize
          ? "flex justify-center text-sm items-center w-11 h-11 border rounded-full hover:border-primary cursor-pointer ease-in-out transition-colors duration-700"
          : "";

        const selectedClass = isSelected ? "bg-primary text-text-dark" : "";

        return (
          <span
            key={idx}
            onClick={() => setSelectedVariant(subVariant)}
            className={`${baseClass} ${selectedClass}`}
          >
            {subVariant.toUpperCase()}
          </span>
        );
      })}
    </div>
  );
};
