import { useState } from "react";
import { Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";

interface Conversation {
  id: number;
  vendor: string;
  region: string;
  project: string;
  lastMessage: string;
  time: string;
  unread: boolean;
}

const CONVERSATIONS: Conversation[] = [
  { id: 1, vendor: "Ateliê Nova", region: "PT", project: "FW26 Hoodie Program", lastMessage: "Sample shipment confirmed — tracking sent.", time: "2h ago", unread: true },
  { id: 2, vendor: "Brooklyn Garment Dist.", region: "US", project: "Selvedge Denim Jean", lastMessage: "Updated pricing for 300-unit run attached.", time: "5h ago", unread: true },
  { id: 3, vendor: "Shenzhen Textile Co.", region: "CN", project: "Heavy Tee Blanks", lastMessage: "Fabric swatch options ready for review.", time: "1d ago", unread: false },
  { id: 4, vendor: "Porto Fleece Works", region: "PT", project: "Organic Fleece Crew", lastMessage: "We can accommodate your timeline. Let's discuss specs.", time: "2d ago", unread: false },
];

interface Message {
  id: number;
  sender: "brand" | "vendor";
  text: string;
  time: string;
}

const MOCK_MESSAGES: Record<number, Message[]> = {
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
    { id: 3, sender: "vendor", text: "Are you set on chain stitch hemming, or open to lock stitch for cost efficiency?", time: "Yesterday, 12:15 PM" },
    { id: 4, sender: "brand", text: "Chain stitch is non-negotiable for this project. What's the cost delta?", time: "Yesterday, 1:00 PM" },
    { id: 5, sender: "vendor", text: "Updated pricing for 300-unit run attached.", time: "Today, 8:00 AM" },
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

export default function Messages() {
  const [activeConvo, setActiveConvo] = useState<number>(1);
  const [newMessage, setNewMessage] = useState("");
  const [localMessages, setLocalMessages] = useState<Record<number, Message[]>>(MOCK_MESSAGES);

  const activeMessages = localMessages[activeConvo] || [];
  const activeVendor = CONVERSATIONS.find((c) => c.id === activeConvo);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    const msg: Message = {
      id: Date.now(),
      sender: "brand",
      text: newMessage.trim(),
      time: "Just now",
    };
    setLocalMessages((prev) => ({
      ...prev,
      [activeConvo]: [...(prev[activeConvo] || []), msg],
    }));
    setNewMessage("");
  };

  return (
    <div>
      {/* Header */}
      <section className="border-b border-foreground/10">
        <div className="container py-6">
          <p className="font-mono text-[10px] uppercase tracking-[0.3em] text-muted-foreground mb-1">Communication</p>
          <h1 className="font-display text-2xl md:text-3xl font-800 uppercase tracking-tight">Messages</h1>
        </div>
      </section>

      {/* Chat layout */}
      <div className="container py-0">
        <div className="grid md:grid-cols-12 min-h-[calc(100vh-12rem)]">
          {/* Conversation list */}
          <div className="md:col-span-4 border-r border-foreground/10">
            <div className="divide-y divide-foreground/10">
              {CONVERSATIONS.map((convo) => (
                <button
                  key={convo.id}
                  onClick={() => setActiveConvo(convo.id)}
                  className={`w-full text-left p-4 transition-colors ${
                    activeConvo === convo.id ? "bg-muted/50" : "hover:bg-muted/30"
                  }`}
                >
                  <div className="flex items-start justify-between mb-1">
                    <h3 className={`font-body text-sm ${convo.unread ? "font-700" : "font-500"}`}>{convo.vendor}</h3>
                    <span className="font-mono text-[9px] text-muted-foreground/50 uppercase flex-shrink-0">{convo.time}</span>
                  </div>
                  <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider mb-1.5">
                    {convo.project} · {convo.region}
                  </p>
                  <p className={`font-body text-xs truncate ${convo.unread ? "text-foreground" : "text-muted-foreground"}`}>
                    {convo.lastMessage}
                  </p>
                  {convo.unread && <div className="w-1.5 h-1.5 bg-signal mt-1" />}
                </button>
              ))}
            </div>
          </div>

          {/* Message thread */}
          <div className="md:col-span-8 flex flex-col">
            {/* Thread header */}
            <div className="p-4 border-b border-foreground/10 flex items-center justify-between">
              <div>
                <h2 className="font-body text-sm font-600">{activeVendor?.vendor}</h2>
                <p className="font-mono text-[10px] text-muted-foreground uppercase tracking-wider">
                  {activeVendor?.project} · {activeVendor?.region}
                </p>
              </div>
              <Link to="/workbench">
                <Button variant="ghost" size="sm" className="font-mono text-[10px]">
                  View in Workbench <ArrowRight className="ml-1 h-3 w-3" />
                </Button>
              </Link>
            </div>

            {/* Messages */}
            <div className="flex-1 overflow-y-auto p-4 space-y-4">
              {activeMessages.map((msg) => (
                <div key={msg.id} className={`flex ${msg.sender === "brand" ? "justify-end" : "justify-start"}`}>
                  <div className={`max-w-[75%] ${msg.sender === "brand" ? "bg-foreground text-background" : "bg-muted"} p-3`}>
                    <p className="font-body text-sm leading-relaxed">{msg.text}</p>
                    <span className={`font-mono text-[9px] mt-1.5 block ${
                      msg.sender === "brand" ? "text-background/40" : "text-muted-foreground/50"
                    }`}>
                      {msg.time}
                    </span>
                  </div>
                </div>
              ))}
            </div>

            {/* Compose */}
            <div className="p-4 border-t border-foreground/10">
              <div className="flex gap-2">
                <input
                  value={newMessage}
                  onChange={(e) => setNewMessage(e.target.value)}
                  onKeyDown={(e) => e.key === "Enter" && handleSend()}
                  placeholder="Type a message..."
                  className="flex-1 bg-transparent border border-foreground/20 px-4 py-3 font-body text-sm text-foreground placeholder:text-muted-foreground/40 focus:outline-none focus:border-foreground transition-colors"
                />
                <Button variant="editorial" size="default" onClick={handleSend} disabled={!newMessage.trim()}>
                  <Send className="h-4 w-4" />
                </Button>
              </div>
              <p className="font-mono text-[9px] text-muted-foreground/40 uppercase tracking-wider mt-2">
                All communication stays within Threadline for your protection.
              </p>
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}
