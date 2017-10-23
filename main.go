//go:generate node fuse.js
//go:generate statik

package main

import (
	"encoding/json"
	"flag"
	"io/ioutil"
	"log"
	"net"
	"net/http"
	"net/url"
	"os"
	"time"

	"github.com/pkg/browser"

	"github.com/rakyll/statik/fs"

	_ "github.com/hirochachacha/Go-Webix-Demo/statik"
)

var (
	httpFlag = flag.String("http", "localhost:8080", "Listen for HTTP connections on this address.")
)

func main() {
	log.SetFlags(log.Llongfile | log.LstdFlags)

	statikFS, err := fs.New()
	if err != nil {
		log.Fatalln(err)
	}

	http.Handle("/", http.FileServer(statikFS))

	http.HandleFunc("/json", dirHandlerFunc)

	l, err := net.Listen("tcp", *httpFlag)
	if err != nil {
		log.Fatalln(err)
	}

	err = browser.OpenURL("http://" + *httpFlag)
	if err != nil {
		log.Fatalln(err)
	}

	log.Println("running at http://" + *httpFlag)

	err = http.Serve(l, nil)
	if err != nil {
		log.Fatalln(err)
	}
}

type FileInfo struct {
	Id        int       `json:"id"`
	Name      string    `json:"name"`
	Size      int64     `json:"size"`
	CreatedAt time.Time `json:"created_at"`
	IsDir     bool      `json:"is_dir"`
}

func dirHandlerFunc(w http.ResponseWriter, req *http.Request) {
	params, err := url.ParseQuery(req.URL.RawQuery)
	if err != nil {
		log.Println(err)
		return
	}

	path := params.Get("path")

	f, err := os.Open(path)
	if err != nil {
		panic(err)
	}
	defer f.Close()

	fis, err := ioutil.ReadDir(path)
	if err != nil {
		panic(err)
	}

	data := make([]FileInfo, len(fis))
	for i, fi := range fis {
		data[i] = FileInfo{
			Id:        i + 1,
			Name:      fi.Name(),
			Size:      fi.Size(),
			CreatedAt: fi.ModTime(),
			IsDir:     fi.IsDir(),
		}
	}

	err = json.NewEncoder(w).Encode(data)
	if err != nil {
		panic(err)
	}
}
