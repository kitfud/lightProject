from flask import Flask, request
from flask_socketio import SocketIO, emit
from flask_cors import CORS

app = Flask(__name__)
CORS(app)
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, cors_allowed_origins="*")

owners = {}
users_requests = {}


def handle_request_queue():
    pass


@socketio.on("owner connected")
def handle_owner_connection(json_data):
    owners[json_data["userAddress"]] = request.sid


@socketio.on("user request")
def handle_user_request(json_data):
    req_data = json_data["data"]
    address = json_data["address"]

    if address in users_requests.keys():
        if request.sid in users_requests[address].keys():
            emit(
                "request status",
                {"status": "server-request in queue"},
                room=request.sid,
            )
        else:
            emit("request status", {"status": "server-received"}, room=request.sid)
            users_requests[address]["queue"].append(request.sid)
            users_requests[address][request.sid] = req_data
    else:
        users_requests[address] = {"queue": [request.sid], request.sid: req_data}

    owner_session_id = owners[address]
    emit("user request", req_data, room=owner_session_id)


@socketio.on("request status")
def handle_request_status(json_data):
    status = json_data["status"]
    address = json_data["address"]

    emit("request status", {"status": status}, room=users_requests[address])


if __name__ == "__main__":
    socketio.run(app, debug=True)
