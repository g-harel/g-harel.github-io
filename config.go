package main

// Config configures how the output is generated.
type Config struct {
	Username string
	Projects []string
}

var config = Config{
	Username: "g-harel",
	Projects: []string{
		"okwolo/okwolo",
		"g-harel/rickety",
		"g-harel/svgsaurus",
		"g-harel/ence",
		"g-harel/slurry",
		"g-harel/coco",
	},
}
