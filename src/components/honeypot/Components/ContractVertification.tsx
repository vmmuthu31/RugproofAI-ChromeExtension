import { CheckCircle, Info } from "lucide-react";

function ContractVertification({
  contractResult,
}: {
  contractResult: {
    isContract: boolean;
    isRootOpenSource: boolean;
    fullCheckPerformed: boolean;
    summary?: {
      isOpenSource: boolean;
      hasProxyCalls: boolean;
    };
    contractsOpenSource?: Record<string, boolean>;
  };
}) {
  return (
    <div className="w-full max-h-[450px] overflow-y-auto">
      <div className="p-3 backdrop-blur-lg bg-black/50 rounded-xl border border-[#ffa500]/30 shadow-[0_0_10px_rgba(255,165,0,0.2)] overflow-hidden relative">
        <div className="absolute inset-0 -z-10 bg-[radial-gradient(ellipse_at_top_right,_var(--tw-gradient-stops))] from-[#ffa500]/10 via-transparent to-transparent"></div>

        <div className="flex items-center gap-2 mb-2">
          <div className="h-6 w-6 rounded-lg bg-[#ffa500]/10 flex items-center justify-center">
            <CheckCircle className="h-3.5 w-3.5 text-[#ffa500]" />
          </div>
          <h3 className="text-sm font-bold text-[#ffa500] pixelify-sans">
            CONTRACT VERIFICATION
          </h3>
        </div>

        <div className="flex flex-col gap-2">
          {/* Summary */}
          <div className="p-2 bg-black/70 rounded-lg border border-[#ffa500]/20">
            <h4 className="text-xs font-medium text-[#ffa500] mb-1 pixelify-sans">
              SUMMARY
            </h4>
            <div className="grid grid-cols-1 gap-1.5">
              <div className="p-1.5 bg-black/50 rounded-lg border border-[#ffa500]/10">
                <div className="flex justify-between">
                  <span className="text-[10px] text-[#ffa500]">
                    Is Contract:
                  </span>
                  <span
                    className={`text-[10px] ${
                      contractResult.isContract
                        ? "text-[#00ff00]"
                        : "text-[#ff0000]"
                    }`}
                  >
                    {contractResult.isContract ? "YES" : "NO"}
                  </span>
                </div>
              </div>

              <div className="p-1.5 bg-black/50 rounded-lg border border-[#ffa500]/10">
                <div className="flex justify-between">
                  <span className="text-[10px] text-[#ffa500]">
                    Root Open Source:
                  </span>
                  <span
                    className={`text-[10px] ${
                      contractResult.isRootOpenSource
                        ? "text-[#00ff00]"
                        : "text-[#ff0000]"
                    }`}
                  >
                    {contractResult.isRootOpenSource ? "YES" : "NO"}
                  </span>
                </div>
              </div>

              {contractResult.summary && (
                <>
                  <div className="p-1.5 bg-black/50 rounded-lg border border-[#ffa500]/10">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-[#ffa500]">
                        Is Open Source:
                      </span>
                      <span
                        className={`text-[10px] ${
                          contractResult.summary.isOpenSource
                            ? "text-[#00ff00]"
                            : "text-[#ff0000]"
                        }`}
                      >
                        {contractResult.summary.isOpenSource ? "YES" : "NO"}
                      </span>
                    </div>
                  </div>

                  <div className="p-1.5 bg-black/50 rounded-lg border border-[#ffa500]/10">
                    <div className="flex justify-between">
                      <span className="text-[10px] text-[#ffa500]">
                        Has Proxy Calls:
                      </span>
                      <span
                        className={`text-[10px] ${
                          contractResult.summary.hasProxyCalls
                            ? "text-[#ff5500]"
                            : "text-[#00ff00]"
                        }`}
                      >
                        {contractResult.summary.hasProxyCalls ? "YES" : "NO"}
                      </span>
                    </div>
                  </div>
                </>
              )}
            </div>
          </div>

          {/* Contracts Open Source */}
          {contractResult.contractsOpenSource &&
            Object.keys(contractResult.contractsOpenSource).length > 0 && (
              <div className="p-2 bg-black/70 rounded-lg border border-[#ffa500]/20">
                <h4 className="text-xs font-medium text-[#ffa500] mb-1 pixelify-sans">
                  LINKED CONTRACTS
                </h4>
                <div className="max-h-[100px] overflow-y-auto space-y-1.5">
                  {Object.entries(contractResult.contractsOpenSource).map(
                    ([address, isOpenSource], index) => (
                      <div
                        key={index}
                        className="p-1.5 bg-black/50 rounded-lg border border-[#ffa500]/10 flex justify-between"
                      >
                        <span className="text-[10px] text-[#00ffff] font-mono truncate flex-1 pr-2">
                          {address.substring(0, 6)}...
                          {address.substring(address.length - 4)}
                        </span>
                        <span
                          className={`text-[10px] whitespace-nowrap ${
                            isOpenSource ? "text-[#00ff00]" : "text-[#ff0000]"
                          }`}
                        >
                          {isOpenSource ? "Open Source" : "Not Open Source"}
                        </span>
                      </div>
                    )
                  )}
                </div>
              </div>
            )}

          {/* Notes */}
          <div className="p-2 bg-[#ffaa00]/10 rounded-lg border border-[#ffaa00]/30 flex items-start">
            <Info className="h-3.5 w-3.5 text-[#ffaa00] mr-1 flex-shrink-0 mt-0.5" />
            <p className="text-[10px] text-[#ffaa00]">
              Open source contracts let you verify functionality. Non-open
              source contracts may hide malicious code.
              {!contractResult.isRootOpenSource &&
                " This contract is not fully open source, which could be a risk."}
            </p>
          </div>
        </div>
      </div>
    </div>
  );
}

export default ContractVertification;
