# 成大課表爬蟲

爬成大選課系統的課表。

[NCKU Class Table Parser](https://ncku-classtable-parser.herokuapp.com)

**警告** 目前這隻程式經過http登入，所以可能會有安全性問題，若對帳號安全有疑慮請勿使用。

## API
```
POST /
```
#### Params
```
stu_no: 學號
passwd: 成功入口密碼(hashed by sha1)
```
僅供爬資料使用，伺服器不會記錄任何登入資訊
#### Return
```
Success: Student schedule in JSON form
Err: 帳號密碼錯誤
```

## Dependencies
* Node.js
* npm
    * cheerio
    * cookie
    * iconv-lite
    * request

## TOTO
- [ ] 改成https
