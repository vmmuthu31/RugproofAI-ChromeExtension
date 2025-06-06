import { AlertTriangle, Search } from "lucide-react";

function PairResult({
  pairsResult,
}: {
  pairsResult: {
    Pair: {
      Address: string;
      Name: string;
    };
    ChainID: number;
    Liquidity: number;
  }[];
}) {
  return (
    <div className="w-full max-h-[250px] overflow-y-auto">
      <div className="p-3 backdrop-blur-lg bg-black/50 rounded-xl border border-[#ffa500]/30 shadow-[0_0_10px_rgba(255,165,0,0.2)] overflow-hidden relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ffa500]/10 via-transparent to-transparent"></div>

        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-lg bg-[#ffa500]/10 flex items-center justify-center">
            <Search className="h-3.5 w-3.5 text-[#ffa500]" />
          </div>
          <h3 className="text-sm font-bold text-[#ffa500] pixelify-sans">
            TOKEN PAIRS
          </h3>
        </div>

        {pairsResult.length === 0 ? (
          <div className="p-3 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-[#ffa500]" />
            <h4 className="pixelify-sans text-xs font-medium text-[#ffa500] mb-1">
              NO PAIRS FOUND
            </h4>
            <p className="pixelify-sans text-[10px] text-[#00ffff]">
              No trading pairs were found for this token on the selected chain.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_auto_auto] gap-2 p-2 bg-[#ffa500]/10 rounded-lg text-[10px] text-[#ffa500] font-medium">
              <div className="pixelify-sans">Pair</div>
              <div className="pixelify-sans text-right">Chain</div>
              <div className="pixelify-sans text-right">Liquidity ($)</div>
            </div>

            <div className="space-y-1.5 max-h-[150px] overflow-y-auto pr-1">
              {pairsResult.map((pair, index) => (
                <div
                  key={index}
                  className="grid grid-cols-[1fr_auto_auto] gap-2 p-2 rounded-lg bg-black/50 border border-[#ffa500]/20"
                >
                  <div className="truncate text-[10px] text-[#00ffff]">
                    {pair.Pair.Name}
                  </div>
                  <div className="text-right text-[10px] text-[#00ffff]">
                    {getChainName(pair.ChainID.toString())}
                  </div>
                  <div className="text-right text-[10px] text-[#00ffff]">
                    ${pair.Liquidity.toLocaleString()}
                  </div>
                </div>
              ))}
            </div>

            <div className="text-center text-[10px] text-[#ffa500] pt-2">
              {pairsResult.length > 1
                ? `Found ${pairsResult.length} trading pairs`
                : "Found 1 trading pair"}
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

function getChainName(chainId: string): string {
  const chains: Record<string, string> = {
    "1": "ETH",
    "56": "BSC",
    "137": "MATIC",
    "43114": "AVAX",
    "42161": "ARB",
    "10": "OPT",
  };
  return chains[chainId] || chainId;
}

export default PairResult;
