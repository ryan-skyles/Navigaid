import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Send, Star, Trash2 } from "lucide-react";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";

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

interface SendMessageResponse {
  userMessage: ApiMessage;
  assistantMessage: ApiMessage | null;
}

interface ApiSession {
  session_id: number;
  message_count: number;
  last_message_text: string | null;
  is_starred: boolean;
}

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL ?? "http://localhost:3001";
const DEMO_CLIENT_ID = 1;

const mapApiMessage = (message: ApiMessage): Message => ({
  id: String(message.message_id),
  role: message.sender_type,
  content: message.message_text,
});

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
  const [isBootstrappingThread, setIsBootstrappingThread] = useState(!!initialMessage);
  const [error, setError] = useState("");
  const [pendingSessionAction, setPendingSessionAction] = useState<{
    sessionId: number;
    type: "star" | "delete";
  } | null>(null);
  const [sessionPendingDelete, setSessionPendingDelete] = useState<ApiSession | null>(null);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [typingDisplayLength, setTypingDisplayLength] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const [filter, setFilter] = useState<"all" | "starred">("all");

  const selectedSession = sessions.find((s) => s.session_id === selectedSessionId) ?? null;
  const starredSessions = sessions.filter((s) => s.is_starred);
  const unstarredSessions = sessions.filter((s) => !s.is_starred);

  const loadSessions = useCallback(async () => {
    setIsLoadingSessions(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/clients/${DEMO_CLIENT_ID}/sessions`);
      if (!response.ok) throw new Error("Unable to load conversations.");
      const data = (await response.json()) as ApiSession[];
      setSessions(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load conversations.");
    } finally {
      setIsLoadingSessions(false);
    }
  }, []);

  const loadMessages = useCallback(async (sessionId: number): Promise<Message[]> => {
    setIsLoadingMessages(true);
    setError("");
    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}/messages`);
      if (!response.ok) throw new Error("Unable to load chat history.");
      const data = (await response.json()) as ApiMessage[];
      const mapped = data.map(mapApiMessage);
      setMessages(mapped);
      return mapped;
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to load chat history.");
      return [];
    } finally {
      setIsLoadingMessages(false);
    }
  }, []);

  const createSession = async () => {
    const response = await fetch(`${API_BASE_URL}/api/clients/${DEMO_CLIENT_ID}/sessions`, {
      method: "POST",
      headers: { "Content-Type": "application/json" },
    });
    if (!response.ok) throw new Error("Unable to create conversation.");
    return (await response.json()) as ApiSession;
  };

  const updateSessionStar = async (sessionId: number, isStarred: boolean) => {
    const response = await fetch(`${API_BASE_URL}/api/clients/${DEMO_CLIENT_ID}/sessions/${sessionId}`, {
      method: "PATCH",
      headers: { "Content-Type": "application/json" },
      body: JSON.stringify({ isStarred }),
    });
    if (!response.ok) throw new Error("Unable to update conversation.");
    return (await response.json()) as ApiSession;
  };

  const deleteSession = async (sessionId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/clients/${DEMO_CLIENT_ID}/sessions/${sessionId}`, {
      method: "DELETE",
    });
    if (!response.ok) throw new Error("Unable to delete conversation.");
  };

  const resetConversationView = () => {
    setSelectedSessionId(null);
    setMessages([]);
    setInput("");
    setError("");
  };

  const isSessionActionPending = (sessionId: number, type?: "star" | "delete") => {
    if (!pendingSessionAction || pendingSessionAction.sessionId !== sessionId) return false;
    if (!type) return true;
    return pendingSessionAction.type === type;
  };

  useEffect(() => { loadSessions(); }, [loadSessions]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
  }, [messages, typingDisplayLength]);

  useEffect(() => {
    if (!typingMessageId) return;
    const fullMessage = messages.find((m) => m.id === typingMessageId);
    if (!fullMessage) { setTypingMessageId(null); return; }
    if (typingDisplayLength >= fullMessage.content.length) { setTypingMessageId(null); return; }
    const timer = setTimeout(() => {
      setTypingDisplayLength((prev) => Math.min(prev + 8, fullMessage.content.length));
    }, 15);
    return () => clearTimeout(timer);
  }, [typingMessageId, typingDisplayLength, messages]);

  useEffect(() => {
    const bootstrapInitialMessage = async () => {
      if (!initialMessage || hasHandledInitialMessage.current) return;
      hasHandledInitialMessage.current = true;
      setIsBootstrappingThread(true);
      setError("");
      try {
        const newSession = await createSession();
        setSelectedSessionId(newSession.session_id);
        const response = await fetch(`${API_BASE_URL}/api/sessions/${newSession.session_id}/messages`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({ messageText: initialMessage.trim(), senderType: "user" }),
        });
        if (!response.ok) throw new Error("Unable to save first message.");
        await loadSessions();
        const loaded = await loadMessages(newSession.session_id);
        const lastAssistant = [...loaded].reverse().find((m) => m.role === "assistant");
        if (lastAssistant) { setTypingDisplayLength(0); setTypingMessageId(lastAssistant.id); }
      } catch (err) {
        setError(err instanceof Error ? err.message : "Unable to start conversation.");
      } finally {
        navigate(`${location.pathname}${location.search}`, { replace: true, state: null });
        setIsBootstrappingThread(false);
      }
    };
    bootstrapInitialMessage();
  }, [initialMessage, loadMessages, loadSessions, location.pathname, location.search, navigate]);

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
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messageText: text.trim(), senderType: "user" }),
      });
      if (!response.ok) throw new Error("Unable to save message.");
      const data = (await response.json()) as SendMessageResponse;
      const newMessages: Message[] = [mapApiMessage(data.userMessage)];
      if (data.assistantMessage) {
        const mapped = mapApiMessage(data.assistantMessage);
        newMessages.push(mapped);
        setTypingDisplayLength(0);
        setTypingMessageId(mapped.id);
      }
      setMessages((prev) => [...prev, ...newMessages]);
      setInput("");
      await loadSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to save message.");
    } finally {
      setIsSending(false);
    }
  };

  const handleKeyDown = (e: React.KeyboardEvent) => {
    if (e.key === "Enter" && !e.shiftKey) { e.preventDefault(); sendMessage(input); }
  };

  const handleSessionSelect = async (sessionId: number) => {
    setSelectedSessionId(sessionId);
    setMessages([]);
    await loadMessages(sessionId);
  };

  const handleToggleStar = async (session: ApiSession) => {
    setPendingSessionAction({ sessionId: session.session_id, type: "star" });
    setError("");
    try {
      await updateSessionStar(session.session_id, !session.is_starred);
      await loadSessions();
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to update conversation.");
    } finally {
      setPendingSessionAction(null);
    }
  };

  const handleDeleteConversation = async () => {
    if (!sessionPendingDelete) return;
    setPendingSessionAction({ sessionId: sessionPendingDelete.session_id, type: "delete" });
    setError("");
    try {
      await deleteSession(sessionPendingDelete.session_id);
      if (selectedSessionId === sessionPendingDelete.session_id) resetConversationView();
      await loadSessions();
      setSessionPendingDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete conversation.");
    } finally {
      setPendingSessionAction(null);
    }
  };

  const sessionIcon = (session: ApiSession) => {
    if (session.is_starred) return "star";
    return "chat_bubble";
  };

  // ─── Session List View ─────────────────────────────────────────────
  if (selectedSessionId === null && !isBootstrappingThread) {
    const visibleSessions = filter === "starred"
      ? starredSessions
      : [...starredSessions, ...unstarredSessions];

    return (
      <div className="space-y-8">
        {/* Header */}
        <div className="mb-4">
          <h2 className="text-3xl sm:text-4xl md:text-5xl font-extrabold font-headline tracking-tight text-on-surface mb-4">
            Conversation History
          </h2>
          <p className="text-on-surface-variant text-lg max-w-2xl font-body">
            Access your past interactions, reviewed resources, and previous guidance from the NavigAid AI portal.
          </p>
        </div>

        {/* Actions */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4">
          <div className="flex gap-2 bg-[var(--surface-container-low)] p-1.5 rounded-2xl w-fit">
            <button
              onClick={() => setFilter("all")}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                filter === "all"
                  ? "bg-[var(--surface-container-lowest)] shadow-sm text-primary"
                  : "text-on-surface-variant font-medium hover:bg-[var(--surface-container-high)]"
              }`}
            >
              All
            </button>
            <button
              onClick={() => setFilter("starred")}
              className={`px-6 py-2 rounded-xl font-bold transition-all ${
                filter === "starred"
                  ? "bg-[var(--surface-container-lowest)] shadow-sm text-primary"
                  : "text-on-surface-variant font-medium hover:bg-[var(--surface-container-high)]"
              }`}
            >
              Starred
            </button>
          </div>
          <button
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
            className="flex items-center gap-2 px-6 py-2.5 rounded-full bg-primary text-[var(--on-primary)] font-bold hover:bg-primary-dim transition-all active:scale-95"
          >
            <span className="material-symbols-outlined text-lg">add_comment</span>
            New Chat
          </button>
        </div>

        {error && <p className="text-sm text-error font-medium">{error}</p>}

        {isLoadingSessions && (
          <div className="flex items-center gap-3 py-12 justify-center">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-on-surface-variant">Loading conversations...</p>
          </div>
        )}

        {!isLoadingSessions && visibleSessions.length === 0 && (
          <div className="text-center py-16 text-on-surface-variant">
            <span className="material-symbols-outlined text-5xl mb-4 block opacity-30">forum</span>
            <p className="text-lg font-medium">
              {filter === "starred" ? "No starred conversations" : "No conversations yet"}
            </p>
            <p className="text-sm mt-1">
              {filter === "starred" ? "Star a conversation to see it here." : "Start a new session to begin."}
            </p>
          </div>
        )}

        {/* Session Cards */}
        <div className="space-y-4">
          {visibleSessions.map((session) => {
            const isDeleting = isSessionActionPending(session.session_id, "delete");
            const isStarring = isSessionActionPending(session.session_id, "star");

            return (
              <div
                key={session.session_id}
                className="group bg-[var(--surface-container-lowest)] rounded-2xl p-4 sm:p-6 transition-all hover:shadow-editorial-hover border border-transparent hover:border-primary/10"
              >
                <button
                  type="button"
                  onClick={() => handleSessionSelect(session.session_id)}
                  className="flex items-start sm:items-center gap-3 sm:gap-6 w-full text-left focus:outline-none"
                >
                  <div className={`w-10 h-10 sm:w-14 sm:h-14 rounded-xl flex items-center justify-center shrink-0 ${
                    session.is_starred
                      ? "bg-amber-100 text-amber-600"
                      : "bg-secondary-container text-primary"
                  }`}>
                    <span
                      className="material-symbols-outlined text-xl sm:text-3xl"
                      style={{ fontVariationSettings: "'FILL' 1" }}
                    >
                      {sessionIcon(session)}
                    </span>
                  </div>
                  <div className="min-w-0 flex-1">
                    <div className="flex flex-wrap items-center gap-2 sm:gap-3 mb-1">
                      <h3 className="text-base sm:text-xl font-bold font-headline text-on-surface">
                        Conversation #{session.session_id}
                      </h3>
                      {session.is_starred && (
                        <span className="px-2 py-0.5 rounded-full bg-amber-100 text-amber-700 text-[10px] sm:text-xs font-bold uppercase tracking-wider">
                          Starred
                        </span>
                      )}
                    </div>
                    <div className="flex flex-wrap items-center gap-2 sm:gap-4 text-xs sm:text-sm text-on-surface-variant">
                      <span className="flex items-center gap-1.5">
                        <span className="material-symbols-outlined text-base">smart_toy</span>
                        NavigAid AI
                      </span>
                      <span className="hidden sm:inline w-1 h-1 rounded-full bg-[var(--outline-variant)]" />
                      <span className="line-clamp-1 hidden sm:inline">
                        {session.last_message_text ?? "No messages yet"}
                      </span>
                    </div>
                    <p className="text-xs text-on-surface-variant mt-1">{session.message_count} messages</p>
                  </div>
                </button>

                <div className="flex items-center gap-2 sm:gap-3 mt-3 sm:mt-0 pl-13 sm:pl-0 justify-end">
                  <button
                    type="button"
                    className={`w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center transition-colors ${
                      session.is_starred ? "text-amber-500 hover:bg-amber-50" : "text-slate-400 hover:bg-slate-100"
                    }`}
                    disabled={isDeleting || isStarring}
                    onClick={(e) => { e.stopPropagation(); void handleToggleStar(session); }}
                    aria-label={session.is_starred ? "Unstar" : "Star"}
                  >
                    <Star className={`h-4 w-4 sm:h-5 sm:w-5 ${session.is_starred ? "fill-current" : ""}`} />
                  </button>
                  <button
                    type="button"
                    className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
                    disabled={isDeleting || isStarring}
                    onClick={(e) => { e.stopPropagation(); setSessionPendingDelete(session); }}
                    aria-label="Delete"
                  >
                    <Trash2 className="h-4 w-4 sm:h-5 sm:w-5" />
                  </button>
                  <button
                    type="button"
                    onClick={() => handleSessionSelect(session.session_id)}
                    className="w-10 h-10 sm:w-12 sm:h-12 rounded-full flex items-center justify-center bg-[var(--surface-container)] hover:bg-primary hover:text-[var(--on-primary)] transition-all active:scale-90"
                  >
                    <span className="material-symbols-outlined text-xl sm:text-2xl">arrow_forward</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

        <AlertDialog
          open={sessionPendingDelete !== null}
          onOpenChange={(isOpen) => { if (!isOpen && !pendingSessionAction) setSessionPendingDelete(null); }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
              <AlertDialogDescription>
                Conversation #{sessionPendingDelete?.session_id} will be removed permanently along with its saved messages.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={pendingSessionAction?.type === "delete"}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-error text-[var(--on-error)] hover:bg-error/90"
                disabled={pendingSessionAction?.type === "delete"}
                onClick={(e) => { e.preventDefault(); void handleDeleteConversation(); }}
              >
                Delete Conversation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  // ─── Chat View ─────────────────────────────────────────────────────
  return (
    <div className="flex flex-col h-[calc(100vh-12rem)]">
      {/* Chat Header */}
      <div className="pb-4 mb-4 border-b border-[var(--outline-variant)]/20 flex items-center gap-2 sm:gap-4">
        <button
          onClick={() => resetConversationView()}
          className="w-9 h-9 sm:w-10 sm:h-10 rounded-full flex items-center justify-center hover:bg-[var(--surface-container)] transition-colors shrink-0"
        >
          <ArrowLeft className="w-5 h-5" />
        </button>
        <div className="min-w-0 flex-1">
          <h3 className="text-base sm:text-xl font-bold font-headline text-on-surface truncate">
            Conversation #{selectedSessionId}
          </h3>
          <p className="text-xs sm:text-sm text-on-surface-variant">Saved chat thread</p>
        </div>
        {selectedSession && (
          <div className="flex items-center gap-2">
            <button
              type="button"
              className={`w-10 h-10 rounded-full flex items-center justify-center transition-colors ${
                selectedSession.is_starred ? "text-amber-500 hover:bg-amber-50" : "text-slate-400 hover:bg-slate-100"
              }`}
              disabled={isSessionActionPending(selectedSession.session_id)}
              onClick={() => void handleToggleStar(selectedSession)}
            >
              <Star className={`h-5 w-5 ${selectedSession.is_starred ? "fill-current" : ""}`} />
            </button>
            <button
              type="button"
              className="w-10 h-10 rounded-full flex items-center justify-center text-slate-400 hover:bg-red-50 hover:text-red-500 transition-colors"
              disabled={isSessionActionPending(selectedSession.session_id)}
              onClick={() => setSessionPendingDelete(selectedSession)}
            >
              <Trash2 className="h-5 w-5" />
            </button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto space-y-4 pr-2">
        {error && <p className="text-sm text-error font-medium">{error}</p>}

        {(isLoadingMessages || isBootstrappingThread) && (
          <div className="flex flex-col items-center justify-center py-16 gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-on-surface-variant">
              {isBootstrappingThread ? "Starting conversation..." : "Loading conversation..."}
            </p>
          </div>
        )}

        {!isLoadingMessages && !isBootstrappingThread && messages.length === 0 && (
          <div className="text-center text-on-surface-variant py-16">
            <span className="material-symbols-outlined text-5xl mb-4 block opacity-30">chat</span>
            <p>Start a conversation by sending your first message.</p>
          </div>
        )}

        {messages.map((msg) => {
          const isTyping = msg.id === typingMessageId;
          const displayContent = isTyping ? msg.content.substring(0, typingDisplayLength) : msg.content;

          return (
            <div
              key={msg.id}
              className={`flex gap-3 max-w-[80%] ${msg.role === "user" ? "ml-auto flex-row-reverse" : ""}`}
            >
              {msg.role === "assistant" && (
                <div className="w-9 h-9 rounded-full bg-secondary-container flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-primary text-lg">smart_toy</span>
                </div>
              )}
              {msg.role === "user" && (
                <div className="w-9 h-9 rounded-full bg-primary/10 flex items-center justify-center shrink-0 mt-1">
                  <span className="material-symbols-outlined text-primary text-lg">person</span>
                </div>
              )}
              <div
                className={`rounded-2xl px-4 py-3 text-sm leading-relaxed whitespace-pre-wrap ${
                  msg.role === "user"
                    ? "bg-primary text-[var(--on-primary)] rounded-br-md"
                    : "bg-[var(--surface-container-lowest)] border border-[var(--outline-variant)]/20 rounded-bl-md shadow-sm"
                }`}
                dangerouslySetInnerHTML={{
                  __html: displayContent
                    .replace(/\*\*(.*?)\*\*/g, "<strong>$1</strong>")
                    .replace(/\n/g, "<br/>"),
                }}
              />
            </div>
          );
        })}
        <div ref={bottomRef} />
      </div>

      {/* Input */}
      <div className="pt-4 mt-4 border-t border-[var(--outline-variant)]/20">
        <div className="flex gap-3 items-end editorial-shadow p-2 bg-[var(--surface-container-lowest)] rounded-full">
          <textarea
            value={input}
            onChange={(e) => setInput(e.target.value)}
            onKeyDown={handleKeyDown}
            placeholder="Type a follow-up question..."
            className="flex-1 resize-none border-0 bg-transparent text-sm text-on-surface placeholder:text-[var(--outline-variant)] focus:outline-none focus:ring-0 min-h-[36px] max-h-[100px] py-2.5 px-4 font-body"
            rows={1}
          />
          <button
            onClick={() => sendMessage(input)}
            disabled={!input.trim() || isSending || isLoadingMessages || isBootstrappingThread}
            className="h-10 w-10 rounded-full bg-primary text-[var(--on-primary)] flex items-center justify-center shrink-0 hover:bg-primary-dim transition-all active:scale-95 disabled:opacity-50 disabled:cursor-not-allowed shadow-lg shadow-primary/20"
            aria-label="Send"
          >
            <Send className="w-4 h-4" />
          </button>
        </div>
      </div>

      <AlertDialog
        open={sessionPendingDelete !== null}
        onOpenChange={(isOpen) => { if (!isOpen && !pendingSessionAction) setSessionPendingDelete(null); }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              Conversation #{sessionPendingDelete?.session_id} will be removed permanently along with its saved messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pendingSessionAction?.type === "delete"}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-error text-[var(--on-error)] hover:bg-error/90"
              disabled={pendingSessionAction?.type === "delete"}
              onClick={(e) => { e.preventDefault(); void handleDeleteConversation(); }}
            >
              Delete Conversation
            </AlertDialogAction>
          </AlertDialogFooter>
        </AlertDialogContent>
      </AlertDialog>
    </div>
  );
};

export default ResultsPage;
