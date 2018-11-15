package query

import (
	"strconv"
	"strings"
)

type project struct {
	Key   string
	Owner string
	Name  string
}

// Projects queries for project data.
func (c *Client) Projects(projects []string) ([]*Project, error) {
	data := struct {
		Projects []*project
	}{
		Projects: []*project{},
	}

	// Project list is parsed to split owner from name.
	for i, proj := range projects {
		strs := strings.SplitN(proj, "/", 2)
		owner := strs[0]
		var name string
		if len(strs) > 1 {
			name = strs[1]
		}
		data.Projects = append(data.Projects, &project{
			// Owner/Project names are not safe to use as graphql keys.
			Key:   "p" + strconv.Itoa(i),
			Owner: owner,
			Name:  name,
		})
	}

	// Result is written to a map temporarily (api can't return a list).
	res := map[string]*Project{}
	err := c.Do(&Query{
		Query: c.Queries + "/projects.gql",
		Data:  data,
		Dest:  &res,
	})
	if err != nil {
		return nil, err
	}

	// Returned array is build from query result with a preserved project order.
	dest := []*Project{}
	for _, project := range data.Projects {
		projectData, ok := res[project.Key]
		if ok {
			dest = append(dest, projectData)
		}
	}

	return dest, nil
}

// Project represents the response data from the `projects.gql` query.
type Project struct {
	FullName string `json:"nameWithOwner"`
	Name     string `json:"name"`
	Owner    struct {
		Username string `json:"login"`
	} `json:"owner"`
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
