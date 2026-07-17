"use client";

import { useChatWs } from "@/hooks/useChatWs";

export function WsConnector() {
  useChatWs();
  return null;
}
