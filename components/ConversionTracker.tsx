"use client";

import { useEffect } from "react";
import { trackConversion } from "@/lib/conversionTracking";

interface ConversionTrackerProps {
  conversionId: string;
  conversionLabel: string;
  value?: number;
  currency?: string;
  triggerOnMount?: boolean;
}

export default function ConversionTracker({
  conversionId,
  conversionLabel,
  value,
  currency = "PLN",
  triggerOnMount = false,
}: ConversionTrackerProps) {
  useEffect(() => {
    if (triggerOnMount) {
      trackConversion(conversionId, conversionLabel, value, currency);
    }
  }, [conversionId, conversionLabel, value, currency, triggerOnMount]);

  return null; // This component doesn't render anything
}
