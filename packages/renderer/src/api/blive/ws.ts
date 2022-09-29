import pako from "pako";

export interface Danmu {
  id: number;
  user: User;
  medal?: Medal;
  message: string;
}

export interface SuperChat {
  id: number;
  user: User;
  medal?: Medal;
  message: string;
  price: number;
}

export interface SuperChatJpn {
  id: number;
  user: User;
  medal?: Medal;
  message: string;
  messageJpn: string;
  price: number;
}

export interface Gift {
  giftName: string;
  user: User;
  medal?: Medal;
  price: number;
  gold: number;
  silver: number;
  num: number;
}

export interface User {
  id: number;
  name: string;
  color?: string;
}

export interface Medal {
  name: string;
  level: number;
  color?: string;
}

export const INVALID = 0;
export const HEARTBEAT = 2;
export const HEARTBEAT_REPLY = 3;
export const MESSAGE = 5;
export const USER_AUTH = 7;
export const CONNECT_SUCC = 8;

export interface BlivePacket {
  packetLen: number;
  headerLen: number;
  ver: number;
  op: number;
  seq: number;
  body: Uint8Array;
}

export function encode(s: string, op: number): ArrayBuffer {
  let data = textEncoder.encode(s);
  let packetLen = 16 + data.byteLength;
  let header = new Array<number>(16);
  writeInt(header, 0, 4, packetLen);
  writeInt(header, 4, 2, 16);
  writeInt(header, 6, 2, 0);
  writeInt(header, 8, 4, op);
  writeInt(header, 12, 4, 1);
  return new Uint8Array(header.concat(...data)).buffer;
}

export function decode(blob: Blob): Promise<BlivePacket[]> {
  return new Promise<BlivePacket[]>((resolve, reject) => {
    const reader = new FileReader();
    reader.onload = (e) => {
      if (e.target?.result instanceof ArrayBuffer) {
        let buffer = new Uint8Array(e.target.result);
        const packetLen = readInt(buffer, 0, 4);
        if (packetLen != buffer.byteLength) {
          console.error("error packet length");
        }
        const headerLen = readInt(buffer, 4, 2);
        const ver = readInt(buffer, 6, 2);
        const op = readInt(buffer, 8, 4);
        const seq = readInt(buffer, 12, 4);
        const body = buffer.slice(16);
        let result: BlivePacket = {
          packetLen,
          headerLen,
          ver,
          op,
          seq,
          body,
        };
        resolve(unzip(result));
      } else {
        reject();
      }
    };
    reader.readAsArrayBuffer(blob);
  });
}

/// when ver==0
export function resolveJson(body: Uint8Array): any {
  return JSON.parse(textDecoder.decode(body));
}

/// when ver===1
export function resolveInt(body: Uint8Array): number {
  return readInt(body, 0, 4);
}

export function resolveDanmu(message: any): Danmu {
  const info = message.info;
  const id = info[0][4] as number;
  const content = info[1] as string;
  const medalJ = info[3] as Array<any>;
  let medal: Medal | undefined = undefined;
  if (medalJ.length != 0) {
    const medalLevel = medalJ[0] as number;
    const medalName = medalJ[1] as string;
    medal = {
      level: medalLevel,
      name: medalName,
    };
  }
  const userJ = info[2];
  const userName = userJ[1] as string;
  const userId = userJ[0] as number;
  const userColor = userJ[7] as string;
  const user: User = {
    name: userName,
    id: userId,
    color: userColor,
  };
  return {
    id,
    message: content,
    medal,
    user,
  };
}

