import { ref } from "vue";

import { resolveGift, resolveSuperChatJpn, type BlivePacket } from "@/api";
import { CONNECT_SUCC, decode, encode, getRoomInfo, HEARTBEAT, HEARTBEAT_REPLY, MESSAGE, resolveDanmu, resolveInt, resolveJson, USER_AUTH, resolveSuperChat } from "@/api";
import { useDanmuStore, useGiftStore, useSuperchatStore } from "@/stores";
import { useWebSocket } from "@/composables";

export function useBlive(roomId: number) {
  const danmuStore = useDanmuStore();
  const superchatStore = useSuperchatStore();
  const giftStore = useGiftStore();

  const watched = ref("");
  const title = ref("");
  const uname = ref("");

  const onMessage = (message: any) => {
    // console.log("MESSAGE", message);
    switch (message.cmd) {
      case "DANMU_MSG": {
        const d = resolveDanmu(message);
        // console.log(d);
        danmuStore.add(d);
        break;
      }
      case "SUPER_CHAT_MESSAGE": {
        // console.log("SUPER_CHAT_MESSAGE", message);
        const sc = resolveSuperChat(message);
        console.log(sc);
        superchatStore.add(sc);
        break;
      }
      case "SUPER_CHAT_MESSAGE_JPN": {
        console.log("SUPER_CHAT_MESSAGE_JPN", message);
        const sc = resolveSuperChatJpn(message);
        console.log(sc);
        /// TODO: jpn
        break;
      }
      case "SEND_GIFT": {
        console.log(message);
        const g = resolveGift(message);
        console.log(g);
        giftStore.add(g);
        break;
      }
      case "COMBO_SEND": {
        console.log(message);
        break;
      }
      case "WATCHED_CHANGE": {
        // console.log("WATCHED", message.data["text_large"]);
        watched.value = message.data["text_large"];
        break;
      }
      default:
    }
  };
  const onPacket = (packet: BlivePacket) => {
    switch (packet.op) {
      case MESSAGE: {
        onMessage(resolveJson(packet.body));
        break;
      }
      case HEARTBEAT_REPLY: {
        const v = resolveInt(packet.body);
        // console.log("HEARTBEAT_REPLY", v);
        break;
      }
      case CONNECT_SUCC: {
        const v = resolveJson(packet.body);
        console.log("CONNECT_SUCC", v);
        break;
      }
      default:
    }
  };
  getRoomInfo(roomId)
    .then((info) => {
      console.log(info);
      title.value = info.title;
      uname.value = info.uname;
      const { send } = useWebSocket(info.wssUrl, {
        autoReconnect: true,
        autoClose: true,
        heartbeat: {
          interval: 30 * 1000,
          message: encode("", HEARTBEAT),
        },
        onConnected() {
          send(
            encode(
              JSON.stringify({
                roomid: info.roomId,
                protover: 2,
                platform: "web",
                type: 2,
                key: info.token,
                // token: info.token,
              }),
              USER_AUTH
            )
          );
        },
        async onMessage(_, ev: MessageEvent<Blob>) {
          const packets = await decode(ev.data);
          packets.forEach((p) => {
            onPacket(p);
          });
        },
      });
    })
    .catch((e) => {
      console.error(e);
    });

  return { title, uname, watched };
}
