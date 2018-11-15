package query

import (
	"strings"
)

type project struct {
	Owner string
	Name  string
}

// Projects queries for project data.
func (c *Client) Projects(projects []string) ([]Project, error) {
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

	dest := []Project{}
	return dest, c.Do(&Query{
		Query: c.Queries + "/projects.gql",
		Data:  data,
		Dest:  dest,
	})
}

// Project represents the response data from the `projects.gql` query.
type Project struct {
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
