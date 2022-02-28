package proxy

import (
	"encoding/json"
	"testing"
)

func TestConv(t *testing.T) {
	m := Message{
		Type: "CONNECT",
		Payload: ConnectPayload{
			RoomId: 510,
		},
	}
	buf, err := json.Marshal(m)
	if err != nil {
		panic(err)
	}
	var rm Message
	err = json.Unmarshal(buf, &rm)
	if err != nil {
		panic(err)
	}
	var cp ConnectPayload
	conv(rm.Payload, &cp)
	if cp.RoomId != 510 {
		t.Fail()
	}
}
