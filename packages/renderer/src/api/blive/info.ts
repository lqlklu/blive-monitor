import axios from "axios";

export interface RoomInfo {
  roomId: number;
  shortId: number;
  uid: number;
  uname: string;
  title: string;
  tags: string;
  wssUrl: string;
  token: string;
}

export async function getRoomInfo(roomId: number): Promise<RoomInfo> {
  const r = await axios.get<RoomInfo>(`http://localhost:2233/roominfo/${roomId}`);
  return r.data;
}
