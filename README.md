# [109-2] Web Programming Final
#### (Group 16) Epistemology+
R09921099 蔡冠偉
R08921040 徐均筑
R08942087 吳彬睿

## Setup 
#### frontend
* Install required modules for frontend service

    ```cmd
    cd frontend
    yarn
    ```
#### backend
* Put your *.env* file in the directory *backend/* 

    ```node
    //.env
    MONGO_URL=
    ```
* Install required modules for backend service

    ```cmd
    cd backend
    yarn
    ```
## How to use
1. Run your server at port 4000
    ```cmd
    yarn server
    ```
2. Run your frontend at port 3000
    ```cmd
    yarn start
    ```
## Introduction
2021/5/4，yahoo!關閉了Yahoo奇摩知識+。同年6月，再度傳出stackoverflow被收購的消息，這些消息令我們感到非常悲慟。因此想藉由此次的期末專題報告來做一個類似的發問求知論壇。

## Demo Video
https://www.youtube.com/

## Deploy
https://epistemologyplus.com

## Features
### 服務內容

### Home
![](https://i.imgur.com/g0uyHWn.png)
1. LOGO: 我們自己設計的
2. Sign Up: 使用前請先註冊，以獲得更好的體驗。點下後會跳轉到註冊畫面
3. Login: 登入，點下後會跳轉到登入畫面
4. Epistemology+: 網站名稱，點下後會回到首頁
5. Ask: 發問按鈕，點下後跳轉到發文頁面
6. Search: 搜尋，輸入關鍵字後按搜尋會找到title中包含關鍵字的文章
7. 快捷區，列出了前五熱門文章跟前五獎勵文章
8. 統計了總共獲得了多少讚
9. 文章區，依照時間排序，預設一頁是10篇文章

### 發問頁面
![](https://i.imgur.com/98c2lkJ.png)
1. 設定此篇文章要給予最佳回答多少獎勵，不能超出你的財產
2. 寫好文章
3. 按下Submit送出，會自動跳轉到此文章頁面

### 文章頁面
![](https://i.imgur.com/2HrYofD.png)
1. 包含文章內容與文章資訊
2. 可以給予此文章comment
3. 可以使用Answer功能回復文章
4. 可以對Answer點讚


## 使用與參考之框架/模組/原始碼
> Frontend: react, antd, fontawesome, react-router-dom, apollo-client
> Backend: graphql, apollo-server, jsonwebtoken, bcrypt, nodemon, dotenv-defaults, mongoose
> Other resources: AWS EC2, Nginx, SSL for free

## 專題製作心得
#### 蔡冠偉
#### 徐均筑
#### 吳彬睿
