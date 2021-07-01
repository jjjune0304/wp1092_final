# [109-2] Web Programming Final
#### (Group 16) <img src="https://i.imgur.com/PYUCCUL.png" width="32" height="32"> Epistemology+ 

## Team Members
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
## How to use (Local)
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

我們的論壇叫 epistemologyplus，這個名字取自哲學中的 epistemology，而這個詞由希臘語中的 "episteme" 及 "logos" 所衍生，前者有 "knowledge" 或 "understanding" 的意涵，後者則可理解為 "reason"。

而我們論壇是希望能成為幫助使用者學習新知的工具(epistemology)，並且永遠不會滿足於目前的境界(plus)，綜合以上我們賦予 epistemologyplus 這個名字。

## 服務內容
一個永無止境的求知求解論壇。

## Demo Video
https://youtu.be/5HGnMPsLnXs

## Deployment
https://epistemologyplus.com

## Features

### Home Page
<img src="https://i.imgur.com/WCUh6nA.png" width="650" height="auto">

1. LOGO: 我們自己設計的
2. Epistemology+:網站名稱，點下後會回到首頁
3. Ask: 發問按鈕，點下後跳轉到發文頁面
4. Search: 搜尋，輸入關鍵字後按搜尋會找到title中包含關鍵字的文章
5. Login: 登入，點下後會跳轉到登入畫面 (回答、評論、按讚皆需要登入)
6. Sign Up: 註冊，點下後會跳轉到註冊畫面
7. 快捷區: 列出了前五熱門文章(觀看次數)跟前五獎勵文章(reward最多)
8. 統計: 即時更新使用者獲得多少讚(僅限登入)
9. 文章: 依照時間排序，預設一頁是10篇文章
10. 預覽： 可預覽前兩則回答內容

### Ask Page
<img src="https://i.imgur.com/3fdKSdD.png" width="650" height="auto">

1. 設定此篇文章要給予最佳回答多少獎勵，不能超出你的財產
2. 寫好文章
3. 一鍵刪除
4. 按下Submit送出，會自動跳轉到此文章頁面

### Question Page
<img src="https://i.imgur.com/dBeNTjm.png" width="650" height="auto">

1. 包含文章內容與文章資訊
2. 以下操作僅限登入的使用者:
    * 針對問題進行回答 (answer)
    * 對問題或回答進行評論 (comment)
    * 對回答點讚 (like)

## 使用與參考之框架/模組/原始碼
> **Frontend**: react, antd, fontawesome, braft-editor, react-router-dom, graphql, apollo-client
> 
> **Backend**: graphql, apollo-server, jsonwebtoken, bcrypt, nodemon, dotenv, mongoose
> 
> **Database**: MongoDB
> 
> **Deployment**: AWS EC2, Nginx, SSL for free

## 每位組員之負責項目
* 蔡冠偉
    * Frontend
    * 錄影片
* 吳彬睿
    * Frontend
    * 買零食、泡茶。
* 徐均筑
    * Backend (graphql api, mongoose, authentication)
    * AWS Deployment

## 專題製作心得
#### 蔡冠偉
這一次的專題需要從零開始寫出前端與後端，之後還要串聯資料庫並部屬到雲端上面讓大家使用，完成這次的專題後我認為學習到非常多東西。也非常謝謝兩位隊友，大家一起努力才能順利完成這個網站。

#### 吳彬睿
我覺得這次專題很不錯，做出一個還能看的成品。從前端、後端到後面架上雲端，成為一個真正的服務，在這之中受益良多，感謝隊友們的同心協力，讓我們有這個成果。

#### 徐均筑
這次的期末專題做得比想像中快，但蠻可惜期末太多事情所以有些功能還來不及實現。另外第一次用 AWS 進行部署，比想像中來的簡單，不過還是因為 websocket 的原因卡了好久，幸好最後有解決掉。最最最後感謝兩位組員不辭辛勞地完成前端，多虧了他們的努力才有這麼好看的介面。 🙌🙏🤘
