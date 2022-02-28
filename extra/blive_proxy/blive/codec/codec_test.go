package codec

import (
	"bytes"
	"testing"
)

func TestReadWrite(t *testing.T) {
	buf := new(bytes.Buffer)

	m1 := NewUserAuth(510, "abcdefghijklmn")
	m1.WriteTo(buf)

	m2 := new(Message)
	m2.ReadFrom(buf)

	if m1.String() != m2.String() {
		t.Fail()
	}
}
