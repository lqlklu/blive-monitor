function encodeConnect(roomid: number): string {
  return JSON.stringify({
    type: "CONNECT",
    payload: {
      roomid,
    },
  });
}

function encodeHeartbeat(): string {
  return JSON.stringify({
    type: "HEARTBEAT",
    payload: {},
  });
}

function encodeClose(): string {
  return JSON.stringify(<Message>{
    type: "CLOSE",
    payload: {},
  });
}

export interface Message {
  type: string;
  payload: any;
}

export class BliveSocket {
  private ws: WebSocket;

  private onOpenList = new Set<(ev: Event) => any>();
  private onMessageList = new Set<(ev: Message) => any>();

  private mw = new Set<(v: string) => string>();

  constructor(ws: WebSocket) {
    this.ws = ws;
    this.ws.onopen = (ev) => {
      this.onOpenList.forEach((f) => {
        f(ev);
      });
    };
    this.ws.onmessage = (ev) => {
      const m = JSON.parse(ev.data);
      this.onMessageList.forEach((f) => {
        f(m);
      });
    };
  }

  send(msg: string) {
    this.ws.send(this.invoke(msg));
  }

  sendConnect(roomid: number) {
    this.send(encodeConnect(roomid));
  }

  sendHeartbeat() {
    this.send(encodeHeartbeat());
  }

  sendClose() {
    this.send(encodeClose());
  }

  invoke(v: string) {
    this.mw.forEach((f) => {
      v = f(v);
    });
    return v;
  }

  use(fn: (v: string) => string) {
    this.mw.add(fn);
  }

  addOnOpen(fn: (ev: Event) => any) {
    this.onOpenList.add(fn);
  }

  addOnMessage(fn: (ev: Message) => any) {
    this.onMessageList.add(fn);
  }
}

export function dial(url: string): BliveSocket {
  return new BliveSocket(new WebSocket(url));
}
