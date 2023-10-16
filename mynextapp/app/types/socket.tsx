import { Socket } from "socket.io-client";
import type { DefaultEventsMap } from "@socket.io/component-emitter";

export type SocketType = Socket<DefaultEventsMap, DefaultEventsMap> | null;
