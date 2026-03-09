import { QueryClient, QueryClientProvider } from "@tanstack/react-query";
import { BrowserRouter, Route, Routes } from "react-router-dom";
import { Toaster as Sonner } from "@/components/ui/sonner";
import { Toaster } from "@/components/ui/toaster";
import { TooltipProvider } from "@/components/ui/tooltip";
import { SiteLayout } from "@/components/layout/SiteLayout";
import { VendorActionsProvider } from "@/lib/vendors";
import { ProjectsProvider } from "@/lib/projects";
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
import NotFound from "./pages/NotFound";

const queryClient = new QueryClient();

const App = () => (
  <QueryClientProvider client={queryClient}>
    <TooltipProvider>
      <VendorActionsProvider>
        <ProjectsProvider>
        <Toaster />
        <Sonner />
        <BrowserRouter>
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
              <Route path="*" element={<NotFound />} />
            </Routes>
          </SiteLayout>
        </BrowserRouter>
      </VendorActionsProvider>
    </TooltipProvider>
  </QueryClientProvider>
);

export default App;
