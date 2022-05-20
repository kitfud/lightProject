from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, cors_allowed_origins="*")

owners = {}
user_sid = {}


@socketio.on("owner connected")
def handle_owner_connection(address):
    owners[address] = request.sid


@socketio.on("user request")
def handle_user_request(json_data):
    req_data = json_data["data"]
    address = json_data["address"]
    user_sid[address] = request.sid

    # emit("request status", "server-received", room=user_sid[address])
    owner_session_id = owners[address]
    print(address)
    emit("user request", req_data, room=owner_session_id)


@socketio.on("request status")
def handle_request_status(json_data):
    status = json_data["status"]
    address = json_data["address"]
    print(address)
    emit("request status", status, room=user_sid[address])


if __name__ == "__main__":
    socketio.run(app, debug=True)
