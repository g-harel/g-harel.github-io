package queries

import (
	"github.com/g-harel/g-harel.github.io/graphql"
)

// User queries for user data.
func (c *Client) User(username string) (*User, error) {
	dest := &User{}
	return dest, graphql.Do(&graphql.Query{
		URL:   c.URL,
		Token: c.Token,
		Query: "queries/user.gql",
		Data:  struct{ Username string }{username},
		Dest: &struct {
			User *User `json:"user"`
		}{
			User: dest,
		},
	})
}

// User represents the response data from the `user.gql` query.
type User struct {
	Icon        string `json:"avatarUrl"`
	Email       string `json:"email"`
	Description string `json:"bio"`
	Name        string `json:"name"`
	Username    string `json:"login"`
	Location    string `json:"location"`
}
