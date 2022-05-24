from flask import Flask, request, send_from_directory
from flask_socketio import SocketIO, emit

app = Flask(__name__, static_url_path="", static_folder="./build")
app.config["SECRET_KEY"] = "secret!"
socketio = SocketIO(app, async_mode='gevent')

owners = {}
user_sid = {}
tx_hash = {}


@socketio.on("owner connected", namespace="/websocket")
def handle_owner_connection(address):
    owners[address] = request.sid
    if not address in list(tx_hash.keys()):
        tx_hash[address] = {"previous": None, "current": None}


@socketio.on("user request", namespace="/websocket")
def handle_user_request(json_data):
    req_data = json_data["data"]

    address = json_data["address"]
    user_sid[address] = request.sid

    tx_hash[address]["current"] = json_data["tx_hash"]

    emit("request status", "server-received", room=user_sid[address])
    owner_session_id = owners[address]

    emit("user request", req_data, room=owner_session_id)


@socketio.on("request status", namespace="/websocket")
def handle_request_status(json_data):
    status = json_data["status"]
    address = json_data["address"]
    if status == "owner-data processed":
        tx_hash[address]["previous"] = tx_hash[address]["current"]
        tx_hash[address]["current"] = None

    emit("request status", status, room=user_sid[address])


@socketio.on("transaction hash", namespace="/websocket")
def handle_owner_connection(address):
    # emit("transaction hash", tx_hash[address]["current"], room=request.sid)
    return tx_hash[address]["current"]


@app.route("/", defaults={"path": ""})
def serve(path):
    return send_from_directory(app.static_folder, "index.html")


@app.route("/<path>")
def catch_all(path):
    return send_from_directory(app.static_folder, "index.html")


if __name__ == "__main__":
    socketio.run(app, host="0.0.0.0", port=5000)  # , debug=True)
