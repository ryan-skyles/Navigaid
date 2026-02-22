import { useState, useRef, useEffect } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { Send, Bot, ArrowLeft, MessageSquarePlus } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
import { User } from "lucide-react";
import { cn } from "@/lib/utils";

interface Message {
  id: string;
  role: "user" | "assistant";
  content: string;
}

interface ApiMessage {
  message_id: number;
  sender_type: "user" | "assistant";
  message_text: string;
}

interface ApiSession {
  session_id: number;
  message_count: number;
  last_message_text: string | null;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";
const DEMO_CLIENT_ID = 1;

const ResultsPage = () => {
  const location = useLocation();
  const navigate = useNavigate();
  const initialMessage = (location.state as { initialMessage?: string })?.initialMessage;
  const hasHandledInitialMessage = useRef(false);

  const [messages, setMessages] = useState<Message[]>([]);
  const [sessions, setSessions] = useState<ApiSession[]>([]);
  const [selectedSessionId, setSelectedSessionId] = useState<number | null>(null);
  const [input, setInput] = useState("");
  const [isLoadingSessions, setIsLoadingSessions] = useState(true);
  const [isLoadingMessages, setIsLoadingMessages] = useState(false);
  const [isSending, setIsSending] = useState(false);
  const [isBootstrappingThread, setIsBootstrappingThread] = useState(false);
  const [error, setError] = useState("");
  const bottomRef = useRef<HTMLDivElement>(null);

  const mapApiMessage = (message: ApiMessage): Message => ({
    id: String(message.message_id),
    role: message.sender_type,
    content: message.message_text,
  });

  const loadSessions = async () => {
    setIsLoadingSessions(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/clients/${DEMO_CLIENT_ID}/sessions`);

      if (!response.ok) {
        throw new Error("Unable to load conversations.");
      }

      const data = (await response.json()) as ApiSession[];
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load conversations.");
    } finally {
      setIsLoadingSessions(false);
    }
  };

  const loadMessages = async (sessionId: number) => {
    setIsLoadingMessages(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}/messages`);

      if (!response.ok) {
        throw new Error("Unable to load chat history.");
      }

      const data = (await response.json()) as ApiMessage[];
      setMessages(data.map(mapApiMessage));
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load chat history.");
    } finally {
      setIsLoadingMessages(false);
    }
  };

  const createSession = async () => {
    const response = await fetch(`${API_BASE_URL}/api/clients/${DEMO_CLIENT_ID}/sessions`, {
      method: "POST",
      headers: {
        "Content-Type": "application/json",
      },
    });

    if (!response.ok) {
      throw new Error("Unable to create conversation.");
    }

    const createdSession = (await response.json()) as ApiSession;
    return createdSession;
  };

  useEffect(() => {
    loadSessions();
  }, []);

  useEffect(() => {
    const bootstrapInitialMessage = async () => {
      if (!initialMessage || hasHandledInitialMessage.current) {
        return;
      }

      hasHandledInitialMessage.current = true;
      setIsBootstrappingThread(true);
      setError("");

      try {
        const newSession = await createSession();
        setSelectedSessionId(newSession.session_id);

        const response = await fetch(`${API_BASE_URL}/api/sessions/${newSession.session_id}/messages`, {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            messageText: initialMessage.trim(),
            senderType: "user",
          }),
        });

        if (!response.ok) {
          throw new Error("Unable to save first message.");
        }

        await loadSessions();
        await loadMessages(newSession.session_id);
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to start conversation.");
      } finally {
        navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
        setIsBootstrappingThread(false);
      }
    };

