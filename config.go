package main

import (
	"os"
)

// Config configures how the output is generated.
type Config struct {
	Templates string
	RootName  string
	OutPath   string

	Query    string
	Endpoint string
	Token    string

	Request *Request
}

var config = &Config{
	Templates: "templates",
	RootName:  "index.tmpl",
	OutPath:   "index.html",

	Query:    "query.gql",
	Endpoint: "https://api.github.com/graphql",
	Token:    os.Getenv("GITHUB_API_TOKEN"),

	Request: &Request{
		Login: "g-harel",
		Projects: []ProjectRequest{
			{"okwolo", "okwolo"},
			{"g-harel", "rickety"},
			{"g-harel", "svgsaurus"},
			{"g-harel", "ence"},
			{"g-harel", "slurry"},
			{"g-harel", "coco"},
			{"g-harel", "g-harel.github.io"},
			{"g-harel", "superpermutations"},
			{"g-harel", "paph"},
			{"g-harel", "cover-gen"},
			{"g-harel", "http"},
			{"g-harel", "targetblank"},
			{"g-harel", "663"},
			{"g-harel", "game-of-life"},
			{"g-harel", "num-match"},
			{"g-harel", "open-source-logos"},
			{"g-harel", "diip"},
			{"g-harel", "emn"},
		},
		Contributions: []ContributionRequest{
			{"facebook", "jest", 7170, 7165},
			{"golang", "dep", 1755, 1754},
			{"DefinitelyTyped", "DefinitelyTyped", 26589, 0},
		},
	},
}
