import mongoose from 'mongoose';
import app from './app';
import config from './config/config';
import logger from './config/logger';
import { createServer } from 'http'; 
import { Server as SocketIOServer } from 'socket.io';
import SocketManager from './middlewares/socket.io';

class ServerComponent {
  private server: any;
  private io: SocketIOServer;

  
  constructor() {
    this.server = null;
    // @ts-ignore
    this.io = null;
    this.setupProcessHandlers();
  }

  private async connectToMongoDB(): Promise<void> {
    try {
      await mongoose.connect(config.mongoose.url, config.mongoose.options);
      logger.info('Connected to MongoDB');
    } catch (error: Error | any) {
      this.handleUnexpectedError(error);
    }
  }

  private startServer(): void {
    // @ts-ignore
    // this.server = app.listen(config.port, () => {
    //   logger.info(`Listening to port ${config.port}`);
    // });
    this.server = createServer(app); // Create HTTP server
    this.server.listen(config.port, () => {
      logger.info(`Listening to port ${config.port}`);
    });
    // this.io = new SocketIOServer(this.server); // Initialize Socket.IO server
    // new SocketManager(this.io); 

      this.io = new SocketIOServer(this.server, {
        cors: {
          origin: "http://localhost:3001", 
          methods: ["GET", "POST"],
        },
      });
  
      new SocketManager(this.io);
  }

  private setupProcessHandlers(): void {
    process.on('uncaughtException', (error: Error) => this.handleUnexpectedError(error));
    process.on('unhandledRejection', (error: Error) => this.handleUnexpectedError(error));
    process.on('SIGTERM', () => this.handleSigterm());
  }

  private handleUnexpectedError(error: Error): void {
    this.exitHandler();
  }

  private exitHandler(): void {
    if (this.server) {
      this.server.close(() => {
        logger.info('Server closed');
        process.exit(1);
      });
    } else {
      process.exit(1);
    }
  }

  private handleSigterm(): void {
    logger.info('SIGTERM received');
    if (this.server) {
      this.server.close();
    }
  }

  public async start(): Promise<void> {
    await this.connectToMongoDB();
    this.startServer();
  }
}

// Instantiate and start the server component
const serverComponent = new ServerComponent();
serverComponent.start();
