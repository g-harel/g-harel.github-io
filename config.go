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
		Icon        string
		Name        string
		Username    string
		Description string
		Location    string
		Repo        string
	}{
		Title:       "Test Name",
		Icon:        "https://avatars0.githubusercontent.ca/u/9319710?s=460&v=4",
		Name:        "Test Name",
		Username:    "user-name",
		Description: "Lorem Ipsum",
		Location:    "Antarctica",
		Repo:        "https://github.com/g-harel/g-harel.github.io",
	},
}
