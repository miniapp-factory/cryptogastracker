"use client";

import { useEffect, useState } from "react";
import { Button } from "@/components/ui/button";
import { Card, CardHeader, CardContent, CardFooter } from "@/components/ui/card";
import { Input } from "@/components/ui/input";
import { cn } from "@/lib/utils";

const GAS_RANGES = {
  base: { low: 30, average: 60, high: 120 },
  ethereum: { low: 20, average: 40, high: 80 },
};

function getColor(level: string) {
  switch (level) {
    case "low":
      return "text-green-600";
    case "average":
      return "text-yellow-600";
    case "high":
      return "text-red-600";
    default:
      return "text-muted-foreground";
  }
}

export default function GasTracker() {
  const [gasData, setGasData] = useState({
    base: { current: 0, level: "low" },
    ethereum: { current: 0, level: "low" },
  });
  const [gasUnits, setGasUnits] = useState("");
  const [estimate, setEstimate] = useState<number | null>(null);
  const [explanation, setExplanation] = useState("");

  const fetchGas = () => {
    // Simulate real‑time data with random values within ranges
    const newData = {
      base: {
        current: Math.floor(
          Math.random() * (GAS_RANGES.base.high - GAS_RANGES.base.low + 1) +
            GAS_RANGES.base.low
        ),
        level: Math.random() < 0.33
          ? "low"
          : Math.random() < 0.66
          ? "average"
          : "high",
      },
      ethereum: {
        current: Math.floor(
          Math.random() * (GAS_RANGES.ethereum.high - GAS_RANGES.ethereum.low + 1) +
            GAS_RANGES.ethereum.low
        ),
        level: Math.random() < 0.33
          ? "low"
          : Math.random() < 0.66
          ? "average"
          : "high",
      },
    };
    setGasData(newData);
  };

  useEffect(() => {
    fetchGas();
  }, []);

  const handleRefresh = () => {
    fetchGas();
  };

  const handleEstimate = () => {
    const units = parseInt(gasUnits, 10);
    if (!isNaN(units)) {
      // Simple estimation: average gas price * units
      const avgPrice = (GAS_RANGES.base.average + GAS_RANGES.ethereum.average) / 2;
      setEstimate(units * avgPrice);
    }
  };

  const handleExplain = () => {
    setExplanation(
      "Gas fees are paid to miners to include your transaction in a block. Lower fees mean slower confirmation times, while higher fees get your transaction processed faster."
    );
  };

  return (
    <Card className="w-full max-w-md">
      <CardHeader>
        <h2 className="text-xl font-semibold">GasPulse – Crypto Gas Fee Tracker</h2>
      </CardHeader>
      <CardContent className="grid gap-4">
        <div className="grid gap-2">
          <span className={cn("font-medium", getColor(gasData.base.level))}>
            Base: {gasData.base.current} Gwei ({gasData.base.level})
          </span>
          <span className={cn("font-medium", getColor(gasData.ethereum.level))}>
            Ethereum: {gasData.ethereum.current} Gwei ({gasData.ethereum.level})
          </span>
        </div>
        <Button variant="outline" onClick={handleRefresh}>
          Refresh Gas Data
        </Button>
        <div className="grid gap-2">
          <Input
            placeholder="Enter gas units"
            value={gasUnits}
            onChange={(e) => setGasUnits(e.target.value)}
          />
          <Button onClick={handleEstimate}>Estimate Transaction Cost</Button>
          {estimate !== null && (
            <span className="text-muted-foreground">
              Estimated Cost: {estimate.toFixed(2)} Gwei
            </span>
          )}
        </div>
        <Button onClick={handleExplain}>What are gas fees?</Button>
        {explanation && (
          <p className="text-muted-foreground text-sm">{explanation}</p>
        )}
      </CardContent>
      <CardFooter className="flex justify-end">
        <Button onClick={handleRefresh}>Check Gas Now</Button>
      </CardFooter>
    </Card>
  );
}
