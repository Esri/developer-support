//Package agol is a utilitiy for working with ArcGIS Online.
package agol

import (
	"encoding/json"
	"fmt"
	"io/ioutil"
	"log"
	"net/http"
	"net/url"
	"os"
)

//The response recieved from the token request
type TokenResponse struct {
	Expires int    `json:"expires"`
	Ssl     bool   `json:"ssl"`
	Token   string `json:"token"`
}

//GetToken request
func GetToken(username string, password string) TokenResponse {
	resp, err := http.PostForm("https://arcgis.com/sharing/rest/generateToken", url.Values{"username": {username}, "password": {password}, "referer": {"https://www.arcgis.com"}, "f": {"json"}})
	if err != nil {
		log.Fatal(err)
	}
	defer resp.Body.Close()
	contents, err := ioutil.ReadAll(resp.Body)
	if err != nil {
		fmt.Printf("%s", err)
		os.Exit(1)
	}
	var tokendata TokenResponse
	err2 := json.Unmarshal([]byte(contents), &tokendata)
	//fmt.Println(tokendata)
	if err2 == nil {
		//fmt.Printf("%+v\n", tokendata)
	} else {
		fmt.Println(err2)
		//fmt.Printf("%+v\n", tokendata)
	}
	return tokendata
}
