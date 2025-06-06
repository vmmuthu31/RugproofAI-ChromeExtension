"use client";

import { useState, Suspense, type FormEvent } from "react";
import {
  Loader2,
  Search,
  AlertTriangle,
  CheckCircle,
  Info,
} from "lucide-react";

import { getChainName } from "@//utils/getChainName";

import TopHolders from "./TopHolders";
import PairResult from "./PairResult";
import ContractVertification from "./ContractVertification";
import HoneyPotResult from "./HoneyPotResult";
import { chainsToCheck } from "@/utils/chainsToCheck";
import type {
  ContractVerificationResponse,
  EndpointType,
  HoneypotResponse,
  PairResponse,
  TopHoldersResponse,
} from "@/lib/types";

function HoneyPot() {
  const [isLoading, setIsLoading] = useState(false);
  const [contractAddress, setContractAddress] = useState("");
  const [selectedChain, setSelectedChain] = useState("1");
  const [autoDetectChain, setAutoDetectChain] = useState(true);
  const [detectedChain, setDetectedChain] = useState<string | null>(null);
  const [isDetectingChain, setIsDetectingChain] = useState(false);
  const [endpoint, setEndpoint] = useState<EndpointType>("honeypot");
  const [honeypotResult, setHoneypotResult] = useState<HoneypotResponse | null>(
    null
  );
  const [contractResult, setContractResult] =
    useState<ContractVerificationResponse | null>(null);
  const [pairsResult, setPairsResult] = useState<PairResponse[] | null>(null);
  const [holdersResult, setHoldersResult] = useState<TopHoldersResponse | null>(
    null
  );
  const [error, setError] = useState<string | null>(null);

  const detectChain = async (address: string) => {
    if (!address || address.length < 42) return null;

    setIsDetectingChain(true);
    setDetectedChain(null);

    try {
      for (const chainObj of chainsToCheck) {
        try {
          if (chainObj.id === "43114") {
            try {
              const response = await fetch(
                `${chainObj.explorer}/v1/chains/${chainObj.id}/addresses/${address}`,
                {
                  headers: {
                    "x-glacier-api-key": chainObj.apikey || "",
                  },
                }
              );

              if (response.ok) {
                const data = await response.json();
                if (data && data.address) {
                  setDetectedChain(chainObj.id);
                  setSelectedChain(chainObj.id);
                  setIsDetectingChain(false);
                  return chainObj.id;
                }
              }
            } catch (error) {
              console.error(`Error checking Glacier API for Avalanche:`, error);
            }
            continue;
          }

          const explorerResponse = await fetch(
            `${chainObj.explorer}/api?module=contract&action=getabi&address=${address}&apikey=${chainObj.apikey}`
          );

          if (explorerResponse.ok) {
            const explorerData = await explorerResponse.json();
            if (
              explorerData.status === "1" ||
              (explorerData.result &&
                explorerData.result !== "Contract source code not verified" &&
                explorerData.result !== "" &&
                explorerData.result !== null)
            ) {
              setDetectedChain(chainObj.id);
              setSelectedChain(chainObj.id);
              setIsDetectingChain(false);
              return chainObj.id;
            }
          }
        } catch (error) {
          console.error(
            `Error checking explorer for chain ${chainObj.id} (${chainObj.name}):`,
            error
          );
        }
      }

      for (const chainObj of chainsToCheck) {
        try {
          if (chainObj.id === "43114") continue;

          const response = await fetch(
            `${chainObj.explorer}/api?module=account&action=balance&address=${address}&apikey=${chainObj.apikey}`
          );

          if (response.ok) {
            const data = await response.json();
            if (data.status === "1") {
              setDetectedChain(chainObj.id);
              setSelectedChain(chainObj.id);
              setIsDetectingChain(false);
              return chainObj.id;
            }
          }
        } catch (error) {
          console.error(
            `Error checking account balance for chain ${chainObj.id}:`,
            error
          );
        }
      }

      setIsDetectingChain(false);
      return null;
    } catch (error) {
      console.error("Error in chain detection:", error);
      setIsDetectingChain(false);
      return null;
    }
  };

  const fetchHoneypotData = async (address: string, chainId: string) => {
    try {
      const response = await fetch(
        `https://api.honeypot.is/v2/IsHoneypot?address=${address}&chainID=${chainId}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data as HoneypotResponse;
    } catch (error) {
      console.error("Error fetching honeypot data:", error);
      throw error;
    }
  };

  const fetchContractVerification = async (
    address: string,
    chainId: string
  ) => {
    try {
      const response = await fetch(
        `https://api.honeypot.is/v2/GetContractVerification?address=${address}&chainID=${chainId}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data as ContractVerificationResponse;
    } catch (error) {
      console.error("Error fetching contract verification:", error);
      throw error;
    }
  };

  const fetchPairs = async (address: string, chainId: string) => {
    try {
      const response = await fetch(
        `https://api.honeypot.is/v1/GetPairs?address=${address}&chainID=${chainId}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data as PairResponse[];
    } catch (error) {
      console.error("Error fetching pairs:", error);
      throw error;
    }
  };

  const fetchTopHolders = async (address: string, chainId: string) => {
    try {
      const response = await fetch(
        `https://api.honeypot.is/v1/TopHolders?address=${address}&chainID=${chainId}`
      );

      if (!response.ok) {
        throw new Error(`API error: ${response.statusText}`);
      }

      const data = await response.json();
      return data as TopHoldersResponse;
    } catch (error) {
      console.error("Error fetching top holders:", error);
      throw error;
    }
  };

  const handleCheck = async (e: FormEvent) => {
    e.preventDefault();

    if (!contractAddress) {
      setError("Please enter a contract address");
      return;
    }

    setIsLoading(true);
    setError(null);
    setHoneypotResult(null);
    setContractResult(null);
    setPairsResult(null);
    setHoldersResult(null);

    try {
      if (autoDetectChain && !detectedChain && !isDetectingChain) {
        const chainId = await detectChain(contractAddress);
        if (chainId) {
          setSelectedChain(chainId);
        }
      }

      switch (endpoint) {
        case "honeypot": {
          const honeypotData = await fetchHoneypotData(
            contractAddress,
            selectedChain
          );
          setHoneypotResult(honeypotData);
          break;
        }

        case "contract": {
          const contractData = await fetchContractVerification(
            contractAddress,
            selectedChain
          );
          setContractResult(contractData);
          break;
        }

        case "pairs": {
          const pairsData = await fetchPairs(contractAddress, selectedChain);
          setPairsResult(pairsData);
          break;
        }

        case "holders": {
          const holdersData = await fetchTopHolders(
            contractAddress,
            selectedChain
          );
          setHoldersResult(holdersData);
          break;
        }
      }
    } catch (err) {
      const errorMessage =
        err instanceof Error
          ? err.message
          : "Failed to check contract. Please try again.";
      setError(errorMessage);
      console.error(err);
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <Suspense>
      <div className="flex flex-col items-center bg-black text-white w-[390px] max-h-[800px] overflow-y-auto">
        <main className="w-full flex flex-col items-center pl-2 pr-4 gap-4">
          <div className="text-center  w-full">
            <h2 className="text-lg font-extrabold pixelify-sans tracking-tight bg-gradient-to-r from-[#ffa500] via-[#ffcc00] to-[#ff8800] bg-clip-text text-transparent">
              TOKEN SAFETY CHECK
            </h2>
            <p className="text-sm text-[#ffa500] leading-relaxed pixelify-sans">
              Verify tokens across major chains to avoid scams and trade safely
            </p>
          </div>

          {/* API Endpoint Tabs */}
          <div className="w-full">
            <div className="grid grid-cols-2 gap-1 p-1 bg-black/80 border border-[#ffa500]/50 rounded-lg overflow-hidden mb-3">
              <div className="col-span-2 grid grid-cols-2 gap-1">
                <button
                  className={`flex-1 px-2 py-2 text-xs font-medium cursor-pointer rounded-md transition-colors flex items-center justify-center gap-1 ${
                    endpoint === "honeypot"
                      ? "bg-[#ffa500] text-black"
                      : "text-[#ffa500] hover:bg-black/90"
                  }`}
                  onClick={() => {
                    setEndpoint("honeypot");
                    setContractAddress("");
                    setError(null);
                  }}
                >
                  <AlertTriangle className="h-3 w-3" />
                  <span>Honeypot</span>
                </button>
                <button
                  className={`flex-1 px-2 py-2 text-xs font-medium cursor-pointer rounded-md transition-colors flex items-center justify-center gap-1 ${
                    endpoint === "contract"
                      ? "bg-[#ffa500] text-black"
                      : "text-[#ffa500] hover:bg-black/90"
                  }`}
                  onClick={() => {
                    setEndpoint("contract");
                    setContractAddress("");
                    setError(null);
                  }}
                >
                  <CheckCircle className="h-3 w-3" />
                  <span>Contract</span>
                </button>
              </div>
              <div className="col-span-2 grid grid-cols-2 gap-1">
                <button
                  className={`flex-1 px-2 py-2 text-xs font-medium cursor-pointer rounded-md transition-colors flex items-center justify-center gap-1 ${
                    endpoint === "pairs"
                      ? "bg-[#ffa500] text-black"
                      : "text-[#ffa500] hover:bg-black/90"
                  }`}
                  onClick={() => {
                    setEndpoint("pairs");
                    setContractAddress("");
                    setError(null);
                  }}
                >
                  <Search className="h-3 w-3" />
                  <span>Pairs</span>
                </button>
                <button
                  className={`flex-1 px-2 py-2 text-xs font-medium cursor-pointer rounded-md transition-colors flex items-center justify-center gap-1 ${
                    endpoint === "holders"
                      ? "bg-[#ffa500] text-black"
                      : "text-[#ffa500] hover:bg-black/90"
                  }`}
                  onClick={() => {
                    setEndpoint("holders");
                    setContractAddress("");
                    setError(null);
                  }}
                >
                  <Info className="h-3 w-3" />
                  <span>Holders</span>
                </button>
              </div>
            </div>
          </div>

          {/* Contract checker form */}
          <div className="w-full backdrop-blur-lg bg-black/50 p-4 rounded-xl border border-[#ffa500]/30 shadow-xl relative z-[10]">
            <form onSubmit={handleCheck} className="space-y-3">
              <div className="space-y-1">
                <label className="pixelify-sans block text-sm font-medium text-[#ffa500]">
                  CONTRACT ADDRESS
                </label>
                <div className="relative w-full">
                  <input
                    type="text"
                    placeholder="Enter a contract address (0x...)"
                    value={contractAddress}
                    onChange={(e) => setContractAddress(e.target.value)}
                    disabled={isLoading}
                    className="pixelify-sans w-full pl-8 pr-3 py-1.5 rounded-md bg-[#111] border border-[#ffa500]/50 text-[#00ffff] focus:ring-[#ffa500] focus:border-[#ffa500] focus:outline-none focus:ring-1 text-xs placeholder:text-[#ffa500]/50"
                    style={{
                      backgroundColor: "#111",
                      color: "#00ffff",
                      caretColor: "#ffa500",
                      WebkitTextFillColor: "#00ffff",
                    }}
                  />
                  <div className="absolute left-2 top-1/2 transform -translate-y-1/2 text-[#ffa500]">
                    <Search className="h-3.5 w-3.5" />
                  </div>
                </div>
              </div>

              <div className="space-y-1">
                <div className="flex justify-between items-center">
                  <label className="pixelify-sans block text-sm font-medium text-[#ffa500]">
                    BLOCKCHAIN NETWORK
                  </label>

                  {/* Auto-detect toggle */}
                  <div className="flex items-center gap-2">
                    <span className="pixelify-sans text-xs text-[#00ffff]">
                      Auto-detect
                    </span>
                    <label className="relative inline-flex items-center cursor-pointer">
                      <input
                        type="checkbox"
                        checked={autoDetectChain}
                        onChange={() => setAutoDetectChain(!autoDetectChain)}
                        className="sr-only peer"
                      />
                      <div className="w-8 h-4 bg-[#222] peer-focus:outline-none rounded-full peer peer-checked:after:translate-x-full peer-checked:after:border-white after:content-[''] after:absolute after:top-[2px] after:left-[2px] after:bg-[#ffa500] after:border-gray-300 after:border after:rounded-full after:h-3 after:w-3 after:transition-all peer-checked:bg-[#005500]"></div>
                    </label>
                  </div>
                </div>

                <div className="relative">
                  <select
                    value={selectedChain}
                    onChange={(e) => setSelectedChain(e.target.value)}
                    disabled={
                      isLoading || (autoDetectChain && isDetectingChain)
                    }
                    className={`pixelify-sans w-full px-2 py-1.5 rounded-md bg-[#111] border border-[#ffa500]/50 text-[#00ffff] focus:ring-[#ffa500] focus:border-[#ffa500] focus:outline-none focus:ring-1 text-xs ${
                      autoDetectChain && isDetectingChain ? "opacity-60" : ""
                    }`}
                    style={{
                      backgroundColor: "#111",
                      color: "#00ffff",
                      WebkitTextFillColor: "#00ffff",
                    }}
                  >
                    <option value="1">Ethereum</option>
                    <option value="56">Binance Smart Chain</option>
                    <option value="137">Polygon</option>
                    <option value="43114">Avalanche</option>
                    <option value="42161">Arbitrum</option>
                    <option value="10">Optimism</option>
                  </select>

                  {/* Show loading indicator when detecting */}
                  {autoDetectChain && isDetectingChain && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin text-[#ffa500]" />
                    </div>
                  )}

                  {/* Show checkmark when chain is detected */}
                  {autoDetectChain && detectedChain && !isDetectingChain && (
                    <div className="absolute right-2 top-1/2 transform -translate-y-1/2">
                      <CheckCircle className="h-3.5 w-3.5 text-[#00ff00]" />
                    </div>
                  )}
                </div>

                {/* Chain detection status message */}
                {autoDetectChain && (
                  <div className="text-[10px] pixelify-sans mt-1">
                    {isDetectingChain ? (
                      <span className="text-[#ffa500]">Detecting chain...</span>
                    ) : detectedChain ? (
                      <span className="text-[#00ff00]">
                        Chain detected: {getChainName(detectedChain)}
                      </span>
                    ) : contractAddress && contractAddress.length >= 42 ? (
                      <span className="text-[#ff0000]">
                        Couldn&apos;t detect chain. Please select manually.
                      </span>
                    ) : (
                      <span className="text-[#00ffff]">
                        Chain will be auto-detected when you enter an address
                      </span>
                    )}
                  </div>
                )}
              </div>

              <div className="pt-1">
                <button
                  type="submit"
                  disabled={isLoading}
                  className="pixelify-sans w-full py-2 bg-black border border-[#ffa500] hover:bg-[#ffa500]/10 text-[#ffa500] hover:text-[#ffcc00] rounded-lg transition-all duration-200 shadow-[0_0_10px_rgba(255,165,0,0.3)] text-xs"
                >
                  {isLoading ? (
                    <div className="flex items-center justify-center gap-2">
                      <Loader2 className="h-3.5 w-3.5 animate-spin" />
                      <span>ANALYZING CONTRACT...</span>
                    </div>
                  ) : (
                    <div className="flex items-center justify-center gap-2">
                      <AlertTriangle className="h-3.5 w-3.5" />
                      <span>CHECK {endpoint.toUpperCase()}</span>
                    </div>
                  )}
                </button>
              </div>
            </form>

            {error && (
              <div className="mt-3 p-3 bg-red-500/20 border border-red-500/40 rounded-lg text-red-400 flex items-center gap-2">
                <AlertTriangle className="h-4 w-4 flex-shrink-0" />
                <p className="pixelify-sans text-xs">{error}</p>
              </div>
            )}
          </div>

          {honeypotResult && !isLoading && endpoint === "honeypot" && (
            <HoneyPotResult
              honeypotResult={{
                ...honeypotResult,
                simulationResult: {
                  ...honeypotResult.simulationResult,
                  buyGas: Number(honeypotResult.simulationResult.buyGas),
                  sellGas: Number(honeypotResult.simulationResult.sellGas),
                },
              }}
              detectedChain={detectedChain}
            />
          )}

          {/* Contract Verification Results */}
          {contractResult && !isLoading && endpoint === "contract" && (
            <ContractVertification contractResult={contractResult} />
          )}

          {/* Pairs Results */}
          {pairsResult && !isLoading && endpoint === "pairs" && (
            <PairResult pairsResult={pairsResult} />
          )}

          {/* Top Holders Results */}
          {holdersResult && !isLoading && endpoint === "holders" && (
            <TopHolders holdersResult={holdersResult} />
          )}
          {/* Results container - will be populated by the actual check results */}
          {!isLoading &&
            !error &&
            (honeypotResult ||
              contractResult ||
              pairsResult ||
              holdersResult) && (
              <div className="w-full max-h-[250px] overflow-y-auto rounded-xl border border-[#ffa500]/20 p-3 bg-black/40">
                {/* Results will render here from the respective components */}
              </div>
            )}

          <div className="w-full bg-black/40 backdrop-blur-md p-2 rounded-xl border border-[#ffa500]/20">
            <h3 className="text-center text-xs text-[#ffa500] mb-2 pixelify-sans">
              Honeypot Scanner Stats
            </h3>
            <div className="grid grid-cols-2 gap-2">
              <div className="p-2 backdrop-blur-lg bg-black/40 rounded-lg border border-[#ffa500]/20 flex flex-col items-center justify-center text-center">
                <div className="pixelify-sans text-base font-bold text-[#ffa500]">
                  4M+
                </div>
                <div className="pixelify-sans text-[10px] text-[#ffa500]/80">
                  Tokens Scanned
                </div>
              </div>
              <div className="p-2 backdrop-blur-lg bg-black/40 rounded-lg border border-[#ffa500]/20 flex flex-col items-center justify-center text-center">
                <div className="pixelify-sans text-base font-bold text-[#ffa500]">
                  926K+
                </div>
                <div className="pixelify-sans text-[10px] text-[#ffa500]/80">
                  NFTs Analyzed
                </div>
              </div>
              <div className="p-2 backdrop-blur-lg bg-black/40 rounded-lg border border-[#ffa500]/20 flex flex-col items-center justify-center text-center">
                <div className="pixelify-sans text-base font-bold text-[#ffa500]">
                  6 Chains
                </div>
                <div className="pixelify-sans text-[10px] text-[#ffa500]/80">
                  Protected Networks
                </div>
              </div>
              <div className="p-2 backdrop-blur-lg bg-black/40 rounded-lg border border-[#ffa500]/20 flex flex-col items-center justify-center text-center">
                <div className="pixelify-sans text-base font-bold text-[#ffa500]">
                  5.5M+
                </div>
                <div className="pixelify-sans text-[10px] text-[#ffa500]/80">
                  Wallets Flagged
                </div>
              </div>
            </div>

            <div className="text-xs text-[#ffa500]/60 text-center mt-2 pixelify-sans">
              RugProofAI - Powered by Honeypot.is
            </div>
          </div>
        </main>
      </div>
    </Suspense>
  );
}

export default HoneyPot;
