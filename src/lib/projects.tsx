import { createContext, useContext, useState, ReactNode, useCallback } from "react";

export interface ProjectThread {
  id: number;
  vendor: string;
  product: string;
  stage: string;
  region: string;
  updated: string;
  priority: boolean;
  category: string;
  labelName: string;
  quantity: string;
  tier: string;
  matchScore?: number;
  timeline: { stage: string; date: string; note: string }[];
}

export interface ConversationMessage {
  id: number;
  sender: "brand" | "vendor";
  text: string;
  time: string;
}

export interface Conversation {
  id: number;
  vendor: string;
  region: string;
  project: string;
  lastMessage: string;
  time: string;
  unread: boolean;
  projectId: number;
}

export interface Invoice {
  id: number;
  projectId: number;
  vendor: string;
  description: string;
  amount: number;
  status: "pending" | "paid";
  date: string;
  paidDate?: string;
}

// Seed data
const SEED_THREADS: ProjectThread[] = [
  {
    id: 1, vendor: "Ateliê Nova", product: "FW26 Hoodie Program", stage: "sample", region: "PT", updated: "2h ago", priority: true,
    category: "Cut & Sew", labelName: "My Brand", quantity: "200-300", tier: "Premium", matchScore: 94,
    timeline: [
      { stage: "brief", date: "Feb 12", note: "Brief submitted with hoodie specs and colorways" },
      { stage: "matched", date: "Feb 14", note: "Ateliê Nova accepted — 94% match score" },
      { stage: "sample", date: "Feb 28", note: "First sample in production, stone wash colorway added" },
    ],
  },
  {
    id: 2, vendor: "Shenzhen Textile Co.", product: "Heavy Tee Blanks", stage: "production", region: "CN", updated: "5h ago", priority: false,
    category: "Heavyweight Jersey", labelName: "My Brand", quantity: "500", tier: "Luxury",
    timeline: [
      { stage: "brief", date: "Jan 20", note: "Brief submitted for 420gsm tee blanks" },
      { stage: "matched", date: "Jan 22", note: "Shenzhen Textile matched — premium heavyweight specialist" },
      { stage: "sample", date: "Feb 5", note: "Samples approved after one revision" },
      { stage: "production", date: "Feb 18", note: "Bulk production started — 500 units, 3 colorways" },
    ],
  },
  {
    id: 3, vendor: "Brooklyn Garment Dist.", product: "Selvedge Denim Jean", stage: "matched", region: "US", updated: "1d ago", priority: true,
    category: "Denim", labelName: "My Brand", quantity: "300", tier: "Premium", matchScore: 82,
    timeline: [
      { stage: "brief", date: "Mar 1", note: "Brief submitted for selvedge denim program" },
      { stage: "matched", date: "Mar 3", note: "Brooklyn Garment matched — discussing construction details" },
    ],
  },
  {
    id: 4, vendor: "Porto Fleece Works", product: "Organic Fleece Crew", stage: "brief", region: "PT", updated: "3d ago", priority: false,
    category: "Fleece", labelName: "My Brand", quantity: "100", tier: "Premium", matchScore: 87,
    timeline: [
      { stage: "brief", date: "Mar 5", note: "Brief submitted — awaiting vendor review" },
    ],
  },
  {
    id: 5, vendor: "Istanbul Knits Co.", product: "Merino Wool Cardigan", stage: "shipped", region: "TR", updated: "6h ago", priority: true,
    category: "Knitwear", labelName: "My Brand", quantity: "250", tier: "Premium", matchScore: 91,
    timeline: [
      { stage: "brief", date: "Jan 5", note: "Brief submitted for merino wool cardigan program" },
      { stage: "matched", date: "Jan 8", note: "Istanbul Knits matched — 91% match, knitwear specialist" },
      { stage: "sample", date: "Jan 22", note: "Samples approved on first round — excellent construction" },
      { stage: "production", date: "Feb 10", note: "Bulk production completed — 250 units, 2 colorways" },
      { stage: "shipped", date: "Mar 1", note: "Final QC passed. Shipped via air freight — tracking: TK-88291" },
    ],
  },
  {
    id: 6, vendor: "Kyoto Textile Lab", product: "SS25 Linen Camp Shirt", stage: "complete", region: "JP", updated: "5d ago", priority: false,
    category: "Shirting", labelName: "My Brand", quantity: "400", tier: "Luxury", matchScore: 96,
    timeline: [
      { stage: "brief", date: "Nov 15", note: "Brief submitted for linen camp collar shirt" },
      { stage: "matched", date: "Nov 18", note: "Kyoto Textile Lab matched — 96% match, premium Japanese linen" },
      { stage: "sample", date: "Dec 5", note: "Samples received and approved after minor collar adjustment" },
      { stage: "production", date: "Jan 10", note: "Production completed — 400 units across 4 colorways" },
      { stage: "shipped", date: "Feb 1", note: "Shipped from Osaka port, cleared customs Feb 12" },
      { stage: "complete", date: "Feb 15", note: "Delivery confirmed — all 400 units received in perfect condition" },
    ],
  },
];

