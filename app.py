#!/usr/local/bin/python

from flask import Flask, render_template, request, jsonify
import json
import pymysql
pymysql.install_as_MySQLdb()
import MySQLdb.cursors

app = Flask(__name__, static_url_path='')
#app.debug = True

movies = []

@app.route('/')
def index(name=None):
    return render_template('index.html', name=name)

# # Get
# @app.route("/movies", methods=["GET"])
# def getMovies(name=None):
#     json_string = json.dumps(movies)
#     return "successfully got a list of movies: \n" + json_string

# # Post
# @app.route("/movies", methods=["POST"])
# def postMovies(name=None):
#     movies.extend(["Shrek", "Shrek 2", "Shrek 4", "The Lord of the Rings", "Shawshank Redemption", "Star Wars Episode 3", "Fight Club"])
#     return "successfully created a list of movies"

# # Put
# @app.route('/movies', methods=["PUT"])
# def putMovies(name=None):
#     movies.append("Shrek 3")
#     return "successfully added a movie (Shrek 3) to the list"

# # # Delete
# @app.route('/movies', methods=["DELETE"])
# def deleteMovies(name=None):
#     movies.clear()
#     return "successfully deleted the list of movies"

def getDB():
    db = MySQLdb.connect(
            host="dursley.socs.uoguelph.ca", 
            user="hohenade", 
            passwd="1006930",
            db="hohenade")
    return db

# Create Table
@app.route("/initTable", methods=["GET"])
def initTable(name=None):
    db = getDB() 

    cursor = db.cursor()

    myQuery = "CREATE TABLE IF NOT EXISTS USERS ("
    myQuery += "username VARCHAR(60) NOT NULL,"
    myQuery += "password VARCHAR(60) NOT NULL)"
    
    cursor.execute(myQuery)
    db.commit()
    db.close()

    return jsonify({"result": "success"})

# Get user
@app.route("/users", methods=["GET"])
def getUser():
    print("GETTING USER" + "\n")
    username = request.args.get('username')
    password = request.args.get('password')
    
    try:
        db = getDB() 
        
        cursor = db.cursor()

        cursor.execute("SELECT * FROM USERS where username = \" %s \" AND password=\" %s \";", (username, password))

        myresult = cursor.fetchone()

        db.close()

        if myresult is None:
            return jsonify({'user': username + " not found", 'password': "IDK"})

        return jsonify({'user': username, 'password': password})
    except:
        return jsonify({'result':'error ' + sys.exc_info()[0] + " occured"})

# Update user
@app.route("/users", methods=["PUT"])
def updateUser():
    print("UPDATING USER")
    username = request.form['username']
    password = request.form['password']
    
    try:
        db = getDB()
        
        cursor = db.cursor()

        myQuery = "UPDATE USERS "
        myQuery += "SET username=\" %s \", password=\" %s \" "
        myQuery += "WHERE username=\" %s \";"

        print(myQuery)

        cursor.execute(myQuery, (username, password, username))
        
        cursor.execute("SELECT * FROM USERS where username = \" %s \" AND password=\" %s \";", (username, password))

        myresult = cursor.fetchone()

        if myresult is None:
            db.close()
            return jsonify({'user': username, 'new_password': "could not be updated"})

        db.commit()
        db.close()
        return jsonify({'user': username, 'new_password': password})

    except:
        return jsonify({'result':'error ' + sys.exc_info()[0] + " occured"})

# Delete user
@app.route("/users", methods=["DELETE"])
def deleteUser():
    print("DELETING USER")
    username = request.form['username']
    password = request.form['password']
    
    try:
        db = getDB() 
    
        cursor = db.cursor()

        cursor.execute("DELETE FROM USERS where username = \" %s \" AND password=\" %s \";", (username, password))
        cursor.execute("SELECT * FROM USERS where username = \" %s \" AND password=\" %s \";", (username, password))

        myresult = cursor.fetchone()

        if myresult is not None:
            db.close()
            return jsonify({'result':'user' + username + ' could not be deleted from the database'})

        db.commit()
        db.close()
        return jsonify({'result':'user ' + username + ' was successfully deleted'})
    except:
        return jsonify({'result':'error ' + sys.exc_info()[0] + " occured"})

# Login
@app.route("/users", methods=["POST"])
def login():
    print("LOGGING IN")
    username = request.form['username']
    password = request.form['password']
    
    try:
        db = getDB() 
        
        cursor = db.cursor()

        cursor.execute("SELECT * FROM USERS where username = \" %s \" AND password=\" %s \";", (username, password))

        myresult = cursor.fetchone()

        if myresult is not None:
            db.close()
            return jsonify({'result':'user ' + username + ' already in the database'})
        
        myQuery = "insert into USERS values (\" %s \"," + "\" %s \")"
        cursor.execute(myQuery, (username, password))
        
        db.commit()
        db.close()

        return jsonify({'result':'added user ' + username + ' to database'})
    except:
        return jsonify({'result':'error ' + sys.exc_info()[0] + " occured"})
