package main

import (
	"fmt"
	"os"
	"time"

	"github.com/g-harel/g-harel.github.io/query"
	"github.com/g-harel/g-harel.github.io/render"
)

func main() {
	start := time.Now()

	token, ok := os.LookupEnv("GITHUB_API_TOKEN")
	if !ok {
		return
	}
	client := query.Client{
		Queries: "query",
		URL:     "https://api.github.com/graphql",
		Token:   token,
	}

	user, err := client.User(config.Username)
	if err != nil {
		panic(err)
	}

	projects, err := client.Projects(config.Projects)
	if err != nil {
		panic(err)
	}

	agent := render.Agent{
		Templates: "render",
		RootName:  "index.tmpl",
		OutPath:   "index.html",

		User:     user,
		Projects: projects,
	}
	err = agent.Execute()
	if err != nil {
		panic(err)
	}

	fmt.Printf("Built from fresh data in %s\n", time.Since(start))
}
