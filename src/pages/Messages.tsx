import { useState } from "react";
import { Send, ArrowRight } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Link } from "react-router-dom";
import { useProjects } from "@/lib/projects";

export default function Messages() {
  const { conversations, messages, addMessage } = useProjects();
  const [activeConvo, setActiveConvo] = useState<number>(conversations[0]?.id ?? 0);
  const [newMessage, setNewMessage] = useState("");

  const activeMessages = messages[activeConvo] || [];
  const activeVendor = conversations.find((c) => c.id === activeConvo);

  const handleSend = () => {
    if (!newMessage.trim()) return;
    addMessage(activeConvo, {
      id: Date.now(),
      sender: "brand",
      text: newMessage.trim(),
      time: "Just now",
    });
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
              {conversations.map((convo) => (
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
              {activeVendor && (
                <Link to={`/workbench/${activeVendor.projectId}`}>
                  <Button variant="ghost" size="sm" className="font-mono text-[10px]">
                    View in Workbench <ArrowRight className="ml-1 h-3 w-3" />
                  </Button>
                </Link>
              )}
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
