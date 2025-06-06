import { AlertTriangle, ExternalLink, Info, Search } from "lucide-react";

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
    <div className="w-full max-w-2xl mt-6 animate-fade-in">
      <div className="p-4 sm:p-6 backdrop-blur-lg bg-black/50 rounded-2xl border border-[#ffa500]/30 shadow-[0_0_15px_rgba(255,165,0,0.2)] overflow-hidden relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ffa500]/10 via-transparent to-transparent"></div>

        <div className="flex items-center gap-2 mb-4 sm:mb-6">
          <div className="h-8 w-8 sm:h-10 sm:w-10 rounded-lg bg-[#ffa500]/10 flex items-center justify-center">
            <Search className="h-5 w-5 sm:h-6 sm:w-6 text-[#ffa500]" />
          </div>
          <h3 className="pixelify-sans text-lg sm:text-xl md:text-2xl font-bold text-[#ffa500]">
            TOKEN PAIRS
          </h3>
        </div>

        {pairsResult.length === 0 ? (
          <div className="p-6 text-center">
            <AlertTriangle className="h-12 w-12 mx-auto mb-3 text-[#ffa500]" />
            <h4 className="pixelify-sans text-lg font-medium text-[#ffa500] mb-2">
              NO PAIRS FOUND
            </h4>
            <p className="pixelify-sans text-base text-[#00ffff]">
              No trading pairs were found for this token on the selected chain.
            </p>
          </div>
        ) : (
          <div className="space-y-4">
            <div className="overflow-x-auto">
              <table className="w-full text-sm">
                <thead>
                  <tr className="border-b border-[#ffa500]/30">
                    <th className="pixelify-sans text-left p-3 text-[#ffa500] text-base sm:text-lg">
                      Pair
                    </th>
                    <th className="pixelify-sans text-right p-3 text-[#ffa500] text-base sm:text-lg">
                      Chain
                    </th>
                    <th className="pixelify-sans text-right p-3 text-[#ffa500] text-base sm:text-lg">
                      Liquidity
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {pairsResult.map((pair, index) => (
                    <tr
                      key={pair.Pair.Address}
                      className={`${
                        index % 2 === 0 ? "bg-black/30" : "bg-black/50"
                      } hover:bg-[#ffa500]/10 transition-colors`}
                    >
                      <td className="pixelify-sans p-3 text-[#00ffff] text-base">
                        <div className="flex flex-col">
                          <span>{pair.Pair.Name}</span>
                          <a
                            href={`https://etherscan.io/address/${pair.Pair.Address}`}
                            target="_blank"
                            rel="noopener noreferrer"
                            className="text-sm text-[#00ffaa] hover:text-[#00ffff] flex items-center gap-1"
                          >
                            {pair.Pair.Address.substring(0, 8)}...
                            {pair.Pair.Address.substring(
                              pair.Pair.Address.length - 6
                            )}
                            <ExternalLink className="inline-block h-4 w-4" />
                          </a>
                        </div>
                      </td>
                      <td className="pixelify-sans p-3 text-right text-[#00ffff] text-base">
                        {pair.ChainID === 1
                          ? "Ethereum"
                          : pair.ChainID === 56
                          ? "BSC"
                          : pair.ChainID === 137
                          ? "Polygon"
                          : pair.ChainID === 42161
                          ? "Arbitrum"
                          : pair.ChainID === 10
                          ? "Optimism"
                          : pair.ChainID.toString()}
                      </td>
                      <td className="pixelify-sans p-3 text-right text-[#00ffff] text-base">
                        $
                        {pair.Liquidity.toLocaleString(undefined, {
                          maximumFractionDigits: 2,
                        })}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>

            <div className="p-3 sm:p-4 bg-[#ffaa00]/10 rounded-xl border border-[#ffaa00]/30">
              <div className="flex gap-3 items-start">
                <Info className="h-5 w-5 text-[#ffaa00] flex-shrink-0 mt-0.5" />
                <p className="text-sm sm:text-base text-[#ffaa00] pixelify-sans">
                  The endpoint is currently limited to returning up to 10 pairs
                  with the highest liquidity.
                </p>
              </div>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default PairResult;
