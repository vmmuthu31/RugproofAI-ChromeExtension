import { Suspense } from "react";
import HoneyPot from "./Components";
import { Loader2 } from "lucide-react";

export default function HoneypotPage() {
  return (
    <Suspense
      fallback={
        <div className="flex min-h-[600px] flex-col items-center justify-center bg-black text-white w-[420px]">
          <Loader2 className="h-10 w-10 animate-spin text-[#ffa500]" />
          <p className="pixelify-sans mt-4 text-[#ffa500]">
            Loading honeypot scanner...
          </p>
        </div>
      }
    >
      <HoneyPot />
    </Suspense>
  );
}
