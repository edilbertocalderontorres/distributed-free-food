
import { IncomingMessage, Server } from 'node:http';
import { WebSocketServer } from 'ws';
export  class WebSocketManager {

    private static instance: WebSocketManager;
    private wss: WebSocketServer | null = null;

    private clients = new Map<string, WebSocket>();


    private constructor({ server }: { server: Server }) {
        if (!this.wss) {
            this.wss = new WebSocketServer({ server });
            this.iniciarWebSocket();
        }
    }

    public static getInstance(server?: Server): WebSocketManager {
        if (!WebSocketManager.instance) {
            if (!server) {
                throw new Error("Debe proporcionar un servidor la primera vez.");
            }
            WebSocketManager.instance = new WebSocketManager({ server });
        }
        return WebSocketManager.instance;
    }

    public iniciarWebSocket() {

        this.wss?.on('connection', (ws: WebSocket, req: IncomingMessage) => {


            const clientId = req.headers["x-clientid"] as string;
            this.clients.set(clientId, ws);
            console.log('Conexión establecida', clientId);


            ws.onmessage = (message) => {
               

            }

            ws.onclose = () => {
                console.log('Conexión cerrada', clientId);
                this.clients.delete(clientId);
            }
        });


    }

    public sendMessages(message: string, wsClientId: string) {
        const client = this.clients.get(wsClientId);


        if (client?.OPEN && client.readyState === WebSocket.OPEN) {
            client.send(message);
        }
    }
}


