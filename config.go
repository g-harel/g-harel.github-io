package main

// Config configures how the output is generated.
type Config struct {
	Templates string
	RootName  string
	OutPath   string
	Username  string
	Projects  []string

	Data interface{}
}

type Project struct {
	Name  string
	Owner string
}

var config = Config{
	Templates: "templates",
	RootName:  "index.tmpl",
	OutPath:   "index.html",
	Username:  "g-harel",
	Projects: []string{
		"okwolo/okwolo",
		"g-harel/rickety",
		"g-harel/svgsaurus",
		"g-harel/ence",
		"g-harel/slurry",
		"g-harel/coco",
	},

	Data: struct {
		Title       string
		Icon        string
		Name        string
		Username    string
		Description string
		Location    string
		Repo        string
	}{
		Title:       "Gabriel Harel",
		Icon:        "https://avatars0.githubusercontent.com/u/9319710?s=460&v=4",
		Name:        "Gabriel Harel",
		Username:    "g-harel",
		Description: "Software Engineering student at Concordia University",
		Location:    "Montreal",
		Repo:        "https://github.com/g-harel/g-harel.github.io",
	},
}
