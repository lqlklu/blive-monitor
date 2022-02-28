package entity

import (
	"fmt"
)

type Danmu struct {
	Id      int    `json:"id"`
	Message string `json:"message"`
	Medal   *Medal `json:"medal"`
	User    *User  `json:"user"`
}

func NewDanmu(j map[string]interface{}) *Danmu {
	info := j["info"].([]interface{})
	content := info[1].(string)
	var medal *Medal = nil
	medalJ := info[3].([]interface{})
	if len(medalJ) != 0 {
		medalLevl := int(medalJ[0].(float64))
		medalName := medalJ[1].(string)
		medal = &Medal{
			Level: medalLevl,
			Name:  medalName,
		}
	}
	userJ := info[2].([]interface{})
	userName := userJ[1].(string)
	user := &User{
		Name: userName,
	}
	return &Danmu{
		Message: content,
		Medal:   medal,
		User:    user,
	}
}

func (d *Danmu) String() string {
	if d.Medal != nil {
		return fmt.Sprintf("%s %s\n%s", d.Medal.String(), d.User.String(), d.Message)
	}
	return fmt.Sprintf("%s\n%s", d.User.String(), d.Message)
}

type Superchat struct {
	Id      int     `json:"id"`
	Message string  `json:"message"`
	Medal   *Medal  `json:"medal"`
	User    *User   `json:"user"`
	Price   float64 `json:"price"`
}

func NewSuperchat(j map[string]interface{}) *Superchat {
	dataJ := j["data"].(map[string]interface{})
	message := dataJ["message"].(string)
	var medal *Medal = nil
	switch j["medal_info"].(type) {
	case map[string]interface{}:
		medalJ := j["medal_info"].(map[string]interface{})
		medalLevel := int(medalJ["medal_level"].(float64))
		medalName := medalJ["medal_name"].(string)
		medal = &Medal{
			Level: medalLevel,
			Name:  medalName,
		}
	default:
	}
	userJ := dataJ["user_info"].(map[string]interface{})
	userName := userJ["uname"].(string)
	user := &User{
		Name: userName,
	}
	price := dataJ["price"].(float64)
	return &Superchat{
		Message: message,
		Medal:   medal,
		User:    user,
		Price:   price,
	}
}

func (s *Superchat) String() string {
	if s.Medal != nil {
		return fmt.Sprintf("%s %s\t\t\t\t%f\n%s", s.Medal.String(), s.User.String(), s.Price, s.Message)
	}
	return fmt.Sprintf("%s\t\t\t\t%f\n%s", s.User.String(), s.Price, s.Message)
}

type User struct {
	Name string `json:"name"`
}

func (u *User) String() string {
	return u.Name
}

type Medal struct {
	Level int    `json:"level"`
	Name  string `json:"name"`
	Color string `json:"color"`
}

func (m *Medal) String() string {
	return fmt.Sprintf("%s%d", m.Name, m.Level)
}
