package main

// Config configures how the output is generated.
type Config struct {
	Templates string
	RootName  string
	OutPath   string
	Data      interface{}
}

var config = Config{
	Templates: "templates",
	RootName:  "index.tmpl",
	OutPath:   "index.html",
	Data: struct {
		Title       string
		Name        string
		Username    string
		Description string
		Location    string
	}{
		Title:       "Gabriel Harel",
		Name:        "Gabriel Harel",
		Username:    "g-harel",
		Description: "Software Engineering student at Concordia University",
		Location:    "Montreal",
	},
}
