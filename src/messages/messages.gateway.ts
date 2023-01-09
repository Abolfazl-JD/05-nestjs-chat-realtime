import { WebSocketGateway, SubscribeMessage, MessageBody, WebSocketServer, ConnectedSocket } from '@nestjs/websockets';
import { MessagesService } from './messages.service';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Server, Socket } from 'socket.io'

@WebSocketGateway({
  cors: {
    origin : '*'
  }
})
export class MessagesGateway {
  @WebSocketServer()
  server: Server

  constructor(private readonly messagesService: MessagesService) {}

  @SubscribeMessage('createMessage')
  async create(@MessageBody('text') text: string, @ConnectedSocket() client: Socket) {
    // get all the properties of new message except user info
    const {user, ...newMessage} = await this.messagesService.create(text, client.id);
    // return new message to all the clients
    this.server.emit('messageComing', newMessage)
    return 'message sent'
  }

  @SubscribeMessage('findAllMessages')
  findAll() {
    return this.messagesService.findAll();
  }

  @SubscribeMessage('join')
  async join(@MessageBody('email') email: string, @ConnectedSocket() client: Socket) {
    // create new user
    const user = await this.messagesService.identify(email, client.id)
    // return new user to all the clients
    this.server.emit('join', { joinedUser: user.username })
    return 'joinded done'
  }

  @SubscribeMessage('typing')
  async handleTyping(@ConnectedSocket() client: Socket) {
    const user = await this.messagesService.findOneUser(client.id)
    client.broadcast.emit('isTyping', { typingUser: user.username })
  }

  @SubscribeMessage('updateMessage')
  async update(@MessageBody() updateMessageDto: UpdateMessageDto) {
    const message = await this.messagesService.update(updateMessageDto.id, updateMessageDto.newMessageText);
    this.server.emit('messageUpdated', message)
  }

  @SubscribeMessage('removeMessage')
  async remove(@MessageBody('id') messageId: number, @ConnectedSocket() client: Socket) {
    const response = await this.messagesService.remove(messageId, client.id);
    if (response.userNotOwn) return response
    else this.server.emit('messageDeleted', response)
  }
}
