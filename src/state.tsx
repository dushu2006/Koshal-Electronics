import { createContext, useCallback, useContext, useEffect, useMemo, useState } from "react";
import type { DeviceId } from "./config";

interface DiagnosticState {
  device: DeviceId | null;
  symptom: string | null;
  setDevice: (d: DeviceId | null) => void;
  setSymptom: (s: string | null) => void;
}

const DiagnosticContext = createContext<DiagnosticState | null>(null);

export function DiagnosticProvider({ children }: { children: React.ReactNode }) {
  const [device, setDevice] = useState<DeviceId | null>(null);
  const [symptom, setSymptom] = useState<string | null>(null);

  const handleDevice = useCallback((d: DeviceId | null) => {
    setDevice(d);
    setSymptom(null);
  }, []);

  const value = useMemo(
    () => ({ device, symptom, setDevice: handleDevice, setSymptom }),
    [device, symptom, handleDevice]
  );

  return <DiagnosticContext.Provider value={value}>{children}</DiagnosticContext.Provider>;
}

export function useDiagnostic() {
  const ctx = useContext(DiagnosticContext);
  if (!ctx) throw new Error("useDiagnostic must be used inside DiagnosticProvider");
  return ctx;
}

export function usePrefersReducedMotion() {
  const [reduced, setReduced] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(prefers-reduced-motion: reduce)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(prefers-reduced-motion: reduce)");
    const onChange = () => setReduced(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return reduced;
}

export function useIsDesktop() {
  const [desktop, setDesktop] = useState(
    () => typeof window !== "undefined" && window.matchMedia("(min-width: 820px)").matches
  );
  useEffect(() => {
    const mq = window.matchMedia("(min-width: 820px)");
    const onChange = () => setDesktop(mq.matches);
    mq.addEventListener("change", onChange);
    return () => mq.removeEventListener("change", onChange);
  }, []);
  return desktop;
}
