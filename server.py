from http.server import HTTPServer, CGIHTTPRequestHandler

port = 8000
server_adress = ("localhost", port)
httpd = HTTPServer(server_adress, CGIHTTPRequestHandler)
httpd.serve_forever()
