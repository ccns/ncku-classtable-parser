# 成大課表爬蟲

爬成大選課系統的課表。

[NCKU select course helper](https://ncku-select-course-helper.herokuapp.com)

## APIs
#### Params
```
stu_no: 學號
passwd: 成功入口密碼(hashed by sha1)
```
#### Return
```
Success: Student schedule in JSON form
Failed: err/帳號密碼錯誤
```

## Dependencies
* Node.js
* npm
    * cheerio
    * cookie
    * iconv-lite
    * request
