export interface GuestMessage {
  id: string;
  role: "user" | "assistant";
  content: string;
}

export interface GuestConversation {
  id: string;
  messages: GuestMessage[];
  createdAt: number;
}

const GUEST_CHATS_KEY = "navigaid_guest_chats";

export function getGuestConversations(): GuestConversation[] {
  try {
    const raw = localStorage.getItem(GUEST_CHATS_KEY);
    if (!raw) return [];
    return JSON.parse(raw) as GuestConversation[];
  } catch {
    return [];
  }
}

function saveAll(convs: GuestConversation[]): void {
  localStorage.setItem(GUEST_CHATS_KEY, JSON.stringify(convs));
}

export function createGuestConversation(): GuestConversation {
  const conv: GuestConversation = {
    id: `guest-${Date.now()}-${Math.random().toString(36).slice(2, 7)}`,
    messages: [],
    createdAt: Date.now(),
  };
  const existing = getGuestConversations();
  saveAll([conv, ...existing]);
  return conv;
}

export function appendGuestMessages(id: string, newMessages: GuestMessage[]): void {
  const convs = getGuestConversations();
  const idx = convs.findIndex((c) => c.id === id);
  if (idx === -1) return;
  convs[idx] = { ...convs[idx], messages: [...convs[idx].messages, ...newMessages] };
  saveAll(convs);
}

export function deleteGuestConversation(id: string): void {
  saveAll(getGuestConversations().filter((c) => c.id !== id));
}

export function clearGuestConversations(): void {
  localStorage.removeItem(GUEST_CHATS_KEY);
}
