import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { VendorLayout } from "@/components/layout/VendorLayout";
import { VendorActionsProvider } from "@/lib/vendors";
import { ProjectsProvider } from "@/lib/projects";
import { ProjectFeaturesProvider } from "@/lib/project-features";
import { AuthProvider } from "@/lib/auth";
import { VendorAuthProvider } from "@/lib/vendor-auth";
import Index from "./pages/Index";
import Vendors from "./pages/Vendors";
import Join from "./pages/Join";
import BriefBuilder from "./pages/BriefBuilder";
import Workbench from "./pages/Workbench";
import ProjectDetail from "./pages/ProjectDetail";
import HowItWorks from "./pages/HowItWorks";
import ForManufacturers from "./pages/ForManufacturers";
import Messages from "./pages/Messages";
import SavedVendors from "./pages/SavedVendors";
import CompareVendors from "./pages/CompareVendors";
import Concierge from "./pages/Concierge";
import SourcingGuide from "./pages/SourcingGuide";
import BuyerProtection from "./pages/BuyerProtection";
import NotFound from "./pages/NotFound";
import VendorLogin from "./pages/vendor/VendorLogin";
import VendorDashboard from "./pages/vendor/VendorDashboard";
import VendorBriefs from "./pages/vendor/VendorBriefs";
import VendorProjects from "./pages/vendor/VendorProjects";
import VendorProfile from "./pages/vendor/VendorProfile";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <AuthProvider>
      <VendorAuthProvider>
      <VendorActionsProvider>
        <ProjectsProvider>
        <ProjectFeaturesProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
          <Routes>
            {/* Vendor portal — separate layout */}
            <Route path="/vendor/login" element={<VendorLogin />} />
            <Route path="/vendor" element={<VendorLayout><VendorDashboard /></VendorLayout>} />
            <Route path="/vendor/briefs" element={<VendorLayout><VendorBriefs /></VendorLayout>} />
            <Route path="/vendor/projects" element={<VendorLayout><VendorProjects /></VendorLayout>} />
            <Route path="/vendor/profile" element={<VendorLayout><VendorProfile /></VendorLayout>} />

            {/* Brand / buyer site */}
            <Route path="/*" element={
              <SiteLayout>
                <Routes>
                  <Route path="/" element={<Index />} />
                  <Route path="/vendors" element={<Vendors />} />
                  <Route path="/join" element={<Join />} />
                  <Route path="/brief" element={<BriefBuilder />} />
                  <Route path="/workbench" element={<Workbench />} />
                  <Route path="/workbench/:id" element={<ProjectDetail />} />
                  <Route path="/how-it-works" element={<HowItWorks />} />
                  <Route path="/manufacturers" element={<ForManufacturers />} />
                  <Route path="/messages" element={<Messages />} />
                  <Route path="/saved" element={<SavedVendors />} />
                  <Route path="/compare" element={<CompareVendors />} />
                  <Route path="/concierge" element={<Concierge />} />
                  <Route path="/sourcing-guide" element={<SourcingGuide />} />
                  <Route path="/buyer-protection" element={<BuyerProtection />} />
                  <Route path="*" element={<NotFound />} />
                </Routes>
              </SiteLayout>
            } />
          </Routes>
        </BrowserRouter>
        </ProjectsProvider>
      </VendorActionsProvider>
      </VendorAuthProvider>
      </AuthProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
