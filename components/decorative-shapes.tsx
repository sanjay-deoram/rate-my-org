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
        <span className="bg-token-green/90 absolute top-28 -left-24 h-80 w-44 rotate-[-10deg] rounded-[1.5rem] shadow-2xl" />
        <span className="bg-token-lime/80 absolute top-44 -right-10 h-48 w-28 rotate-[7deg] rounded-[1.25rem]" />
        <span className="bg-ink/90 absolute top-72 right-24 h-10 w-24 rotate-[-16deg] rounded-md" />
      </div>
    );
  }

  if (variant === "archive") {
    return (
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      >
        <span className="bg-token-blue/75 absolute top-10 -left-16 h-52 w-32 rotate-[11deg] rounded-[1.25rem]" />
        <span className="bg-token-lime/70 absolute right-10 bottom-6 h-28 w-72 rotate-[-4deg] rounded-[1rem]" />
        <span className="bg-ink/90 absolute top-24 right-28 h-9 w-24 rotate-[14deg] rounded" />
      </div>
    );
  }

  if (variant === "form") {
    return (
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      >
        <span className="bg-token-green/80 absolute top-32 -right-20 h-[420px] w-40 rotate-[8deg] rounded-[1.5rem]" />
        <span className="bg-token-blue/65 absolute top-[34rem] -left-16 h-48 w-28 rotate-[-12deg] rounded-[1.25rem]" />
        <span className="bg-ink/90 absolute top-[26rem] right-28 h-10 w-28 rotate-[-18deg] rounded-md" />
      </div>
    );
  }

  if (variant === "profile") {
    return (
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      >
        <span className="bg-token-lime/75 absolute top-24 -right-24 h-72 w-44 rotate-[13deg] rounded-[1.5rem]" />
        <span className="bg-token-blue/65 absolute top-80 -left-24 h-64 w-36 rotate-[-8deg] rounded-[1.25rem]" />
        <span className="bg-ink/90 absolute top-52 left-[52%] h-9 w-24 rotate-[9deg] rounded" />
      </div>
    );
  }

  if (variant === "about") {
    return (
      <div
        aria-hidden
        className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
      >
        <span className="bg-token-green/85 absolute top-24 right-0 h-[520px] w-40 translate-x-1/2 rotate-[5deg] rounded-[1.5rem]" />
        <span className="bg-token-blue/70 absolute top-40 -left-16 h-52 w-32 rotate-[-12deg] rounded-[1.25rem]" />
        <span className="bg-ink/90 absolute right-32 bottom-20 h-12 w-32 rotate-[-14deg] rounded-md" />
      </div>
    );
  }

  return (
    <div
      aria-hidden
      className={cn("pointer-events-none absolute inset-0 overflow-hidden", className)}
    >
      <span className="bg-token-blue/55 absolute -top-16 -right-12 h-52 w-32 rotate-[12deg] rounded-[1.25rem]" />
      <span className="bg-token-lime/70 absolute -bottom-20 -left-12 h-56 w-32 rotate-[-10deg] rounded-[1.25rem]" />
    </div>
  );
}
