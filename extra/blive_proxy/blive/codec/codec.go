package codec

import (
	"bytes"
	"compress/zlib"
	"encoding/binary"
	"encoding/json"
	"fmt"
	"io"
)

type Operation uint32

const (
	INVALID         Operation = 0
	HEARTBEAT       Operation = 2
	HEARTBEAT_REPLY Operation = 3
	MESSAGE         Operation = 5
	USER_AUTH       Operation = 7
	CONNECT_SUCC    Operation = 8
)

func (op Operation) String() string {
	switch op {
	case INVALID:
		return "Invalid"
	case HEARTBEAT:
		return "Heatbeat"
	case HEARTBEAT_REPLY:
		return "HeartbeatReply"
	case MESSAGE:
		return "Message"
	case USER_AUTH:
		return "UserAuth"
	case CONNECT_SUCC:
		return "ConnectSucc"
	default:
		return "Invalid"
	}
}

type Message struct {
	PacketLen uint32
	HeaderLen uint16
	ProVer    uint16
	Op        Operation
	Seq       uint32
	Body      []byte
}

func NewMessage(op Operation, body []byte) *Message {
	return &Message{
		PacketLen: uint32(16 + len(body)),
		HeaderLen: 16,
		ProVer:    1,
		Op:        op,
		Seq:       1,
		Body:      body,
	}
}

func NewJson(op Operation, cont interface{}) *Message {
	body, err := json.Marshal(cont)
	if err != nil {
		panic(err)
	}
	return NewMessage(op, body)
}

func NewUserAuth(realRoomId int, token string) *Message {
	return NewJson(USER_AUTH, map[string]interface{}{
		"roomid": realRoomId,
		"key":    token,
	})
}

func NewHeartbeat() *Message {
	return NewMessage(HEARTBEAT, []byte{})
}

func (m *Message) WriteTo(w io.Writer) (n int64, err error) {
	buf := new(bytes.Buffer)
	err = binary.Write(buf, binary.BigEndian, m.PacketLen)
	if err != nil {
		return 0, err
	}
	err = binary.Write(buf, binary.BigEndian, m.HeaderLen)
	if err != nil {
		return 0, err
	}
	err = binary.Write(buf, binary.BigEndian, m.ProVer)
	if err != nil {
		return 0, err
	}
	err = binary.Write(buf, binary.BigEndian, m.Op)
	if err != nil {
		return 0, err
	}
	err = binary.Write(buf, binary.BigEndian, m.Seq)
	if err != nil {
		return 0, err
	}
	_, err = buf.Write(m.Body)
	if err != nil {
		return 0, err
	}

	n, err = buf.WriteTo(w)
	if err != nil {
		return n, err
	}
	return n, nil
}

func (m *Message) ReadFrom(r io.Reader) (n int64, err error) {
	err = binary.Read(r, binary.BigEndian, &m.PacketLen)
	if err != nil {
		return
	}
	n += 4

	err = binary.Read(r, binary.BigEndian, &m.HeaderLen)
	if err != nil {
		return
	}
	n += 2

	err = binary.Read(r, binary.BigEndian, &m.ProVer)
	if err != nil {
		return
	}
	n += 2

	err = binary.Read(r, binary.BigEndian, &m.Op)
	if err != nil {
		return
	}
	n += 4

	err = binary.Read(r, binary.BigEndian, &m.Seq)
	if err != nil {
		return
	}
	n += 4

	m.Body, err = io.ReadAll(io.LimitReader(r, int64(m.PacketLen-uint32(m.HeaderLen))))
	if err != nil {
		return
	}
	n += int64(len(m.Body))
	return
}

func (m *Message) String() string {
	switch m.ProVer {
	case 1:
		n := binary.BigEndian.Uint32(m.Body)
		return fmt.Sprintf("%s: %d", m.Op.String(), n)
	default:
		return fmt.Sprintf("%s: %s", m.Op.String(), string(m.Body))
	}
}

func zlibUnzip(cont []byte) ([]byte, error) {
	buf := bytes.NewReader(cont)
	r, err := zlib.NewReader(buf)
	if err != nil {
		return nil, err
	}
	defer r.Close()
	return io.ReadAll(r)
}

func (m *Message) Unzip() []*Message {
	switch m.ProVer {
	case 2:
		// zlib
		buf, err := zlibUnzip(m.Body)
		if err != nil {
			panic(err)
		}
		return ReadMore(buf)
	default:
		// 0: json
		// 1: int32
		// brotli
		return []*Message{m}
	}
}

func ReadMore(buf []byte) []*Message {
	ret := make([]*Message, 0)
	r := bytes.NewReader(buf)
	var ofs int64 = 0
	for ofs < int64(len(buf)) {
		m := new(Message)
		n, err := m.ReadFrom(r)
		if err != nil {
			panic(err)
		}
		ofs += n
		ret = append(ret, m)
	}
	return ret
}
