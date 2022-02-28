package proxy

import (
	"encoding/json"
	"errors"
	"log"
	"sync"
	"time"

	"github.com/lqlklu/blive_proxy/blive"
	"github.com/lqlklu/blive_proxy/blive/codec"
	"github.com/lqlklu/blive_proxy/blive/entity"
	"golang.org/x/net/websocket"
)

type BliveProxy struct {
	ws      *websocket.Conn
	c       *blive.Conn
	roomId  int
	hbTimer *time.Timer
	close   chan bool
	wg      sync.WaitGroup
}

const HB_TIMEOUT = 60 * time.Second

func NewHandler(ws *websocket.Conn) *BliveProxy {
	return &BliveProxy{
		ws:      ws,
		c:       nil,
		roomId:  -1,
		hbTimer: nil,
		close:   make(chan bool),
	}
}

func (h *BliveProxy) Serve() {
	log.Printf("SERVE: %s\n", h.ws.RemoteAddr().String())
	err := h.waitConn()
	if err != nil {
		log.Println(err)
		return
	}
	h.setHbTimer()
	h.connectBlive()
	h.wg.Wait()
}

func (h *BliveProxy) Close() {
	h.close <- true
	h.c.Close()
	h.ws.Close()
	log.Printf("CLOSE: %s\n", h.ws.RemoteAddr().String())
}

func (h *BliveProxy) waitConn() error {
	var m Message
	err := websocket.JSON.Receive(h.ws, &m)
	if err != nil {
		return err
	}
	if m.Type == "CONNECT" {
		var cp ConnectPayload
		conv(&m.Payload, &cp)
		h.roomId = cp.RoomId
	} else {
		return errors.New("not CONNECT")
	}
	return nil
}

func (h *BliveProxy) setHbTimer() {
	h.hbTimer = time.NewTimer(HB_TIMEOUT)

	h.wg.Add(1)
	go func() {
		defer h.wg.Done()
		for {
			select {
			case <-h.close:
				return
			default:
				var m Message
				err := websocket.JSON.Receive(h.ws, &m)
				if err != nil {
					log.Println(err)
					h.Close()
					return
				}
				if m.Type == "HEARTBEAT" {
					h.hbTimer.Reset(HB_TIMEOUT)
				}
			}
		}
	}()

	h.wg.Add(1)
	go func() {
		defer h.wg.Done()
		<-h.hbTimer.C
		h.Close()
	}()
}

func (h *BliveProxy) connectBlive() {
	var err error
	h.c, err = blive.Dial(h.roomId)
	if err != nil {
		log.Println(err)
		h.Close()
	}

	h.wg.Add(1)
	go func() {
		defer h.wg.Done()
		for {
			select {
			case <-h.close:
				return
			default:
				m := new(codec.Message)
				err := h.c.Recv(m)
				if err != nil {
					log.Println(err)
					h.Close()
				}
				batch := m.Unzip()
				for _, im := range batch {
					go h.handleMessage(im)
				}
			}
		}
	}()
}

func (h *BliveProxy) handleMessage(m *codec.Message) {
	switch m.Op {
	case codec.MESSAGE:
		h.onMessage(m)
	default:
		log.Println(m.Op.String())
	}
}

func (h *BliveProxy) onMessage(m *codec.Message) {
	var j map[string]interface{}
	err := json.Unmarshal(m.Body, &j)
	if err != nil {
		panic(err)
	}
	cmd := j["cmd"].(string)
	switch cmd {
	case "DANMU_MSG":
		h.onDanmu(j)
	case "SUPER_CHAT_MESSAGE", "SUPER_CHAT_MESSAGE_JPN":
		h.onSuperchat(j)
	case "SEND_GIFT":
		h.onGift(j)
	case "COMBO_SEND":
		// log.Println(cmd)
	default:
	}
}

func (h *BliveProxy) onDanmu(j map[string]interface{}) {
	d := entity.NewDanmu(j)
	log.Printf("DANMU: %s", d.String())

	msg := Message{Type: "DANMU", Payload: d}
	err := websocket.JSON.Send(h.ws, &msg)
	if err != nil {
		log.Println(err)
		h.Close()
		return
	}
}

func (h *BliveProxy) onSuperchat(j map[string]interface{}) {
	s := entity.NewSuperchat(j)
	log.Printf("SUPERCHAT: %s", s.String())

	msg := Message{Type: "SUPERCHAT", Payload: s}
	err := websocket.JSON.Send(h.ws, &msg)
	if err != nil {
		log.Println(err)
		h.Close()
		return
	}
}

func (h *BliveProxy) onGift(j map[string]interface{}) {
	// log.Println(cmd)

}
