import { atom } from "nanostores";

export const ws = atom<WebSocket | null>(null)
