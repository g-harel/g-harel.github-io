package query

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"net/http"
)

// Client configures request address and authentication.
type Client struct {
	Queries string
	URL     string
	Token   string
}

// Query represents a prepared query with arbitrary input/output data formats.
type Query struct {
	Query string
	Data  interface{}
	Dest  interface{}
}

// Do executes a graphql query using the client's configuration.
func (c *Client) Do(query *Query) error {
	tmpl, err := template.ParseFiles(query.Query)
	if err != nil {
		return fmt.Errorf("could not parse query template: %v", err)
	}

	templateContent := bytes.Buffer{}
	err = tmpl.Execute(&templateContent, query.Data)
	if err != nil {
		return fmt.Errorf("could not execute query template: %v", err)
	}

	r := &request{
		Query: templateContent.String(),
	}
	b, err := json.Marshal(r)
	if err != nil {
		return fmt.Errorf("could not marshal request: %v", err)
	}

	req, err := http.NewRequest("POST", c.URL, bytes.NewReader(b))
	if err != nil {
		return fmt.Errorf("could not create http request: %v", err)
	}

	if c.Token != "" {
		req.Header.Add("Authorization", fmt.Sprintf("bearer %v", c.Token))
	}

	res, err := (&http.Client{}).Do(req)
	if err != nil {
		return fmt.Errorf("query request failed: %v", err)
	}

	responseData := &bytes.Buffer{}
	_, err = io.Copy(responseData, res.Body)
	if err != nil {
		return fmt.Errorf("could not read response data: %v", err)
	}

	queryResponse := &response{
		Data: query.Dest,
	}

	err = json.Unmarshal(responseData.Bytes(), queryResponse)
	if err != nil {
		return fmt.Errorf("could not parse request data: %v", err)
	}

	if len(queryResponse.Errors) > 0 {
		return fmt.Errorf("graphql query error (1/%v): %v", len(queryResponse.Errors), queryResponse.Errors[0].Message)
	}

	return nil
}

type request struct {
	Query string `json:"query"`
}

type response struct {
	Data   interface{} `json:"data"`
	Errors []struct {
		Message   string `json:"message"`
		Locations []struct {
			Line   int `json:"line"`
			Column int `json:"column"`
		} `json:"location"`
	} `json:"errors"`
}
