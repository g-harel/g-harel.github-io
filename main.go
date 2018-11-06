package main

import (
	"bytes"
	"fmt"
	"html/template"
	"io"
	"io/ioutil"
	"os"
	"path/filepath"
	"strconv"
	"time"

	"github.com/g-harel/g-harel.github.io/queries"
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

// Generate generates the static files from the config.
func Generate(c Config) error {
	tmpl, err := ReadTemplates(c.Templates)
	if err != nil {
		return err
	}

	b := bytes.Buffer{}
	err = tmpl.ExecuteTemplate(&b, c.RootName, c.Data)
	if err != nil {
		return err
	}

	err = WriteOut(c.OutPath, b)
	if err != nil {
		return err
	}

	return nil
}

func main() {
	start := time.Now()

	err := Generate(config)
	if err != nil {
		panic(err)
	}

	token, ok := os.LookupEnv("GITHUB_API_TOKEN")
	if !ok {
		return
	}
	c := queries.Client{
		Token: token,
		URL:   "https://api.github.com/graphql",
	}

	user, err := c.User(config.Username)
	if err != nil {
		panic(err)
	}
	fmt.Println(user.Name)

	projects, err := c.Projects(config.Projects)
	if err != nil {
		panic(err)
	}
	for _, project := range *projects {
		fmt.Println(project.FullName + " " + strconv.Itoa(project.Stargazers.Count))
	}

	fmt.Printf("%s\n", time.Since(start))
}
