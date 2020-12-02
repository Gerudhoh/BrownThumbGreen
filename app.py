#!/usr/local/bin/python

from flask import Flask, render_template, request, jsonify, session, redirect, url_for
import json
import sys
import traceback
import MySQLdb
import MySQLdb.cursors
import requests

token = "REDACTED"

app = Flask(__name__, static_url_path='')
app.config.update(
    DEBUG=True,
    SECRET_KEY=REDACTED,
    TEMPLATE_AUTO_RELOAD=True
)

@app.route('/')
def index(name=None):
    # session['username'] = "username"
    # session['logged_in'] = False
    # session['userID'] = 1
    if 'username' in session:
        return render_template('index.html', name=name)
    return render_template('index.html', name=name)

def getDB():
    db = MySQLdb.connect(
            host="dursley.socs.uoguelph.ca", 
            user="hohenade", 
            passwd="REDACTED",
            db="hohenade")
    return db

# Create Table
@app.route("/initTables", methods=["GET"])
def initTable(name=None):
    db = getDB() 

    cursor = db.cursor()

    userTable = "CREATE TABLE IF NOT EXISTS USERS ("
    userTable += "user_id INT AUTO_INCREMENT PRIMARY KEY,"
    userTable += "username VARCHAR(60) NOT NULL,"
    userTable += "password VARCHAR(60) NOT NULL)"
    
    cursor.execute(userTable)

    plantTable = "CREATE TABLE IF NOT EXISTS PLANTS ("
    plantTable += "plant_id INT NOT NULL,"
    plantTable += "user_id INT NOT NULL,"
    plantTable += "FOREIGN KEY(user_id) REFERENCES USERS(user_id) ON DELETE CASCADE)"
    
    cursor.execute(plantTable)


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

        cursor.execute("SELECT * FROM USERS where username =  %s  AND password= %s ;", (username, password))

        myresult = cursor.fetchone()

        db.close()

        if myresult is None:
            return jsonify({'user': username + " not found", 'password': "IDK"})

        return jsonify({'user': username, 'password': password})
    except Exception as ex:
        return jsonify({'result':'error ' + str(ex) + " occured"})

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
        myQuery += "SET username= %s , password= %s  "
        myQuery += "WHERE username= %s ;"

        print(myQuery)

        cursor.execute(myQuery, (username, password, username))
        
        cursor.execute("SELECT * FROM USERS where username =  %s  AND password= %s ;", (username, password))

        myresult = cursor.fetchone()

        if myresult is None:
            db.close()
            return jsonify({'user': username, 'new_password': "could not be updated"})

        db.commit()
        db.close()
        return jsonify({'user': username, 'new_password': password})

    except Exception as ex:
        return jsonify({'result':'error ' + str(ex) + " occured"})

# Delete user
@app.route("/users", methods=["DELETE"])
def deleteUser():
    print("DELETING USER")
    username = request.form['username']
    password = request.form['password']
    
    try:
        db = getDB() 
    
        cursor = db.cursor()

        cursor.execute("DELETE FROM USERS where username =  %s  AND password= %s ;", (username, password))
        cursor.execute("SELECT * FROM USERS where username =  %s  AND password= %s ;", (username, password))

        myresult = cursor.fetchone()

        if myresult is not None:
            db.close()
            return jsonify({'result':'user' + username + ' could not be deleted from the database'})

        db.commit()
        db.close()
        return jsonify({'result':'user ' + username + ' was successfully deleted'})
    except Exception as ex:
        return jsonify({'result':'error ' + str(ex) + " occured"})

# Create User
@app.route("/users", methods=["POST"])
def createUser():
    print("Creating User")
    username = request.form['username']
    password = request.form['password']
    
    try:
        db = getDB() 
        
        cursor = db.cursor()

        cursor.execute("SELECT * FROM USERS where username =  %s  AND password= %s ;", (username, password))

        myresult = cursor.fetchone()

        if myresult is not None:
            db.close()
            return jsonify({'result':'user ' + username + ' already in the database'})
        
        myQuery = "insert into USERS values (null,  %s ," + " %s )"
        cursor.execute(myQuery, (username, password))
        
        db.commit()
        db.close()

        return jsonify({'result':'added user ' + username + ' to database'})
    except Exception as ex:
        return jsonify({'result':'error ' + str(ex) + " occured"})

#Search Plant
@app.route("/plantSearch", methods=["POST"])
def plantSearch():
    queryPlant = request.form['queryPlant']
    quantity = request.form['quantity']
    data  = requests.get('https://trefle.io/api/v1/plants/search?token=' + token + '&q=' + queryPlant + '&limit=' + quantity)
    return json.dumps(data.json())

#Save a Plant
@app.route("/savePlant", methods=["POST"])
def savePlant():
    plantId = request.form['plantID']
    userId = str(session['userID'])

    db = getDB()     
    cursor = db.cursor()
    myQuery = "insert into PLANTS values (" + plantId + "," + userId + ")"
    cursor.execute(myQuery)
    db.commit()
    db.close()
    return jsonify({'result':'added plant ' + plantId + ' to database'})

#Load all plants
@app.route("/loadPlants", methods=["POST"])
def loadPlants():
    userId = str(session['userID'])

    db = getDB()     
    cursor = db.cursor()
    cursor.execute("SELECT * FROM PLANTS where user_id = %s ;", (userId))
    plants = cursor.fetchall()
    
    plantJsons = []
    for plant in plants:
        id = plant[0]
        plant  = requests.get('https://trefle.io/api/v1/plants/'+ str(id) + '?token=' + token)
        plantJsons.append(plant.json())
    
    cursor.close()
    return json.dumps(plantJsons)
    

def plantInfo():
    data  = requests.get('https://trefle.io//api/v1/plants/' + id)

# Login
@app.route("/login", methods=["POST"])
def login():
    print("LOGGING IN")
    username = request.form['username']
    password = request.form['password']
    # session['username'] = username
    # session['logged_in'] = True
    # return render_template('index.html')
    
    try:
        db = getDB() 
        
        cursor = db.cursor()

        cursor.execute("SELECT * FROM USERS where username = %s AND password= %s;", (username, password))

        userExists = cursor.fetchone()

        if userExists is not None:
            userID = userExists[0]
            db.close()
            session['username'] = username
            session['logged_in'] = True
            session['userID'] = userID
            print(session)
            return jsonify({'result': "successfully logged in!"})

        cursor.execute("SELECT * FROM USERS where username = %s;", (username))

        userExistsWrongPwd = cursor.fetchone()
        db.close()
        
        if userExistsWrongPwd is not None:
            return jsonify({'result':'user ' + username + ' exists, but the password is wrong.', 'fail': "Wrong password"})
        else:
            return jsonify({'result':'user ' + username + ' does not exist! Please SIGNUP', 'error': "User Doesn't exist!"})
    except Exception as ex:
        return jsonify({'result':'error ' + str(ex) + " occured", 'error': "error occurred"})

@app.route('/logout', methods=["POST"])
def logout():
    # remove the username from the session if it's there
    session.pop(session['username'], None)
    session['logged_in'] = False
    return render_template('index.html')
