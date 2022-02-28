package main

import (
	"flag"
	"log"

	"github.com/lqlklu/blive_proxy/proxy"
)

var (
	port int
)

func init() {
	flag.IntVar(&port, "port", 6470, "serve port number")
	flag.Parse()
}

func main() {
	log.Printf("serve at %d", port)
	proxy.Serve(port)
}
