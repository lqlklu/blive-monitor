use std::collections::HashMap;

use serde::{Deserialize, Serialize};

#[derive(Serialize, Deserialize, Debug, Clone)]
#[serde(rename_all = "camelCase")]
pub struct RoomInfo {
  pub room_id: u32,
  pub short_id: u32,
  pub uid: u32,
  pub uname: String,
  pub title: String,
  pub tags: String,
  pub wss_url: String,
  pub token: String,
}

pub async fn get_room_info(roomid: u32) -> anyhow::Result<RoomInfo> {
  let room_info_url = format!(
    "https://api.live.bilibili.com/room/v1/Room/get_info_by_id?ids[]={}",
    roomid
  );
  let room_info_resp = reqwest::get(&room_info_url)
    .await?
    .json::<RoomInfoResp>()
    .await?;
  let (roomid, short_id, uid, uname, title, tags) = {
    let data = room_info_resp.data.values().last().unwrap();
    (
      data.roomid.parse::<u32>().unwrap(),
      data.short_id.parse::<u32>().unwrap(),
      data.uid.parse::<u32>().unwrap(),
      data.uname.clone(),
      data.title.clone(),
      data.tags.clone(),
    )
  };

  let danmu_info_url = format!(
    "https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id={}",
    roomid
  );
  let danmu_info_resp = reqwest::get(&danmu_info_url)
    .await?
    .json::<DanmuInfoResp>()
    .await?;
  let (wss_url, token) = {
    let data = danmu_info_resp.data;
    (
      {
        let host = &data.host_list[0];
        format!("wss://{}:{}/sub", host.host, host.wss_port)
      },
      data.token,
    )
  };

  Ok(RoomInfo {
    room_id: roomid,
    short_id,
    uid,
    uname,
    title,
    tags,
    wss_url,
    token,
  })
}

#[derive(Serialize, Deserialize, Debug)]
struct RoomInfoResp {
  data: HashMap<String, RoomInfoRespData>,
}

#[derive(Serialize, Deserialize, Debug)]
struct RoomInfoRespData {
  roomid: String,
  uid: String,
  uname: String,
  title: String,
  tags: String,
  short_id: String,
}

#[derive(Serialize, Deserialize, Debug)]
struct DanmuInfoResp {
  data: DanmuInfoRespData,
}

#[derive(Serialize, Deserialize, Debug)]
struct DanmuInfoRespData {
  token: String,
  host_list: Vec<HostInfo>,
}

#[derive(Serialize, Deserialize, Debug)]
struct HostInfo {
  host: String,
  port: i32,
  wss_port: i32,
  ws_port: i32,
}
