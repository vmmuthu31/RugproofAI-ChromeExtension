import { getExplorerUrl } from "@/lib/services/goldrush";
import { AlertTriangle, CheckCircle, ExternalLink } from "lucide-react";

function HoneyPotResult({
  honeypotResult,
  detectedChain,
}: {
  honeypotResult: {
    token: {
      address: string;
      name: string;
      symbol: string;
      totalHolders: number;
    };
    simulationResult: {
      buyTax: number;
      sellTax: number;
      transferTax: number;
      buyGas: number;
      sellGas: number;
    };
    contractCode?: {
      openSource?: boolean;
      rootOpenSource?: boolean;
      isProxy?: boolean;
      hasProxyCalls?: boolean;
    };
    summary?: {
      risk?: string;
    };
    honeypotResult?: {
      isHoneypot?: boolean;
      honeypotReason?: string;
    };
  };
  detectedChain?: string | null;
}) {
  return (
    <div className="w-full max-h-[250px] overflow-y-auto">
      {/* Token Summary Card */}
      <div className="p-3 backdrop-blur-lg bg-black/50 rounded-xl border border-[#ffa500]/30 shadow-[0_0_10px_rgba(255,165,0,0.2)] overflow-hidden relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ffa500]/10 via-transparent to-transparent"></div>

        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-lg bg-[#ffa500]/10 flex items-center justify-center">
            <AlertTriangle className="h-3.5 w-3.5 text-[#ffa500]" />
          </div>
          <h3 className="text-sm font-bold text-[#ffa500] pixelify-sans">
            TOKEN ANALYSIS
          </h3>
        </div>

        {/* Token Info */}
        <div className="space-y-3">
          <div className="grid grid-cols-2 gap-2">
            <div className="space-y-1">
              <span className="text-[10px] text-[#ffa500] block">Name</span>
              <span className="text-xs text-[#00ffff] bg-black/50 py-1 px-2 rounded-lg border border-[#ffa500]/20 block truncate">
                {honeypotResult.token.name}
              </span>
            </div>
            <div className="space-y-1">
              <span className="text-[10px] text-[#ffa500] block">Symbol</span>
              <span className="text-xs text-[#00ffff] bg-black/50 py-1 px-2 rounded-lg border border-[#ffa500]/20 block truncate">
                {honeypotResult.token.symbol}
              </span>
            </div>
          </div>

          <div className="space-y-1">
            <span className="text-[10px] text-[#ffa500] block">Address</span>
            <div className="flex items-center gap-1">
              <span className="font-mono text-[10px] text-[#00ffff] bg-black/50 py-1 px-1.5 rounded-lg border border-[#ffa500]/20 block truncate flex-1">
                {honeypotResult.token.address}
              </span>
              <a
                href={
                  detectedChain
                    ? `${getExplorerUrl(
                        detectedChain,
                        honeypotResult.token.address
                      )}`
                    : `https://etherscan.io/address/${honeypotResult.token.address}`
                }
                target="_blank"
                rel="noopener noreferrer"
                className="inline-flex items-center justify-center h-5 w-5 rounded-full bg-black/50 text-[#ffa500] hover:bg-black/70 hover:text-[#ffcc00] transition-colors border border-[#ffa500]/30"
              >
                <ExternalLink className="h-2.5 w-2.5" />
              </a>
            </div>
          </div>

          {/* Analysis Results */}
          <div className="grid grid-cols-3 gap-1 mt-1">
            <div className="p-1 bg-black/70 rounded-lg border border-[#ffa500]/20 text-center">
              <div className="text-xs font-bold text-[#00ffff] mb-0.5">
                {honeypotResult.simulationResult.buyTax}%
              </div>
              <div className="text-[9px] text-[#ffa500] pixelify-sans">
                BUY TAX
              </div>
            </div>
            <div className="p-1 bg-black/70 rounded-lg border border-[#ffa500]/20 text-center">
              <div className="text-xs font-bold text-[#00ffff] mb-0.5">
                {honeypotResult.simulationResult.sellTax}%
              </div>
              <div className="text-[9px] text-[#ffa500] pixelify-sans">
                SELL TAX
              </div>
            </div>
            <div className="p-1 bg-black/70 rounded-lg border border-[#ffa500]/20 text-center">
              <div className="text-xs font-bold text-[#00ffff] mb-0.5">
                {honeypotResult.token.totalHolders.toLocaleString()}
              </div>
              <div className="text-[9px] text-[#ffa500] pixelify-sans">
                HOLDERS
              </div>
            </div>
          </div>

          {/* Honeypot Status */}
          <div
            className={`mt-2 p-2 border rounded-lg flex items-center gap-2 ${
              honeypotResult?.honeypotResult?.isHoneypot
                ? "border-[#ff0000]/30 bg-[#ff0000]/10"
                : "border-[#00ff00]/30 bg-[#00ff00]/10"
            }`}
          >
            <div
              className={`h-6 w-6 rounded-full flex items-center justify-center flex-shrink-0 ${
                honeypotResult?.honeypotResult?.isHoneypot
                  ? "bg-[#ff0000]/20 border border-[#ff0000]/30"
                  : "bg-[#00ff00]/20 border border-[#00ff00]/30"
              }`}
            >
              {honeypotResult?.honeypotResult?.isHoneypot ? (
                <AlertTriangle className="h-3.5 w-3.5 text-[#ff0000]" />
              ) : (
                <CheckCircle className="h-3.5 w-3.5 text-[#00ff00]" />
              )}
            </div>
            <div>
              <h4
                className={`font-semibold text-xs ${
                  honeypotResult?.honeypotResult?.isHoneypot
                    ? "text-[#ff5555]"
                    : "text-[#00ff00]"
                } pixelify-sans`}
              >
                {honeypotResult?.honeypotResult?.isHoneypot
                  ? "DANGER: HONEYPOT"
                  : "SAFE: NOT A HONEYPOT"}
              </h4>
              <p
                className={`text-[10px] ${
                  honeypotResult?.honeypotResult?.isHoneypot
                    ? "text-[#ff8888]"
                    : "text-[#00ffaa]"
                }`}
              >
                {honeypotResult?.honeypotResult?.isHoneypot
                  ? honeypotResult?.honeypotResult?.honeypotReason?.substring(0, 75) + "..." ||
                    "This contract has been identified as a honeypot."
                  : "This contract appears safe based on our analysis."}
              </p>
            </div>
          </div>

          {/* Contract Code Info */}
          {honeypotResult.contractCode && (
            <div className="mt-2 grid grid-cols-2 gap-1 text-[10px]">
              <div className="flex justify-between p-1 bg-black/50 rounded-lg border border-[#ffa500]/10">
                <span className="text-[#ffa500]">Open Source:</span>
                <span
                  className={
                    honeypotResult?.contractCode?.openSource
                      ? "text-[#00ff00]"
                      : "text-[#ff0000]"
                  }
                >
                  {honeypotResult?.contractCode?.openSource ? "YES" : "NO"}
                </span>
              </div>
              <div className="flex justify-between p-1 bg-black/50 rounded-lg border border-[#ffa500]/10">
                <span className="text-[#ffa500]">Is Proxy:</span>
                <span
                  className={
                    honeypotResult?.contractCode?.isProxy
                      ? "text-[#ff5500]"
                      : "text-[#00ff00]"
                  }
                >
                  {honeypotResult?.contractCode?.isProxy ? "YES" : "NO"}
                </span>
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

export default HoneyPotResult;
