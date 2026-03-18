import { useCallback, useEffect, useRef, useState } from "react";
import { useLocation, useNavigate } from "react-router-dom";
import { ArrowLeft, Bot, ChevronDown, ChevronUp, MessageSquarePlus, Send, Star, Trash2, User } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Avatar, AvatarFallback } from "@/components/ui/avatar";
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
  const [showStarredSessions, setShowStarredSessions] = useState(true);
  const [pendingSessionAction, setPendingSessionAction] = useState<{
    sessionId: number;
    type: "star" | "delete";
  } | null>(null);
  const [sessionPendingDelete, setSessionPendingDelete] = useState<ApiSession | null>(null);
  const [typingMessageId, setTypingMessageId] = useState<string | null>(null);
  const [typingDisplayLength, setTypingDisplayLength] = useState(0);
  const bottomRef = useRef<HTMLDivElement>(null);
  const scrollContainerRef = useRef<HTMLDivElement>(null);

  const selectedSession = sessions.find((session) => session.session_id === selectedSessionId) ?? null;
  const starredSessions = sessions.filter((session) => session.is_starred);
  const unstarredSessions = sessions.filter((session) => !session.is_starred);

  const loadSessions = useCallback(async () => {
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
  }, []);

  const loadMessages = useCallback(async (sessionId: number): Promise<Message[]> => {
    setIsLoadingMessages(true);
    setError("");

    try {
      const response = await fetch(`${API_BASE_URL}/api/sessions/${sessionId}/messages`);

      if (!response.ok) {
        throw new Error("Unable to load chat history.");
      }

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

  const updateSessionStar = async (sessionId: number, isStarred: boolean) => {
    const response = await fetch(`${API_BASE_URL}/api/clients/${DEMO_CLIENT_ID}/sessions/${sessionId}`, {
      method: "PATCH",
      headers: {
        "Content-Type": "application/json",
      },
      body: JSON.stringify({ isStarred }),
    });

    if (!response.ok) {
      throw new Error("Unable to update conversation.");
    }

    return (await response.json()) as ApiSession;
  };

  const deleteSession = async (sessionId: number) => {
    const response = await fetch(`${API_BASE_URL}/api/clients/${DEMO_CLIENT_ID}/sessions/${sessionId}`, {
      method: "DELETE",
    });

    if (!response.ok) {
      throw new Error("Unable to delete conversation.");
    }
  };

  const resetConversationView = () => {
    setSelectedSessionId(null);
    setMessages([]);
    setInput("");
    setError("");
  };

  const isSessionActionPending = (sessionId: number, type?: "star" | "delete") => {
    if (!pendingSessionAction || pendingSessionAction.sessionId !== sessionId) {
      return false;
    }

    if (!type) {
      return true;
    }

    return pendingSessionAction.type === type;
  };

  useEffect(() => {
    loadSessions();
  }, [loadSessions]);

  useEffect(() => {
    const container = scrollContainerRef.current;
    if (container) {
      container.scrollTo({ top: container.scrollHeight, behavior: "smooth" });
    }
  }, [messages, typingDisplayLength]);

  useEffect(() => {
    if (!typingMessageId) return;

    const fullMessage = messages.find((m) => m.id === typingMessageId);
    if (!fullMessage) {
      setTypingMessageId(null);
      return;
    }

    if (typingDisplayLength >= fullMessage.content.length) {
      setTypingMessageId(null);
      return;
    }

    const speed = 8;
    const timer = setTimeout(() => {
      setTypingDisplayLength((prev) => Math.min(prev + speed, fullMessage.content.length));
    }, 15);

    return () => clearTimeout(timer);
  }, [typingMessageId, typingDisplayLength, messages]);

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
        const loaded = await loadMessages(newSession.session_id);
        const lastAssistant = [...loaded].reverse().find((m) => m.role === "assistant");
        if (lastAssistant) {
          setTypingDisplayLength(0);
          setTypingMessageId(lastAssistant.id);
        }
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
    resetConversationView();
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
    if (!sessionPendingDelete) {
      return;
    }

    setPendingSessionAction({ sessionId: sessionPendingDelete.session_id, type: "delete" });
    setError("");

    try {
      await deleteSession(sessionPendingDelete.session_id);

      if (selectedSessionId === sessionPendingDelete.session_id) {
        resetConversationView();
      }

      await loadSessions();
      setSessionPendingDelete(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Unable to delete conversation.");
    } finally {
      setPendingSessionAction(null);
    }
  };

  const renderSessionCard = (session: ApiSession) => {
    const isDeleting = isSessionActionPending(session.session_id, "delete");
    const isStarring = isSessionActionPending(session.session_id, "star");

    return (
      <div
        key={session.session_id}
        className="flex items-start gap-2 rounded-lg border border-border bg-card p-2 transition-colors hover:border-primary/30"
      >
        <button
          type="button"
          onClick={() => handleSessionSelect(session.session_id)}
          className="min-w-0 flex-1 rounded-md px-1 py-1 text-left focus-visible:outline-none focus-visible:ring-2 focus-visible:ring-ring focus-visible:ring-offset-2"
        >
          <div className="flex items-center gap-2">
            <p className="text-sm font-medium text-foreground">Conversation #{session.session_id}</p>
            {session.is_starred && <Star className="h-3.5 w-3.5 fill-amber-400 text-amber-400" />}
          </div>
          <p className="mt-1 line-clamp-2 text-xs text-muted-foreground">
            {session.last_message_text ?? "No messages yet"}
          </p>
          <p className="mt-1 text-[11px] text-muted-foreground">{session.message_count} messages</p>
        </button>

        <div className="flex shrink-0 items-center gap-1">
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className={cn(
              "h-8 w-8 rounded-full",
              session.is_starred && "text-amber-500 hover:text-amber-500"
            )}
            aria-label={session.is_starred ? `Unstar conversation ${session.session_id}` : `Star conversation ${session.session_id}`}
            title={session.is_starred ? "Unstar conversation" : "Star conversation"}
            disabled={isDeleting || isStarring}
            onClick={(event) => {
              event.stopPropagation();
              void handleToggleStar(session);
            }}
          >
            <Star className={cn("h-4 w-4", session.is_starred && "fill-current")} />
          </Button>
          <Button
            type="button"
            size="icon"
            variant="ghost"
            className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
            aria-label={`Delete conversation ${session.session_id}`}
            title="Delete conversation"
            disabled={isDeleting || isStarring}
            onClick={(event) => {
              event.stopPropagation();
              setSessionPendingDelete(session);
            }}
          >
            <Trash2 className="h-4 w-4" />
          </Button>
        </div>
      </div>
    );
  };

  if (selectedSessionId === null && !isBootstrappingThread) {
    return (
      <div className="flex flex-col h-[70vh] max-h-[70vh] px-4 py-4 gap-4">
        <div className="flex items-start justify-between gap-3">
          <div>
            <h1 className="font-display text-lg font-semibold text-foreground">Your Conversations</h1>
            <p className="text-sm text-muted-foreground">Star key chats to keep them pinned at the top.</p>
          </div>
          <div className="flex items-center gap-2">
            {starredSessions.length > 0 && (
              <Button
                type="button"
                size="sm"
                variant="outline"
                className="gap-1"
                onClick={() => setShowStarredSessions((current) => !current)}
              >
                {showStarredSessions ? <ChevronUp className="h-4 w-4" /> : <ChevronDown className="h-4 w-4" />}
                {showStarredSessions ? "Hide Starred" : "Show Starred"}
              </Button>
            )}
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
        </div>

        {error && <p className="text-sm text-destructive">{error}</p>}

        {isLoadingSessions && <p className="text-sm text-muted-foreground">Loading conversations...</p>}

        {!isLoadingSessions && sessions.length === 0 && (
          <p className="text-sm text-muted-foreground">No conversations yet. Start one to begin.</p>
        )}

        <div className="flex-1 overflow-y-auto flex flex-col gap-2 pr-1">
          {starredSessions.length > 0 && (
            <div className="space-y-2">
              <div className="flex items-center justify-between px-1">
                <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                  Starred Conversations
                </p>
                <p className="text-xs text-muted-foreground">{starredSessions.length}</p>
              </div>
              {showStarredSessions ? (
                starredSessions.map(renderSessionCard)
              ) : (
                <div className="rounded-lg border border-dashed border-border px-3 py-4 text-sm text-muted-foreground">
                  Starred conversations are hidden.
                </div>
              )}
            </div>
          )}

          {unstarredSessions.length > 0 && (
            <div className="space-y-2">
              {starredSessions.length > 0 && (
                <div className="flex items-center justify-between px-1 pt-2">
                  <p className="text-xs font-semibold uppercase tracking-[0.18em] text-muted-foreground">
                    All Conversations
                  </p>
                  <p className="text-xs text-muted-foreground">{unstarredSessions.length}</p>
                </div>
              )}
              {unstarredSessions.map(renderSessionCard)}
            </div>
          )}
        </div>

        <AlertDialog
          open={sessionPendingDelete !== null}
          onOpenChange={(isOpen) => {
            if (!isOpen && !pendingSessionAction) {
              setSessionPendingDelete(null);
            }
          }}
        >
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
              <AlertDialogDescription>
                Conversation #{sessionPendingDelete?.session_id} will be removed permanently along with its saved
                messages.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel disabled={pendingSessionAction?.type === "delete"}>Cancel</AlertDialogCancel>
              <AlertDialogAction
                className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
                disabled={pendingSessionAction?.type === "delete"}
                onClick={(event) => {
                  event.preventDefault();
                  void handleDeleteConversation();
                }}
              >
                Delete Conversation
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>
      </div>
    );
  }

  return (
    <div className="flex flex-col h-[70vh] max-h-[70vh]">
      <div className="px-4 pt-4 pb-2 border-b border-border flex items-center gap-2">
        <Button size="icon" variant="ghost" className="h-8 w-8" onClick={handleBackToSessions}>
          <ArrowLeft className="w-4 h-4" />
        </Button>
        <div className="min-w-0 flex-1">
          <p className="text-sm font-medium text-foreground">Conversation #{selectedSessionId}</p>
          <p className="text-xs text-muted-foreground">Saved chat thread</p>
        </div>
        {selectedSession && (
          <div className="flex items-center gap-1">
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className={cn("h-8 w-8 rounded-full", selectedSession.is_starred && "text-amber-500 hover:text-amber-500")}
              aria-label={selectedSession.is_starred ? "Unstar selected conversation" : "Star selected conversation"}
              disabled={isSessionActionPending(selectedSession.session_id)}
              onClick={() => void handleToggleStar(selectedSession)}
            >
              <Star className={cn("h-4 w-4", selectedSession.is_starred && "fill-current")} />
            </Button>
            <Button
              type="button"
              size="icon"
              variant="ghost"
              className="h-8 w-8 rounded-full text-destructive hover:text-destructive"
              aria-label="Delete selected conversation"
              disabled={isSessionActionPending(selectedSession.session_id)}
              onClick={() => setSessionPendingDelete(selectedSession)}
            >
              <Trash2 className="h-4 w-4" />
            </Button>
          </div>
        )}
      </div>

      {/* Messages */}
      <div ref={scrollContainerRef} className="flex-1 overflow-y-auto px-4 py-4 space-y-4">
        {error && <p className="text-sm text-destructive">{error}</p>}
        {(isLoadingMessages || isBootstrappingThread) && (
          <div className="flex flex-col items-center justify-center py-12 gap-3">
            <div className="h-6 w-6 animate-spin rounded-full border-2 border-primary border-t-transparent" />
            <p className="text-sm text-muted-foreground">
              {isBootstrappingThread ? "Starting conversation..." : "Loading conversation..."}
            </p>
          </div>
        )}
        {!isLoadingMessages && !isBootstrappingThread && messages.length === 0 && (
          <div className="text-center text-muted-foreground text-sm py-12">
            Start a conversation by sending your first message.
          </div>
        )}
        {messages.map((msg) => {
          const isTyping = msg.id === typingMessageId;
          const displayContent = isTyping ? msg.content.substring(0, typingDisplayLength) : msg.content;

          return (
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

      <AlertDialog
        open={sessionPendingDelete !== null}
        onOpenChange={(isOpen) => {
          if (!isOpen && !pendingSessionAction) {
            setSessionPendingDelete(null);
          }
        }}
      >
        <AlertDialogContent>
          <AlertDialogHeader>
            <AlertDialogTitle>Delete conversation?</AlertDialogTitle>
            <AlertDialogDescription>
              Conversation #{sessionPendingDelete?.session_id} will be removed permanently along with its saved
              messages.
            </AlertDialogDescription>
          </AlertDialogHeader>
          <AlertDialogFooter>
            <AlertDialogCancel disabled={pendingSessionAction?.type === "delete"}>Cancel</AlertDialogCancel>
            <AlertDialogAction
              className="bg-destructive text-destructive-foreground hover:bg-destructive/90"
              disabled={pendingSessionAction?.type === "delete"}
              onClick={(event) => {
                event.preventDefault();
                void handleDeleteConversation();
              }}
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
