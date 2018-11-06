package queries

import (
	"strings"

	"github.com/g-harel/g-harel.github.io/graphql"
)

type project struct {
	Owner string
	Name  string
}

// Projects queries for project data.
func (c *Client) Projects(projects []string) (*ProjectDest, error) {
	data := struct {
		Projects []*project
	}{
		Projects: []*project{},
	}

	for _, proj := range projects {
		strs := strings.SplitN(proj, "/", 2)
		owner := strs[0]
		var name string
		if len(strs) > 1 {
			name = strs[1]
		}
		data.Projects = append(data.Projects, &project{owner, name})
	}

	dest := &ProjectDest{}
	return dest, graphql.Do(&graphql.Query{
		URL:   c.URL,
		Token: c.Token,
		Query: "queries/projects.gql",
		Data:  data,
		Dest:  dest,
	})
}

// ProjectDest represents the response data from the `projects.gql` query.
type ProjectDest = map[string]struct {
	FullName    string `json:"nameWithOwner"`
	Description string `json:"description"`
	URL         string `json:"url"`
	Stargazers  struct {
		Count int `json:"totalCount"`
	} `json:"stargazers"`
	Languages struct {
		Nodes []struct {
			Name  string `json:"name"`
			Color string `json:"color"`
		} `json:"nodes"`
	} `json:"languages"`
}
