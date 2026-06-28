function sendJson(res, statusCode, payload) {
  res.writeHead(statusCode, {
    'Content-Type': 'application/json; charset=utf-8',
    'Access-Control-Allow-Origin': '*',
    'Access-Control-Allow-Methods': 'GET,POST,PUT,DELETE,OPTIONS',
    'Access-Control-Allow-Headers': 'Content-Type, Authorization'
  });
  res.end(JSON.stringify(payload, null, 2));
}

function success(res, statusCode, message, data = null) {
  sendJson(res, statusCode, {
    success: true,
    message,
    data
  });
}

function error(res, statusCode, message, details = null) {
  sendJson(res, statusCode, {
    success: false,
    message,
    details
  });
}

module.exports = { sendJson, success, error };