export function resolveSuperChat(message: any): SuperChat {
  const dataJ = message["data"];
  const id = dataJ["id"] as number;
  const content = dataJ["message"];
  let medal: Medal | undefined = undefined;
  if (dataJ["medal_info"]) {
    const medalJ = dataJ["medal_info"];
    const medalLevel = medalJ["medal_level"] as number;
    const medalName = medalJ["medal_name"] as string;
    const medalColor = medalJ["medal_color"] as string;
    medal = {
      level: medalLevel,
      name: medalName,
      color: medalColor,
    };
  }
  const userJ = dataJ["user_info"];
  const userName = userJ["uname"];
  const userColor = userJ["name_color"];
  const user: User = { name: userName, id: 0, color: userColor };
  const price = dataJ["price"] as number;
  return {
    id,
    message: content,
    medal,
    user,
    price,
  };
}

export function resolveSuperChatJpn(message: any): SuperChatJpn {
  const dataJ = message["data"];
  const id = dataJ["id"] as number;
  const content = dataJ["message"];
  const contentJpn = dataJ["message_jpn"];
  let medal: Medal | undefined = undefined;
  if (dataJ["medal_info"]) {
    const medalJ = dataJ["medal_info"];
    const medalLevel = medalJ["medal_level"] as number;
    const medalName = medalJ["medal_name"] as string;
    const medalColor = medalJ["medal_color"] as string;
    medal = {
      level: medalLevel,
      name: medalName,
      color: medalColor,
    };
  }
  const userJ = dataJ["user_info"];
  const userName = userJ["uname"];
  const userColor = userJ["name_color"];
  const user: User = { name: userName, id: 0, color: userColor };
  const price = dataJ["price"] as number;
  return {
    id,
    message: content,
    messageJpn: contentJpn,
    medal,
    user,
    price,
  };
}

export function resolveGift(m: any): Gift {
  const dataJ = m["data"];
  const giftName = dataJ["giftName"] as string;
  const num = dataJ["num"] as number;
  let medal: Medal | undefined = undefined;
  if (dataJ["medal_info"]) {
    const medalJ = dataJ["medal_info"];
    const medalLevel = medalJ["medal_level"] as number;
    const medalName = medalJ["medal_name"] as string;
    const medalColor = medalJ["medal_color"] as string;
    medal = {
      level: medalLevel,
      name: medalName,
      color: medalColor,
    };
  }
  const userName = dataJ["uname"] as string;
  const userId = dataJ["uid"] as number;
  const user: User = { name: userName, id: userId };
  const price = dataJ["price"] as number;
  const gold = dataJ["gold"] as number;
  const silver = dataJ["silver"] as number;
  return {
    giftName,
    user,
    medal,
    price,
    gold,
    silver,
    num,
  };
}

const textEncoder = new TextEncoder();
const textDecoder = new TextDecoder("utf-8");

function readInt(buffer: Uint8Array, start: number, len: number): number {
  let result = 0;
  for (let i = len - 1; i >= 0; i--) {
    result += Math.pow(256, len - i - 1) * buffer[start + i];
  }
  return result;
}

function writeInt(buffer: Array<number>, start: number, len: number, value: number) {
  let i = 0;
  while (i < len) {
    buffer[start + i] = value / Math.pow(256, len - i - 1);
    i++;
  }
}

function unzip(packet: BlivePacket): Array<BlivePacket> {
  //TODO: 3. brotli
  if (packet.ver === 2) {
    // 2: gzip
    let data = pako.inflate(packet.body);
    let ret = new Array<BlivePacket>();
    let ofs = 0;
    while (ofs < data.byteLength) {
      const packetLen = readInt(data, ofs, 4);
      const headerLen = readInt(data, ofs + 4, 2);
      const ver = readInt(data, ofs + 6, 2);
      const op = readInt(data, ofs + 8, 4);
      const seq = readInt(data, ofs + 12, 4);
      const body = data.slice(ofs + 16, ofs + packetLen);
      ret.push(<BlivePacket>{
        packetLen,
        headerLen,
        ver,
        op,
        seq,
        body,
      });
      ofs += packetLen;
    }
    return ret;
  } else {
    // 0: json
    // 1: int32
    return [packet];
  }
}