    bootstrapInitialMessage();
  }, [initialMessage, location.pathname, location.search, navigate]);

  const sendMessage = async (text: string) => {
    if (!text.trim()) return;

    setIsSending(true);
    setError("");

    try {
      let sessionId = selectedSessionId;

      if (!sessionId) {
        const newSession = await createSession();
        sessionId = newSession.session_id;
        setSelectedSessionId(sessionId);
      }

      const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}/messages`, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify({
          messageText: text.trim(),
          senderType: "user",
        }),
      });

      if (!response.ok) {
        throw new Error("Unable to save message.");
      }

      const savedMessage = (await response.json()) as ApiMessage;
      setMessages((prev) => [...prev, mapApiMessage(savedMessage)]);
      setInput("");
      await loadSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save message.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) {
      e.preventDefault();
      sendMessage(input);
    }
  };

  const handleSessionSelect = async (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setMessages([]);
    await loadMessages(sessionId);
  };

  const handleBackToSessions = () => {
    setSelectedSessionId(null);
    setMessages([]);
    setInput("");
    setError("");
  };

  if (selectedSessionId === null && !isBootstrappingThread) {
    return (
      <div className="flex flex-col h-[70vh] max-h-[70vh] px-4 py-4 gap-4">
        <div className="flex items-center justify-between">
          <h1 className="font-display text-lg font-semibold text-foreground">Your Conversations</h1>
          <Button
            size="sm"
            className="gap-1"
            onClick={async () => {
              try {
                setError("");
                const newSession = await createSession();
                await loadSessions();
                await handleSessionSelect(newSession.session_id);
              } catch (err) {
                setError(err instanceof Error ? err.message : "Unable to create conversation.");
              }
            }}
          >
            <MessageSquarePlus className="w-4 h-4" />
            New Chat
          </Button>
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {isLoadingSessions && <p className="text-sm text-muted-foreground">Loading conversations...</p>}

        {!isLoadingSessions && sessions.length === 0 && (
          <p className="text-sm text-muted-foreground">No conversations yet. Start one to begin.</p>
        )}

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
          {sessions.map((session) => (
            <button
              key={session.session_id}
              onClick={() => handleSessionSelect(session.session_id)}
              className="text-left p-3 rounded-lg border border-border hover:border-primary/30 bg-card"
            >
              <p className="text-sm font-medium text-foreground">Conversation #{session.session_id}</p>
              <p className="text-xs text-muted-foreground mt-1 line-clamp-2">
                {session.last_message_text ?? "No messages yet"}
              </p>
              <p className="text-[11px] text-muted-foreground mt-1">{session.message_count} messages</p>
            </button>
          ))}
        </div>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] max-h-[70vh]">
      <div className="px-4 pt-4 pb-2 border-b border-border flex items-center gap-2">
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleBackToSessions}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div>
          <p className="text-sm font-medium text-foreground">Conversation #{selectedSessionId}</p>
          <p className="text-xs text-muted-foreground">Saved chat thread</p>
        </div>
      </div>

      {/* Messages */}
      <div className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {isLoadingMessages && <p className="text-sm text-muted-foreground">Loading conversation...</p>}
        {messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-12">
            Start a conversation by sending your first message.
          </div>
        )}
        {messages.map((msg) => (
          <div
            key={msg.id}
            className={cn("flex gap-2 max-w-[85%]", msg.role === "user" ? "ml-auto flex-row-reverse" : "")}
          >
            {msg.role === "assistant" && (
              <div className="w-7 h-7 rounded-full bg-accent/15 flex items-center justify-center shrink-0 mt-1">
                <Bot className="w-4 h-4 text-accent" />
              </div>
            )}
            {msg.role === "user" && (
              <Avatar className="w-7 h-7 shrink-0 mt-1">
                <AvatarFallback className="bg-primary/10 text-primary text-xs">
                  <User className="w-3.5 h-3.5" />
                </AvatarFallback>
              </Avatar>
            )}
            <div
              className={cn(
                "rounded-2xl px-3.5 py-2.5 text-sm leading-relaxed whitespace-pre-wrap",
                msg.role === "user"
                  ? "bg-primary text-primary-foreground rounded-br-md"
                  : "bg-card border border-border rounded-bl-md"
              )}
              dangerouslySetInnerHTML={{
                __html: msg.content
                  .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                  .replace(/\n/g, "<br/>"),
              }}
            />
          </div>
        ))}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="px-4 pb-4 pt-2">
        <div className="flex gap-2 items-end rounded-xl border border-border bg-card p-2">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a follow-up question..."
            className="flex-1 resize-none border-0 bg-transparent text-sm text-foreground placeholder:text-muted-foreground focus:outline-none min-h-[36px] max-h-[100px] py-1.5 px-2"
            rows={1}
          />
          <Button
            size="icon"
            className="h-8 w-8 rounded-full shrink-0"
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isSending || isLoadingMessages || isBootstrappingThread}
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </Button>
        </div>
      </div>
    </div>
  );
};

export default ResultsPage;
