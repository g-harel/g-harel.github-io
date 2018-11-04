package main

import (
	"bytes"
	"io"
	"io/ioutil"
	"os"
	"path"
	"path/filepath"
	"text/template"
)

// Config references the file sources for the data.
type Config struct {
	Out   string
	Src   string
	Entry string
	Files map[string]string
}

// Data represents the template data being rendered.
type Data struct {
	Files map[string][]string
}

func main() {
	c := Config{
		Out:   "index.html",
		Src:   "templates",
		Entry: "index.html",
		Files: map[string]string{
			"style":  "*.css",
			"script": "*.js",
		},
	}

	d := Data{
		Files: map[string][]string{},
	}

	for k, v := range c.Files {
		paths, err := filepath.Glob(path.Join(c.Src, v))
		if err != nil {
			panic(err)
		}
		contents := make([]string, len(paths))
		for i, path := range paths {
			b, err := ioutil.ReadFile(path)
			if err != nil {
				panic(err)
			}
			contents[i] = string(b)
		}
		d.Files[k] = contents
	}

	tmpl, err := template.ParseGlob(path.Join(c.Src, c.Entry))
	if err != nil {
		panic(err)
	}

	var b bytes.Buffer
	err = tmpl.Execute(&b, d)
	if err != nil {
		panic(err)
	}

	f, err := os.Create(c.Out)
	if err != nil {
		panic(err)
	}

	eof := false
	for {
		line, err := b.ReadBytes('\n')
		eof = err == io.EOF
		if err != nil && !eof {
			panic(err)
		}
		_, err = f.Write(bytes.TrimSpace(line))
		if err != nil {
			panic(err)
		}
		if eof {
			break
		}
	}
}
