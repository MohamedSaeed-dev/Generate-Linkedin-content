import { ChatMessageHistory } from "@langchain/community/stores/message/in_memory";
import { BaseChatMessageHistory } from "@langchain/core/chat_history";
const store = {};

export function getMessageHistory(sessionId: string): BaseChatMessageHistory {
  if (!(sessionId in store)) {
    store[sessionId] = new ChatMessageHistory();
  }
  return store[sessionId];
}
