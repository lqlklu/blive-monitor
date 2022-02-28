package blive

import (
	"fmt"
	"log"
	"time"

	"github.com/lqlklu/blive_proxy/blive/codec"
	"golang.org/x/net/websocket"
)

type Conn struct {
	info   *BliveInfo
	conn   *websocket.Conn
	ticker *time.Ticker
}

func NewClient() *Conn {
	return &Conn{
		info:   nil,
		conn:   nil,
		ticker: nil,
	}
}

// 1. connect
// 2. send userAuth
// 3. set heartbeat
func (c *Conn) Connect(roomId int) (err error) {
	c.info, err = GetInfo(roomId)
	if err != nil {
		return err
	}
	c.conn, err = websocket.Dial(c.info.WssUrl, "", "http://localhost/")
	// c.conn, err = net.Dial("tcp", c.info.WssUrl)
	if err != nil {
		return err
	}
	c.sendUserAuth()
	c.setHeartbeat()
	return nil
}

func (c *Conn) Send(m *codec.Message) error {
	_, err := m.WriteTo(c.conn)
	return err
}

func (c *Conn) Recv(m *codec.Message) error {
	_, err := m.ReadFrom(c.conn)
	return err
}

func (c *Conn) Close() {
	c.info = nil
	c.conn.Close()
	c.conn = nil
	c.ticker.Stop()
	c.ticker = nil
}

func (c *Conn) sendUserAuth() {
	m := codec.NewUserAuth(c.info.RealRoomId, c.info.Token)
	_, err := m.WriteTo(c.conn)
	if err != nil {
		panic(err)
	}
	log.Printf("EnterRoom: %d", c.info.RoomId)
}

func (c *Conn) setHeartbeat() {
	c.ticker = time.NewTicker(30 * time.Second)
	go func() {
		for range c.ticker.C {
			m := codec.NewHeartbeat()
			_, err := m.WriteTo(c.conn)
			if err != nil {
				fmt.Println(err.Error())
			}
			// log.Printf("Hearbet: %s", t.String())
		}
	}()
}

func Dial(roomId int) (*Conn, error) {
	conn := NewClient()
	err := conn.Connect(roomId)
	if err != nil {
		return nil, err
	}
	return conn, nil
}
