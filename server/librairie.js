const sql = require("./sql"); //connection database
const htmlspecialchars = require('htmlspecialchars'); //htmlspecialchars
const RIPEMD160 = require('ripemd160'); //hash ripemd160
const fs = require("fs");
const fileExists = require('file-exists');
const path = require("path");
const jwt = require("jsonwebtoken");

const sel = "vive le projet tweet_academy";
const regMail = /^(([^<>()\[\]\\.,;:\s@"]+(\.[^<>()\[\]\\.,;:\s@"]+)*)|(".+"))@((\[[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}\.[0-9]{1,3}])|(([a-zA-Z\-0-9]+\.)+[a-zA-Z]{2,}))$/;
const regPhone = /^[0-9]{8,}$/;

let librairie = {

    verifRegister: function (body, response) {
        let register = body;
        register.user = htmlspecialchars(register.user);
        register.pass = new RIPEMD160().update(register.pass + sel).digest("hex");
        register.passConf = new RIPEMD160().update(register.passConf + sel).digest("hex");
        if (!register.mail.match(regMail) || register.user.length < 6 || Date.now() - Date.parse(register.date) < (60 * 60 * 24 * 365.25 * 18 * 1000) || register.pass !== register.passConf || body.pass.length < 8 || !body.phone.match(regPhone))
            response.json("Relisez vous.");
        else {
            if (this.verifMail(register, response))
                return true;
            else return false;
        }
    },

    verifMail: function (body, response) {
        sql.query("SELECT COUNT(email) AS 'number', COUNT(username) AS 'user', COUNT(tel) AS 'phone' FROM user WHERE disabled=0 AND (email LIKE ? OR username LIKE ? OR tel LIKE ?)", [body.mail, body.user, body.phone], (err, data) => {
            if (data[0].number === 0 && data[0].user === 0 && data[0].phone === 0) {
                this.pushRegister(body);
                response.json("success");
                return true;
            } else {
                response.json("Username/Mail/Phone deja utilise!");
                return false;
            }
        })
    },

    pushRegister: function (body) {
        sql.query("INSERT INTO user(id, username, fullname, bio, tel, birthday, registerDate, location, pinned_tweet, verified, banner_img, profil_img, email, pwd, disabled, token)" +
            " VALUES (NULL, ?, '', '', ?, ?, CURDATE(), '', 0, 0, 'wall', 'user', ?, ?, 0, '');", [body.user, body.phone, body.date, body.mail, body.pass], (err, data) => {
            if (err) throw err;
        });
        return true;
    },

    verifImage: function (request, response) {
        const tempPath = request.file.path;
        const targetPath = "server/images/";
        const imageTypes = ["image/gif", "image/png", "image/jpeg", "image/bmp", "image/webp"];

        console.log(request.body)
        if (imageTypes.includes(request.file.mimetype)) {
            const id = jwt.verify(request.body.cookie, sel).id;
            const time = Date.now();
            fs.rename(tempPath, targetPath + time + path.extname(request.file.originalname).toLowerCase(), err => {
                if (err) throw err;
                else if (request.body.type === "profil") {
                    sql.query("UPDATE user SET profil_img = ? WHERE id = ?", [time, id], (err, data) => {
                        if (err) throw err;
                        response.json("Profile image uploaded!");
                    })
                } else if (request.body.type === "banner") {
                    sql.query("UPDATE user SET banner_img = ? WHERE id = ?", [time, id], (err, data) => {
                        if (err) throw err;
                        response.json("Banner uploaded!");
                    })
                } else response.json("Banner uploaded!");
            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) throw err;
                response.json("Only images files are allowed!");
            });
        }
    },

    pathImage: function (request, response) {
        const imageType = [".png", ".jpg", ".gif", ".webp", ".tiff", ".psd", ".jpeg", ".bmp", ".raw", ".heif"];
        const chemin = request.originalUrl.split("/")[2];
        for (let i = 0; i < imageType.length; i++) {
            fileExists(path.join(__dirname, "./images/" + chemin + imageType[i]), (err, exists) => {
                if (exists === true)
                    response.sendFile(path.join(__dirname, "./images/" + chemin + imageType[i]));
            });
        }
    },

    verifLogin: function (body, response) {
        let login = body;
        login.password = new RIPEMD160().update(login.password + sel).digest("hex");
        if (login.username.length < 6 && login.password.length < 8) {
            return false;
        } else {
            if (this.pull(login, response))
                return true;
            return false;
        }
    },

    createToken: function (id, response) {
        const token = jwt.sign({
            id: id
        }, sel, {expiresIn: "24h"});
        response.json(token);
    },

    verifToken: function (cookie) {
        if (jwt.verify(cookie, sel).id !== undefined || jwt.verify(cookie, sel).id === "") {
            return true;
        } else return false;
    },

    verifTweet: function (request, response) {
        let body = JSON.parse(request.body.body);
        console.log(body)
        if (this.verifToken(body.cookie)) {
            const id = jwt.verify(body.cookie, sel).id;
            if (body.tweet.length < 141 && body.tweet !== '') {
                body.tweet = htmlspecialchars(body.tweet);
                if(body.type === "tweet") {
                    sql.query("INSERT INTO tweet(id, user_id, content, origin_id, geolocation, date, is_disabled) VALUES(NULL,?,?,NULL,NULL, NOW(), 0)",
                        [id, body.tweet], (err, data) => {
                            if (err) throw err;
                            else response.json("success");
                        });
                }
                else if(body.type === "image")
                    this.tweetImage(request, response, body, id);
                console.log(body);
            } else {
                console.log("More than 140 || empty");
                response.json("error");
            }
        } else response.json("error");
    },

    tweetImage: function(request, response, body, id){
        const tempPath = request.file.path;
        const targetPath = "server/images/";
        const imageTypes = ["image/gif", "image/png", "image/jpeg", "image/bmp", "image/webp"];
        const time = Date.now();

        if (imageTypes.includes(request.file.mimetype)) {
            fs.rename(tempPath, targetPath + time + path.extname(request.file.originalname).toLowerCase(), err => {
                if (err) throw err;
                sql.query("INSERT INTO tweet(id, user_id, content, origin_id, geolocation, date, is_disabled) VALUES(NULL,?,?,NULL,NULL, NOW(), 0)",
                    [id, body.tweet], (err, data) => {
                        if (err) throw err;
                       sql.query("SELECT id FROM tweet WHERE user_id=? ORDER BY id DESC", [id], (err, data) => {
                           if (err) throw err;
                           sql.query("INSERT INTO media(id, type, tweet_id, paths) VALUES (NULL,?,?,?)", ["image", data[0].id, time], (err, data) => {
                               if (err) throw err;
                               response.json("success")
                           })
                        });
                    });
            });
        } else {
            fs.unlink(tempPath, err => {
                if (err) throw err;
                response.json("Only images files are allowed!");
            });
        }
    },

    pull: function (body, response) {
        sql.query("SELECT id AS 'id',  pwd AS 'user_pass' FROM user WHERE disabled=0 AND (username=? OR tel=? OR email=?)", [body.username, body.username, body.username], (err, data) => {
            if (err) throw err;
            if (data[0] === undefined) response.json("aucun username/email ou telephone de trouver");
            else if (data[0].user_pass === body.password) {
                this.createToken(data[0].id, response);
                return true;
            } else response.json("Wrong password");
        });
    },

    getInfo: function (request, response) {
        const id = jwt.verify(request.body.cookie, sel).id;
        console.log(request.body);
        if(request.body.id === undefined || request.body.id === null) {
            sql.query("SELECT id, username, fullname, bio, tel, birthday, registerDate, location, pinned_tweet, verified, CONCAT(?,banner_img) AS 'banner_img', CONCAT(?,profil_img) AS 'profil_img' FROM user WHERE id=?", ["http://localhost:8080/image/" ,"http://localhost:8080/image/", id], (err, data) => {
                if (err) throw err;
                let tab = {
                    id: id,
                    info: data[0]
                };
                sql.query("SELECT COUNT(subscriber_id) AS 'nbr_follow' FROM follow LEFT OUTER JOIN user u on follow.subscribed_id = u.id WHERE subscriber_id=? AND disabled=0", [id], (err, data) => {
                    if (err) throw err;
                    tab.follow = data[0];
                    sql.query("SELECT COUNT(subscribed_id) AS 'nbr_abo' FROM follow LEFT OUTER JOIN user u on follow.subscriber_id = u.id WHERE subscribed_id=? AND disabled=0", [id], (err, data) => {
                        if (err) throw err;
                        tab.abo = data[0];
                        response.json(tab);
                    });
                });
            })
        }
        else {
            console.log("test");
            sql.query("SELECT id, username, fullname, bio, tel, birthday, registerDate, location, pinned_tweet, verified, CONCAT(?,banner_img) AS 'banner_img', CONCAT(?,profil_img) AS 'profil_img' FROM user WHERE username=?", ["http://localhost:8080/image/", "http://localhost:8080/image/", request.body.id], (err, data) => {
                if (err) throw err;
                let tab = {
                    id: id,
                    info: data[0]
                };
                sql.query("SELECT COUNT(subscriber_id) AS 'nbr_follow' FROM follow WHERE subscriber_id=?", [request.body.id], (err, data) => {
                    if (err) throw err;
                    tab.follow = data[0];
                    sql.query("SELECT COUNT(subscribed_id) AS 'nbr_abo' FROM follow WHERE subscribed_id=?", [request.body.id], (err, data) => {
                        if (err) throw err;
                        tab.abo = data[0];
                        response.json(tab);
                    });
                });
            })
        }
    },

    setTweetFormat: function (tweet) {
        let traitement = tweet.split(" ");
        for (i in traitement) {
            if (traitement[i].charAt(0) === "#") {
                traitement[i] = "<a class='text-twitter-5' style='cursor: pointer'>" + traitement[i] + "</a>";
            }
            else if (traitement[i].charAt(0) === "@") {
                traitement[i] = "<a class='text-twitter-5 search' style='cursor: pointer'>" + traitement[i] + "</a>";
            }
        }
        traitement = traitement.join(" ");
        return traitement;
    },

    getWallTweet: function (request, response) {
        let body = request.body;
        console.log(body);
        if (this.verifToken(request.body.cookie)) {
            if (body.id === undefined) {
                const id = jwt.verify(request.body.cookie, sel).id;
                sql.query("SELECT user.id AS 'user_id', content, username, tweet.date, fullname, CONCAT(?,profil_img) AS 'profil_img', tweet.id, CONCAT(?,paths) AS 'paths', type, COUNT(likes.id) AS 'likes', COUNT(r.id) AS 'retweet' FROM tweet LEFT OUTER JOIN user ON tweet.user_id = user.id LEFT OUTER JOIN media ON tweet.id = media.tweet_id LEFT OUTER JOIN likes ON likes.tweet_id=tweet.id LEFT OUTER JOIN retweet r on tweet.id = r.tweet_id WHERE tweet.user_id=? AND tweet.is_disabled=0 GROUP BY content, username, tweet.date, fullname, profil_img, tweet.id, paths, type ORDER BY tweet.id DESC", ["http://localhost:8080/image/", "http://localhost:8080/image/", id], (err, data) => {
                    if (err) throw err;
                    console.table(data);
                    //data.map(x => x.content = this.setTweetFormat(x.content));
                    response.json(data);
                });
            }
            else {
                sql.query("SELECT user.id AS 'user_id', content, username, tweet.date, fullname, CONCAT(?,profil_img) AS 'profil_img', tweet.id, paths, type, COUNT(likes.id) AS 'likes', COUNT(r.id) AS 'retweet' FROM tweet LEFT OUTER JOIN user ON tweet.user_id = user.id LEFT OUTER JOIN media ON tweet.id = media.tweet_id LEFT OUTER JOIN likes ON likes.tweet_id=tweet.id LEFT OUTER JOIN retweet r on tweet.id = r.tweet_id WHERE user.username=? AND tweet.is_disabled=0 GROUP BY content, username, tweet.date, fullname, profil_img, tweet.id, paths, user_id, type ORDER BY tweet.id DESC", ["http://localhost:8080/image/", body.id], (err, data) => {
                    if (err) throw err;
                    console.table(data);
                    //data.map(x => x.content = this.setTweetFormat(x.content));
                    response.json(data);
                });
            }

        }
    },

    getSearchTweet: function(request, response) {
        console.log(request.body.search);
        if(request.body.search.charAt(0) === '@') {
            const username = request.body.search.substr(1, request.body.search.length);
            console.log(username);
            sql.query("SELECT user.id AS 'id_u', username, CONCAT(?,profil_img) AS 'img' FROM  user WHERE username LIKE ?", ["http://localhost:8080/image/", username + "%"], (err, data) => {
                if (err) throw err;

                console.table(data);
                response.json(data);
            })
        }
        else {
            sql.query("SELECT user.id AS 'user_id', content, username, tweet.date, fullname, CONCAT(?,profil_img) AS 'profil_img', tweet.id, paths, type, COUNT(likes.id) AS 'likes', COUNT(r.id) AS 'retweet' FROM tweet LEFT OUTER JOIN user ON tweet.user_id = user.id LEFT OUTER JOIN media ON tweet.id = media.tweet_id LEFT OUTER JOIN likes ON likes.tweet_id=tweet.id LEFT OUTER JOIN retweet r on tweet.id = r.tweet_id WHERE tweet.content LIKE ? AND tweet.is_disabled=0 GROUP BY content, username, tweet.date, fullname, profil_img, tweet.id, paths, user_id, type ORDER BY tweet.id DESC",
                ["http://localhost:8080/image/", "%" + request.body.searchBar + "%"], (err, data) => {
                if (err) throw err;
                console.log(data);
                console.log("ici negro");

                if (data.length === 0) {
                    response.json("fail");
                } else {
                    //data.map(x => x.content = this.setTweetFormat(x.content));

                    response.json(data);
                }
            });
        }
    },

    deleteTweet: function (request, response) {
        console.log(request.body);
        if (this.verifToken(request.body.cookie)) {
            const id_user = jwt.verify(request.body.cookie, sel).id;
            sql.query("UPDATE tweet SET is_disabled=1 WHERE id = ? OR origin_id = ? AND user_id = ?", [request.body.id, request.body.id, id_user], (err, data) => {
                if (err) throw err;
                else response.json("Tweet successfully dissabled");
            });
        }
    },

    likeTweet: function (request, response){
        console.log(request.body);
        if (this.verifToken(request.body.cookie)) {
            const id_user = jwt.verify(request.body.cookie, sel).id;
            sql.query("SELECT COUNT(id) AS 'verif' FROM likes WHERE user_id=? AND tweet_id=?", [id_user, request.body.id], (err, data) => {
               if (err) throw err;
               if (data[0].verif === 0){
                   sql.query("INSERT INTO likes(id, user_id, tweet_id, date) VALUES(NULL, ?, ?, CURDATE())", [id_user, request.body.id], (err, data) => {
                       if (err) throw err;
                       response.json("Liked");
                   });
               }
               else sql.query("DELETE FROM likes WHERE user_id=? AND tweet_id=?", [id_user, request.body.id], (err, data) => {
                   if (err) throw err;
                   response.json("Unliked");
               });
            });
        }
    },

    reTweet: function (request, response){
        console.log(request.body);
        if (this.verifToken(request.body.cookie)) {
            const id_user = jwt.verify(request.body.cookie, sel).id;
            sql.query("SELECT COUNT(id) AS 'verif' FROM retweet WHERE user_id=? AND tweet_id=?", [id_user, request.body.id], (err, data) => {
                if (err) throw err;
                if (data[0].verif === 0){
                    sql.query("INSERT INTO retweet(id, user_id, tweet_id) VALUES(NULL, ?, ?)", [id_user, request.body.id], (err, data) => {
                        if (err) throw err;
                        sql.query("SELECT content, geolocation, tweet.id, type, paths FROM tweet LEFT JOIN media m on tweet.id = m.tweet_id WHERE tweet.id=?", [request.body.id], (err, data) => {
                            if (err) throw err;
                            const tmp ={
                              type: data[0].type,
                              paths: data[0].paths
                            };
                            console.log(tmp);
                            sql.query("INSERT INTO tweet(id, user_id, content, origin_id, geolocation, date, is_disabled) VALUES(NULL,?,?,?,?,CURDATE(),0)",
                                [id_user, data[0].content, data[0].id, data[0].geolocation], (err, data) => {
                               if (err) throw err;
                               if (tmp.paths !== null && tmp.type !== null) {
                                   sql.query("SELECT id FROM tweet WHERE user_id=? ORDER BY id DESC LIMIT 1", [id_user], (err, data) => {
                                       if (err) throw err;
                                       sql.query("INSERT INTO media(id, type, paths, tweet_id) VALUES (NULL, ?, ?, ?)", [tmp.type, tmp.paths, data[0].id], (err, data) => {
                                           if (err) throw err;
                                           response.json("Retweet");
                                       });
                                   });
                               }
                            });
                        });
                    });
                }
                else response.json("Already retweet");
            });
        }
    },

    deleteAccount: function (request, response) {
        console.log(request.body);
        if (this.verifToken(request.body.cookie)) {
            const id_user = jwt.verify(request.body.cookie, sel).id;
            sql.query("UPDATE user LEFT OUTER JOIN tweet ON user.id = tweet.user_id SET user.disabled=1, tweet.is_disabled=1 WHERE user.id = ?", [id_user], (err, data) => {
                if (err) throw err;
                else response.json("success");
            });
        }
    },

    verifModify: function (body) {
        if (body.pwd !== body.pwdConf) return false;
        else if (body.email !== "" && !body.email.match(regMail)) {
            console.log("2")
            return false;
        } else if (body.tel !== "" && !body.tel.match(regPhone)) return false;
        else if (body.bio !== "" && body.bio.length < 10) return false;
        else if (body.location !== "" && body.location.length < 4) return false;
        else if (body.fullname !== "" && body.fullname.length < 4) return false;
        else if (body.username !== "" && body.username.length < 6) return false;
        else if (body.pwd !== "" && body.pwd.length < 8) return false;
        else return true;
    },

    verifArguments: function (request, response) {
        let verif = {
            mail: request.body.email,
            phone: request.body.tel,
            user: request.body.username
        };
        if (request.body.email === "")
            verif.mail = "paella";
        if (request.body.username === "")
            verif.user = "pae";
        if (request.body.tel === "")
            verif.phone = "paella";
        sql.query("SELECT COUNT(email) AS 'number', COUNT(username) AS 'user', COUNT(tel) AS 'phone' FROM user WHERE disabled=0 AND email LIKE ? OR username LIKE ? OR tel LIKE ?", [verif.mail, verif.user, verif.phone], (err, data) => {
            if (data[0].number === 0 && data[0].user === 0 && data[0].phone === 0) {
                this.modifyAccount(request, response);
            } else response.json("Username / Mail or Tel already use");
        });
    },

    modifyAccount: function (request, response) {
        const body = {
            cookie: request.body.cookie,
            username: htmlspecialchars(request.body.username),
            fullname: htmlspecialchars(request.body.fullname),
            bio: htmlspecialchars(request.body.bio),
            location: htmlspecialchars(request.body.location),
            email: htmlspecialchars(request.body.email),
            birthday: htmlspecialchars(request.body.birthday),
            tel: htmlspecialchars(request.body.tel)
        };
        console.log(body);
        if (this.verifToken(request.body.cookie) && this.verifModify(request.body)) {
            let sqlRequest = "UPDATE user SET ";
            let arguments = [];
            let traitement = Object.entries(body).filter(x => x[1] !== "");
            for (i in traitement) {
                if (traitement[i][0] !== "cookie") {
                    sqlRequest += traitement[i][0] + "=?, ";
                    arguments.push(traitement[i][1]);
                }
            }
            arguments.push(jwt.verify(request.body.cookie, sel).id);
            sqlRequest = sqlRequest.substr(0, sqlRequest.length - 2) + " WHERE id=?";
            sql.query(sqlRequest, arguments, (err, data) => {
                if (err) throw err;
                else response.json("success");

            });
        } else response.json("error");
    },

    getConv: function(request, response){
      console.log(request.body);
        if(this.verifToken(request.body.cookie)){
            const id_user = jwt.verify(request.body.cookie, sel).id;
            sql.query("SELECT CONCAT(?,profil_img) AS 'profil_img', fullname, username, user.id as 'id' FROM user LEFT OUTER JOIN chat ON user.id = chat.receiver_id WHERE sender_id=? GROUP BY fullname, profil_img, username, user.id;", ["http://localhost:8080/image/", id_user], (err, data) => {
                if (err) throw err;
                response.json(data);
            });
        }
        else response.json("error");
    },

    getMessage: function (request, response){
        console.log(request.body);
        if(this.verifToken(request.body.cookie)){
            const id_user = jwt.verify(request.body.cookie, sel).id;
            sql.query("SELECT sender_id, receiver_id, content, chat.date AS 'date', CONCAT(?,profil_img) AS 'profil_img' FROM chat LEFT OUTER JOIN user ON chat.sender_id = user.id WHERE sender_id IN(?,?) AND receiver_id IN(?,?) ORDER BY date ASC", ["http://localhost:8080/image/", id_user, request.body.id, id_user, request.body.id], (err, data) => {
               if (err) throw err;
               response.json(data);
            });
        }
        else response.json("error");
    },

    sendMessage: function (request, response) {
        console.log(request.body);
        if (this.verifToken(request.body.cookie)){
            const content = htmlspecialchars(request.body.content);
            const id_user = jwt.verify(request.body.cookie, sel).id;
            sql.query("INSERT INTO chat(id, content, date, media, sender_id, receiver_id) VALUES(NULL, ?, NOW(), 0, ?, ?)", [content, id_user, request.body.id_receiver], (err, data) => {
               if (err) throw err;
               response.json("success");
            });

        }
    },

    follow: function (request, response) {
        if(this.verifToken(request.body.cookie)){
            const id_user = jwt.verify(request.body.cookie, sel).id;
            sql.query("SELECT COUNT(id) AS 'verif' FROM follow WHERE subscribed_id=? AND subscriber_id=?", [id_user, request.body.id], (err, data) => {
                if (err) throw err;
                if(parseInt(data[0].verif) === 0){
                    sql.query("INSERT into follow(id, date, subscriber_id, subscribed_id) VALUES(NULL, NOW(), ?,?)", [request.body.id, id_user], (err, data) => {
                        if (err) throw err;
                        response.json("Followed")
                    });
                }
                else{
                    sql.query("DELETE FROM follow WHERE subscriber_id=? AND subscribed_id=?", [request.body.id, id_user], (err, data) => {
                        if (err) throw err;
                        response.json("Unfollowed")
                    });
                }
            });
        }
    },

    getFollow: function (request, response){
        if (this.verifToken(request.body.cookie)){
            const id_user = jwt.verify(request.body.cookie, sel).id;
            sql.query("SELECT username, fullname, CONCAT(?,profil_img) AS 'profil_img' FROM user LEFT OUTER JOIN follow f on user.id = f.subscribed_id WHERE subscriber_id=? AND disabled=0;", ["http://localhost:8080/image/", id_user], (err, data) => {
                if (err) throw err;
                response.json(data);
            })
        }
    },

    getFollowing: function (request, response){
        if (this.verifToken(request.body.cookie)){
            const id_user = jwt.verify(request.body.cookie, sel).id;
            sql.query("SELECT username, fullname, CONCAT(?,profil_img) AS 'profil_img' FROM user LEFT OUTER JOIN follow f on user.id = f.subscriber_id WHERE subscribed_id=? AND disabled=0;", ["http://localhost:8080/image/", id_user], (err, data) => {
                if (err) throw err;
                response.json(data);
            })
        }
    },

    contact: function (request, response) {
        console.log(request.body);
        if (this.verifToken(request.body.cookie)){
            const id_user = jwt.verify(request.body.cookie, sel).id;
            sql.query("SELECT COUNT(id) AS 'verif' FROM chat WHERE receiver_id IN(?,?) AND sender_id IN (?,?)", [id_user, request.body.id, id_user, request.body.id], (err, data) => {
                if(data[0].verif === 0) {
                    const content = "Hi";
                    sql.query("INSERT INTO chat(id, content, date, media, sender_id, receiver_id) VALUES(NULL, ?, NOW(), 0, ?, ?)", [content, id_user, request.body.id], (err, data) => {
                        if (err) throw err;
                        const content = "Don't speak to strange users!";
                        sql.query("INSERT INTO chat(id, content, date, media, sender_id, receiver_id) VALUES(NULL, ?, NOW(), 0, ?, ?)", [content, request.body.id, id_user], (err, data) => {
                            if (err) throw err;
                            response.json("success");
                        });
                    });
                }
                else response.json("Already contacted");
            });
        }
    }
};

module.exports = librairie;