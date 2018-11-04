package main

import (
	"io/ioutil"
	"os"
	"text/template"
)

// Config references the file sources for the data.
type Config struct {
	Out      string
	Template string
	Style    []string
	Script   []string
}

// Data represents the template data being rendered.
type Data struct {
	Name   string
	Style  []string
	Script []string
}

func main() {
	c := Config{
		Out:      "index.html",
		Template: "templates/index.html",
		Style:    []string{"templates/style.css"},
		Script:   []string{"templates/script.js"},
	}
	d := Data{
		Name: "g-harel.github.io",
	}

	t, err := ioutil.ReadFile(c.Template)
	if err != nil {
		panic(err)
	}

	d.Script = make([]string, len(c.Script))
	for i, path := range c.Script {
		b, err := ioutil.ReadFile(path)
		if err != nil {
			panic(err)
		}
		d.Script[i] = string(b)
	}

	d.Style = make([]string, len(c.Style))
	for i, path := range c.Style {
		b, err := ioutil.ReadFile(path)
		if err != nil {
			panic(err)
		}
		d.Style[i] = string(b)
	}

	f, err := os.Create(c.Out)
	if err != nil {
		panic(err)
	}

	tmpl, err := template.New("Entry").Parse(string(t))
	if err != nil {
		panic(err)
	}

	tmpl.Execute(f, d)
}
