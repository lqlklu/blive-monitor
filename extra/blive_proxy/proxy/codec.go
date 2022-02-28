package proxy

import (
	"encoding/json"

	"github.com/lqlklu/blive_proxy/blive/entity"
)

type Message struct {
	Type    string      `json:"type"`
	Payload interface{} `json:"payload"`
}

type ConnectPayload struct {
	RoomId int `json:"roomid"`
}

type DanmuPayload = entity.Danmu
type SuperchatPayload = entity.Superchat

func conv(src interface{}, dist interface{}) {
	buf, err := json.Marshal(src)
	if err != nil {
		panic(err)
	}
	err = json.Unmarshal(buf, &dist)
	if err != nil {
		panic(err)
	}
}
