from flask import Flask, Response, jsonify, request
from flask_cors import CORS, cross_origin

from riskNet import *

app = Flask(__name__)
cors = CORS(app)
app.config['CORS_HEADERS'] = 'Content-Type'

@app.route('/hello/', methods=['GET'])
@cross_origin()
def hello_world():
    return jsonify("Hello World")

@app.route('/test/', methods=['POST'])
@cross_origin(origin='localhost',headers=['Content- Type','application/json'])
def receive_data():
    if not request.is_json:
        return jsonify({"bad request"})

    content = request.get_json()
    index = runNN(content["jumps"], content["silver"], content["gold"], content["diamonds"])
    print index
    return jsonify({"index": str(index)})


def main():
    app.run(host='0.0.0.0', port=8001)

if __name__ == '__main__':
    main()
