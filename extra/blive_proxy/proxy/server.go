package proxy

import (
	"fmt"
	"log"
	"net/http"

	"golang.org/x/net/websocket"
)

func Serve(port int) {
	addr := fmt.Sprintf(":%d", port)
	http.Handle("/blive", websocket.Handler(bliveServer))
	err := http.ListenAndServe(addr, nil)
	if err != nil {
		log.Panicln(err)
	}
}

func bliveServer(ws *websocket.Conn) {
	h := NewHandler(ws)
	h.Serve()
}
