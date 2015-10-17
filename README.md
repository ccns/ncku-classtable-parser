# 成大課表爬蟲

爬成大選課系統的課表。

[NCKU Class Table Parser](https://ncku-classtable-parser.herokuapp.com)

## API
```
POST /
```
#### Params
```
stu_no: 學號
passwd: 成功入口密碼(hashed by sha1)
```
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
