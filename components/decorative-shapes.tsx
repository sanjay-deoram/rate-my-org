import { cn } from "@/lib/utils";

type DecorativeShapesProps = {
  variant: "directory" | "archive" | "form" | "profile" | "about" | "admin";
  className?: string;
};

export function DecorativeShapes({ variant, className }: DecorativeShapesProps) {
  if (variant === "directory") {
    return (
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      >
        <span className="bg-token-green/90 absolute top-28 -left-24 h-48 w-28 rotate-[-10deg] rounded-[1.5rem] shadow-2xl lg:h-80 lg:w-44" />
        <span className="bg-token-lime/80 absolute top-44 -right-10 h-32 w-20 rotate-[7deg] rounded-[1.25rem] lg:h-48 lg:w-28" />
        <span className="bg-ink/90 absolute top-72 right-24 h-7 w-16 rotate-[-16deg] rounded-md lg:h-10 lg:w-24" />
      </div>
    );
  }

  if (variant === "archive") {
    return (
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      >
        <span className="bg-token-blue/75 absolute top-10 -left-16 h-32 w-20 rotate-[11deg] rounded-[1.25rem] md:h-52 md:w-32" />
        <span className="bg-token-lime/70 absolute right-10 bottom-6 h-20 w-44 rotate-[-4deg] rounded-[1rem] md:h-28 md:w-72" />
        <span className="bg-ink/90 absolute top-24 right-28 h-6 w-16 rotate-[14deg] rounded lg:h-9 lg:w-24" />
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      >
        <span className="bg-token-green/80 absolute top-32 -right-20 h-64 w-24 rotate-[8deg] rounded-[1.5rem] lg:h-[420px] lg:w-40" />
        <span className="bg-token-blue/65 absolute top-[34rem] -left-16 h-32 w-20 rotate-[-12deg] rounded-[1.25rem] lg:h-48 lg:w-28" />
        <span className="bg-ink/90 absolute top-[26rem] right-28 h-7 w-20 rotate-[-18deg] rounded-md xl:h-10 xl:w-28" />
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      >
        <span className="bg-token-lime/75 absolute top-24 -right-24 h-44 w-28 rotate-[13deg] rounded-[1.5rem] lg:h-72 lg:w-44" />
        <span className="bg-token-blue/65 absolute top-80 -left-24 h-40 w-24 rotate-[-8deg] rounded-[1.25rem] lg:h-64 lg:w-36" />
      </div>
    );
  }

  if (variant === "about") {
    return (
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      >
        <span className="bg-token-green/85 absolute top-24 right-0 h-72 w-24 translate-x-1/2 rotate-[5deg] rounded-[1.5rem] lg:h-[520px] lg:w-40" />
        <span className="bg-token-blue/70 absolute top-40 -left-16 h-32 w-20 rotate-[-12deg] rounded-[1.25rem] lg:h-52 lg:w-32" />
        <span className="bg-ink/90 absolute right-32 bottom-20 h-8 w-20 rotate-[-14deg] rounded-md lg:h-12 lg:w-32" />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <span className="bg-token-blue/55 absolute -top-16 -right-12 h-32 w-20 rotate-[12deg] rounded-[1.25rem] md:h-52 md:w-32" />
      <span className="bg-token-lime/70 absolute -bottom-20 -left-12 h-36 w-20 rotate-[-10deg] rounded-[1.25rem] md:h-56 md:w-32" />
    </div>
  );
}
