package main

import (
	"bytes"
	"html/template"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
)

// ReadTemplates reads all files in the given directory as templates.
// Templates nested in folders will be named relative to the root directory.
func ReadTemplates(dir string) (*template.Template, error) {
	tmpl := template.New("")
	dir = filepath.Clean(dir)

	return tmpl, filepath.Walk(dir, func(path string, f os.FileInfo, err error) error {
		if err != nil {
			return err
		}

		if f.IsDir() {
			return nil
		}

		b, err := ioutil.ReadFile(path)
		if err != nil {
			return err
		}

		_, err = tmpl.New(path[len(dir)+1:]).Parse(string(b))
		if err != nil {
			return err
		}

		return nil
	})
}

// WriteOut writes the input buffer's data to the given path.
// Each line's leading and trailing whitespace is trimmed before being written.
func WriteOut(path string, b bytes.Buffer) error {
	f, err := os.Create(path)
	if err != nil {
		return err
	}

	for {
		line, readErr := b.ReadBytes('\n')
		if readErr != nil && readErr != io.EOF {
			return err
		}

		_, err = f.Write(bytes.TrimSpace(line))
		if err != nil {
			return err
		}

		if readErr == io.EOF {
			break
		}
	}

	return nil
}

func main() {
	config := struct {
		Templates string
		RootName  string
		OutPath   string
		Data      interface{}
	}{
		Templates: "templates",
		RootName:  "index.tmpl",
		OutPath:   "index.html",
		Data:      nil,
	}

	tmpl, err := ReadTemplates(config.Templates)
	if err != nil {
		panic(err)
	}

	b := bytes.Buffer{}
	err = tmpl.ExecuteTemplate(&b, config.RootName, config.Data)
	if err != nil {
		panic(err)
	}

	err = WriteOut(config.OutPath, b)
	if err != nil {
		panic(err)
	}
}