const SEED_CONVERSATIONS: Conversation[] = [
  { id: 1, vendor: "Ateliê Nova", region: "PT", project: "FW26 Hoodie Program", lastMessage: "Sample shipment confirmed — tracking sent.", time: "2h ago", unread: true, projectId: 1 },
  { id: 2, vendor: "Brooklyn Garment Dist.", region: "US", project: "Selvedge Denim Jean", lastMessage: "Updated pricing for 300-unit run attached.", time: "5h ago", unread: true, projectId: 3 },
  { id: 3, vendor: "Shenzhen Textile Co.", region: "CN", project: "Heavy Tee Blanks", lastMessage: "Fabric swatch options ready for review.", time: "1d ago", unread: false, projectId: 2 },
  { id: 4, vendor: "Porto Fleece Works", region: "PT", project: "Organic Fleece Crew", lastMessage: "We can accommodate your timeline. Let's discuss specs.", time: "2d ago", unread: false, projectId: 4 },
  { id: 5, vendor: "Istanbul Knits Co.", region: "TR", project: "Merino Wool Cardigan", lastMessage: "Shipment is in transit — expected delivery in 3 days.", time: "6h ago", unread: true, projectId: 5 },
  { id: 6, vendor: "Kyoto Textile Lab", region: "JP", project: "SS25 Linen Camp Shirt", lastMessage: "Thank you! Looking forward to your next order.", time: "5d ago", unread: false, projectId: 6 },
];

const SEED_MESSAGES: Record<number, ConversationMessage[]> = {
  1: [
    { id: 1, sender: "brand", text: "Hi — following up on the hoodie samples. Any update on the timeline?", time: "Yesterday, 2:15 PM" },
    { id: 2, sender: "vendor", text: "Yes! We've completed the first round. Shipping out tomorrow via DHL Express.", time: "Yesterday, 4:30 PM" },
    { id: 3, sender: "brand", text: "Great. Can you include the alternate colorway we discussed?", time: "Today, 9:00 AM" },
    { id: 4, sender: "vendor", text: "Absolutely. Adding the stone wash variant. You'll have both.", time: "Today, 10:20 AM" },
    { id: 5, sender: "vendor", text: "Sample shipment confirmed — tracking sent.", time: "Today, 11:45 AM" },
  ],
  2: [
    { id: 1, sender: "vendor", text: "Hi, we've reviewed your brief for the selvedge program. A few questions on construction.", time: "Yesterday, 11:00 AM" },
    { id: 2, sender: "brand", text: "Sure — what do you need to know?", time: "Yesterday, 11:30 AM" },
    { id: 3, sender: "vendor", text: "Updated pricing for 300-unit run attached.", time: "Today, 8:00 AM" },
  ],
  3: [
    { id: 1, sender: "brand", text: "Looking for 400gsm+ jersey. Do you carry that weight?", time: "2 days ago" },
    { id: 2, sender: "vendor", text: "Yes — we stock 420gsm and 460gsm in our premium range.", time: "2 days ago" },
    { id: 3, sender: "vendor", text: "Fabric swatch options ready for review.", time: "1 day ago" },
  ],
  4: [
    { id: 1, sender: "vendor", text: "Thank you for the brief. Your fleece specs align well with our organic line.", time: "3 days ago" },
    { id: 2, sender: "vendor", text: "We can accommodate your timeline. Let's discuss specs.", time: "2 days ago" },
  ],
};

const SEED_INVOICES: Invoice[] = [
  { id: 1, projectId: 1, vendor: "Ateliê Nova", description: "Sampling fee — FW26 Hoodie (3 colorways)", amount: 450, status: "paid", date: "Feb 28", paidDate: "Mar 1" },
  { id: 2, projectId: 2, vendor: "Shenzhen Textile Co.", description: "Production deposit — Heavy Tee Blanks (50%)", amount: 3750, status: "paid", date: "Feb 18", paidDate: "Feb 19" },
  { id: 3, projectId: 2, vendor: "Shenzhen Textile Co.", description: "Production balance — Heavy Tee Blanks (50%)", amount: 3750, status: "pending", date: "Mar 8" },
  { id: 4, projectId: 1, vendor: "Ateliê Nova", description: "Production deposit — FW26 Hoodie Program", amount: 4200, status: "pending", date: "Mar 7" },
  { id: 5, projectId: 3, vendor: "Brooklyn Garment Dist.", description: "Sampling fee — Selvedge Denim Jean", amount: 600, status: "pending", date: "Mar 5" },
];

interface BriefData {
  labelName: string;
  category: string;
  tier: string;
  quantity: string;
  description: string;
}

interface ProjectsContextType {
  threads: ProjectThread[];
  conversations: Conversation[];
  messages: Record<number, ConversationMessage[]>;
  invoices: Invoice[];
  addProjectFromBrief: (vendor: { id: number; name: string; region: string; category: string; match: number }, brief: BriefData) => number;
  addDirectProject: (vendorName: string, brief: BriefData) => number;
  addMessage: (convoId: number, msg: ConversationMessage) => void;
  getProject: (id: string) => ProjectThread | undefined;
  payInvoice: (invoiceId: number) => void;
}

