package blive

import (
	"encoding/json"
	"errors"
	"fmt"
	"io/ioutil"
	"net/http"
	"strconv"
)

type BliveInfo struct {
	WssUrl     string
	Token      string
	RoomId     int
	RealRoomId int
	Uid        int
}

func GetInfo(roomId int) (*BliveInfo, error) {
	roomInfoUrl := fmt.Sprintf("https://api.live.bilibili.com/room/v1/Room/get_info_by_id?ids[]=%d", roomId)
	roomInfoBody, err := get(roomInfoUrl)
	if err != nil {
		return nil, err
	}

	realRoomId, uid, err := decodeRoomInfoBody(roomInfoBody, roomId)
	if err != nil {
		return nil, err
	}

	danmuInfoUrl := fmt.Sprintf("https://api.live.bilibili.com/xlive/web-room/v1/index/getDanmuInfo?id=%d", realRoomId)
	danmuInfoBody, err := get(danmuInfoUrl)
	if err != nil {
		return nil, err
	}

	wssUrl, token := decodeDanmuInfoBody(danmuInfoBody)

	info := &BliveInfo{
		WssUrl:     wssUrl,
		Token:      token,
		RoomId:     roomId,
		RealRoomId: realRoomId,
		Uid:        uid,
	}
	return info, nil
}

func get(url string) ([]byte, error) {
	resp, err := http.Get(url)
	if err != nil {
		return nil, err
	}
	if resp.StatusCode == 200 {
		body, err := ioutil.ReadAll(resp.Body)
		if err != nil {
			return nil, err
		}
		return body, nil
	}
	return nil, errors.New("Fail")
}

func decodeRoomInfoBody(body []byte, roomId int) (realRoomId int, uid int, err error) {
	var cont map[string]interface{}
	err = json.Unmarshal(body, &cont)
	if err != nil {
		panic(err)
	}
	data := cont["data"].(map[string]interface{})

	for _, v := range data {
		vv := v.(map[string]interface{})
		realRoomId, err = strconv.Atoi(vv["roomid"].(string))
		if err != nil {
			return 0, 0, err
		}
		uid, err = strconv.Atoi(vv["uid"].(string))
		if err != nil {
			return 0, 0, err
		}
	}
	return realRoomId, uid, nil
}

func decodeDanmuInfoBody(body []byte) (wssUrl string, token string) {
	var cont map[string]interface{}
	err := json.Unmarshal(body, &cont)
	if err != nil {
		panic(err)
	}
	data := cont["data"].(map[string]interface{})
	hostList := data["host_list"].([]interface{})
	theHost := hostList[0].(map[string]interface{})
	host := theHost["host"].(string)
	wssPort := int(theHost["wss_port"].(float64))
	wssUrl = fmt.Sprintf("wss://%s:%d/sub", host, wssPort)
	token = data["token"].(string)
	return
}
