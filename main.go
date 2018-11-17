package main

import (
	"bytes"
	"fmt"
	"io"
	"net/http"
	"os"
	"time"
)

func fatal(format string, a ...interface{}) {
	fmt.Fprintf(os.Stderr, "\033[31;1mfatal error: %s\033[0m\n", fmt.Sprintf(format, a...))
	os.Exit(1)
}

func main() {
	start := time.Now()

	requestData, err := config.Request.Marshall()
	if err != nil {
		panic(err)
	}

	req, err := http.NewRequest("POST", config.Endpoint, bytes.NewReader(requestData))
	if err != nil {
		fatal("could not create http request: %v", err)
	}

	if config.Token != "" {
		req.Header.Add("Authorization", fmt.Sprintf("bearer %v", config.Token))
	}

	res, err := (&http.Client{}).Do(req)
	if err != nil {
		fatal("query request failed: %v", err)
	}

	responseData := &bytes.Buffer{}
	_, err = io.Copy(responseData, res.Body)
	if err != nil {
		fatal("could not read response data: %v", err)
	}

	response := &Response{}
	err = response.Unmarshall(responseData.Bytes())
	if err != nil {
		fatal("could not parse response data: %v", err)
	}

	err = Render(config, response)
	if err != nil {
		fatal("could not render templates: %v", err)
	}

	fmt.Printf("Built from fresh data in %s\n", time.Since(start))
}
