import { createContext, useContext, useState, ReactNode } from "react";

export interface VendorProfile {
  factoryName: string;
  contactName: string;
  email: string;
  region: string;
  categories: string[];
  qualityVsCost: number;
  moqMin: number;
  moqMax: number;
  leadTimeDays: number;
  certifications: string[];
  description: string;
}

const DEFAULT_PROFILE: VendorProfile = {
  factoryName: "Ateliê Nova",
  contactName: "Sofia Mendes",
  email: "sofia@atelianova.pt",
  region: "PT",
  categories: ["Cut & Sew", "Knitwear"],
  qualityVsCost: 3,
  moqMin: 100,
  moqMax: 1000,
  leadTimeDays: 21,
  certifications: ["GOTS", "OEKO-TEX"],
  description: "Lisbon-based atelier specializing in premium cut-and-sew for independent labels.",
};

interface VendorAuthContextType {
  isVendorLoggedIn: boolean;
  vendorProfile: VendorProfile;
  vendorLogin: (name: string) => void;
  vendorLogout: () => void;
  updateProfile: (updates: Partial<VendorProfile>) => void;
}

const VendorAuthContext = createContext<VendorAuthContextType>({
  isVendorLoggedIn: false,
  vendorProfile: DEFAULT_PROFILE,
  vendorLogin: () => {},
  vendorLogout: () => {},
  updateProfile: () => {},
});

export function VendorAuthProvider({ children }: { children: ReactNode }) {
  const [isVendorLoggedIn, setIsVendorLoggedIn] = useState(
    () => localStorage.getItem("tl_vendor_auth") === "1"
  );
  const [vendorProfile, setVendorProfile] = useState<VendorProfile>(() => {
    const saved = localStorage.getItem("tl_vendor_profile");
    return saved ? JSON.parse(saved) : DEFAULT_PROFILE;
  });

  const vendorLogin = (name: string) => {
    localStorage.setItem("tl_vendor_auth", "1");
    localStorage.setItem("tl_vendor_name", name);
    setIsVendorLoggedIn(true);
  };

  const vendorLogout = () => {
    localStorage.removeItem("tl_vendor_auth");
    localStorage.removeItem("tl_vendor_name");
    setIsVendorLoggedIn(false);
  };

  const updateProfile = (updates: Partial<VendorProfile>) => {
    setVendorProfile((prev) => {
      const updated = { ...prev, ...updates };
      localStorage.setItem("tl_vendor_profile", JSON.stringify(updated));
      return updated;
    });
  };

  return (
    <VendorAuthContext.Provider value={{ isVendorLoggedIn, vendorProfile, vendorLogin, vendorLogout, updateProfile }}>
      {children}
    </VendorAuthContext.Provider>
  );
}

export const useVendorAuth = () => useContext(VendorAuthContext);