const ProjectsContext = createContext<ProjectsContextType | null>(null);

let nextProjectId = 100;
let nextConvoId = 100;

export function ProjectsProvider({ children }: { children: ReactNode }) {
  const [threads, setThreads] = useState<ProjectThread[]>(SEED_THREADS);
  const [conversations, setConversations] = useState<Conversation[]>(SEED_CONVERSATIONS);
  const [messages, setMessages] = useState<Record<number, ConversationMessage[]>>(SEED_MESSAGES);
  const [invoices, setInvoices] = useState<Invoice[]>(SEED_INVOICES);

  const addProjectFromBrief = useCallback((
    vendor: { id: number; name: string; region: string; category: string; match: number },
    brief: BriefData
  ) => {
    const projectId = nextProjectId++;
    const convoId = nextConvoId++;
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const productName = brief.category ? `${brief.category} Project` : "New Project";

    const thread: ProjectThread = {
      id: projectId,
      vendor: vendor.name,
      product: productName,
      stage: "brief",
      region: vendor.region,
      updated: "Just now",
      priority: false,
      category: brief.category,
      labelName: brief.labelName,
      quantity: brief.quantity,
      tier: brief.tier,
      matchScore: vendor.match,
      timeline: [
        { stage: "brief", date: today, note: `Brief submitted to ${vendor.name} — ${vendor.match}% match` },
      ],
    };

    const convo: Conversation = {
      id: convoId,
      vendor: vendor.name,
      region: vendor.region,
      project: productName,
      lastMessage: `Project request sent — awaiting ${vendor.name}'s response.`,
      time: "Just now",
      unread: false,
      projectId,
    };

    const initialMessages: ConversationMessage[] = [
      {
        id: 1,
        sender: "brand",
        text: `Hi ${vendor.name} — I've submitted a project for ${brief.category || "a new product"}${brief.quantity ? ` (${brief.quantity} units)` : ""}. Looking forward to discussing details!`,
        time: "Just now",
      },
    ];

    setThreads((prev) => [thread, ...prev]);
    setConversations((prev) => [convo, ...prev]);
    setMessages((prev) => ({ ...prev, [convoId]: initialMessages }));

    return projectId;
  }, []);

  const addDirectProject = useCallback((vendorName: string, brief: BriefData) => {
    const projectId = nextProjectId++;
    const convoId = nextConvoId++;
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    const productName = brief.category ? `${brief.category} Project` : "New Project";

    const thread: ProjectThread = {
      id: projectId,
      vendor: vendorName,
      product: productName,
      stage: "brief",
      region: "—",
      updated: "Just now",
      priority: false,
      category: brief.category,
      labelName: brief.labelName,
      quantity: brief.quantity,
      tier: brief.tier,
      timeline: [
        { stage: "brief", date: today, note: `Brief submitted directly to ${vendorName}` },
      ],
    };

    const convo: Conversation = {
      id: convoId,
      vendor: vendorName,
      region: "—",
      project: productName,
      lastMessage: `Project request sent — awaiting ${vendorName}'s response.`,
      time: "Just now",
      unread: false,
      projectId,
    };

    const initialMessages: ConversationMessage[] = [
      {
        id: 1,
        sender: "brand",
        text: `Hi — I've submitted a project brief for ${brief.category || "a new product"}. Looking forward to working together!`,
        time: "Just now",
      },
    ];

    setThreads((prev) => [thread, ...prev]);
    setConversations((prev) => [convo, ...prev]);
    setMessages((prev) => ({ ...prev, [convoId]: initialMessages }));

    return projectId;
  }, []);

  const addMessage = useCallback((convoId: number, msg: ConversationMessage) => {
    setMessages((prev) => ({
      ...prev,
      [convoId]: [...(prev[convoId] || []), msg],
    }));
    setConversations((prev) =>
      prev.map((c) => c.id === convoId ? { ...c, lastMessage: msg.text, time: "Just now" } : c)
    );
  }, []);

  const getProject = useCallback((id: string) => {
    return threads.find((t) => t.id === Number(id));
  }, [threads]);

  const payInvoice = useCallback((invoiceId: number) => {
    const today = new Date().toLocaleDateString("en-US", { month: "short", day: "numeric" });
    setInvoices((prev) =>
      prev.map((inv) => inv.id === invoiceId ? { ...inv, status: "paid" as const, paidDate: today } : inv)
    );
  }, []);

  return (
    <ProjectsContext.Provider value={{ threads, conversations, messages, invoices, addProjectFromBrief, addDirectProject, addMessage, getProject, payInvoice }}>
      {children}
    </ProjectsContext.Provider>
  );
}

export function useProjects() {
  const ctx = useContext(ProjectsContext);
  if (!ctx) throw new Error("useProjects must be used within ProjectsProvider");
  return ctx;
}
