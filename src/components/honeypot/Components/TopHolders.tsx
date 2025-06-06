import { AlertTriangle, Info } from "lucide-react";

function TopHolders({
  holdersResult,
}: {
  holdersResult: {
    holders: {
      address: string;
      balance: string;
      alias: string;
      isContract: boolean;
    }[];
    totalSupply: string;
  };
}) {
  return (
    <div className="w-full max-h-[450px] overflow-y-auto">
      <div className="p-3 backdrop-blur-lg bg-black/50 rounded-xl border border-[#ffa500]/30 shadow-[0_0_10px_rgba(255,165,0,0.2)] overflow-hidden relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ffa500]/10 via-transparent to-transparent"></div>

        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-lg bg-[#ffa500]/10 flex items-center justify-center">
            <Info className="h-3.5 w-3.5 text-[#ffa500]" />
          </div>
          <h3 className="text-sm font-bold text-[#ffa500] pixelify-sans">
            TOP HOLDERS
          </h3>
        </div>

        <div className="mb-2">
          <div className="p-2 bg-black/50 rounded-lg border border-[#ffa500]/20 mb-2">
            <div className="flex justify-between items-center">
              <span className="pixelify-sans text-xs text-[#ffa500]">
                Total Supply:
              </span>
              <span className="pixelify-sans text-xs text-[#00ffff]">
                {BigInt(holdersResult.totalSupply).toLocaleString()} tokens
              </span>
            </div>
          </div>
        </div>

        {holdersResult.holders.length === 0 ? (
          <div className="p-3 text-center">
            <AlertTriangle className="h-6 w-6 mx-auto mb-2 text-[#ffa500]" />
            <h4 className="pixelify-sans text-xs font-medium text-[#ffa500] mb-1">
              NO HOLDERS FOUND
            </h4>
            <p className="pixelify-sans text-[10px] text-[#00ffff]">
              No token holders were found for this token on the selected chain.
            </p>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="grid grid-cols-[1fr_auto_auto] gap-2 p-2 bg-[#ffa500]/10 rounded-lg text-[10px] text-[#ffa500] font-medium">
              <div className="pixelify-sans">Address</div>
              <div className="pixelify-sans text-right">Balance</div>
              <div className="pixelify-sans text-center">%</div>
            </div>

            <div className="space-y-1 max-h-[150px] overflow-y-auto">
              {holdersResult.holders.map((holder, index) => {
                const percentage =
                  (Number(holder.balance) / Number(holdersResult.totalSupply)) *
                  100;

                return (
                  <div
                    key={index}
                    className={`grid grid-cols-[1fr_auto_auto] gap-2 p-2 rounded-lg ${
                      holder.isContract
                        ? "bg-[#ff0000]/10 border border-[#ff0000]/20"
                        : "bg-black/50 border border-[#ffa500]/20"
                    }`}
                  >
                    <div className="truncate font-mono text-[10px] text-[#00ffff] flex items-center">
                      <span className="truncate">
                        {holder.alias ||
                          holder.address.substring(0, 8) +
                            "..." +
                            holder.address.substring(36)}
                      </span>

                      {holder.isContract && (
                        <span className="ml-1 px-1 py-0.5 bg-[#ff0000]/20 text-[#ff0000] rounded text-[8px]">
                          CONTRACT
                        </span>
                      )}
                    </div>

                    <div className="text-right text-[10px] text-[#00ffff] whitespace-nowrap">
                      {Number(holder.balance).toLocaleString()}
                    </div>

                    <div
                      className={`text-center text-[10px] ${
                        percentage > 5 ? "text-[#ff0000]" : "text-[#00ff00]"
                      }`}
                    >
                      {percentage.toFixed(1)}%
                    </div>
                  </div>
                );
              })}
            </div>

            <div className="p-2 bg-[#ffaa00]/10 border border-[#ffaa00]/30 rounded-lg flex items-start text-[10px]">
              <Info className="h-3 w-3 text-[#ffaa00] mr-1 flex-shrink-0 mt-0.5" />
              <p className="text-[#ffaa00]">
                Large token holders (whales) could impact price through selling.
                Contracts might be locked liquidity or staking.
              </p>
            </div>
          </div>
        )}
      </div>
    </div>
  );
}

export default TopHolders;
