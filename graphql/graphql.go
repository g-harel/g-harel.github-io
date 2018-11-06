package graphql

import (
	"bytes"
	"encoding/json"
	"fmt"
	"html/template"
	"io"
	"net/http"
)

type Query struct {
	Token string
	URL   string
	Query string
	Data  interface{}
	Dest  interface{}
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

func Do(query *Query) error {
	tmpl, err := template.ParseFiles(query.Query)
	if err != nil {
		return err
	}

	templateContent := bytes.Buffer{}
	err = tmpl.Execute(&templateContent, query.Data)
	if err != nil {
		return err
	}

	r := &request{
		Query: templateContent.String(),
	}
	b, err := json.Marshal(r)
	if err != nil {
		return err
	}

	req, err := http.NewRequest("POST", query.URL, bytes.NewReader(b))
	if err != nil {
		return err
	}

	if query.Token != "" {
		req.Header.Add("Authorization", fmt.Sprintf("bearer %v", query.Token))
	}

	res, err := (&http.Client{}).Do(req)
	if err != nil {
		return err
	}

	responseData := &bytes.Buffer{}
	_, err = io.Copy(responseData, res.Body)
	if err != nil {
		return err
	}

	queryResponse := &response{
		Data: query.Dest,
	}

	err = json.Unmarshal(responseData.Bytes(), queryResponse)
	if err != nil {
		return err
	}

	if len(queryResponse.Errors) > 0 {
		return fmt.Errorf(queryResponse.Errors[0].Message)
	}

	return nil
}
