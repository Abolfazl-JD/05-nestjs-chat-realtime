import { Injectable, NotFoundException } from '@nestjs/common';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { CreateMessageDto } from './dto/create-message.dto';
import { UpdateMessageDto } from './dto/update-message.dto';
import { Message } from './entities/message.entity';
import { UsersService } from './../auth/users.service';

@Injectable()
export class MessagesService {

  constructor(
    @InjectRepository(Message) private messagesRepository: Repository<Message>,
    private usersService: UsersService
  ) { }

  async create(messageContent: string, clientId: string) {
    // find user who sent this message
    const user = await this.usersService.findOneByClientId(clientId)
    const newMessage = this.messagesRepository.create({
      name: user.username,
      text: messageContent
    })
    // assign user to a message
    newMessage.user = user
    // create message
    await this.messagesRepository.save(newMessage)
    return newMessage
  }

  findAll() {
    return this.messagesRepository.find();
  }

  async identify(email: string, clientId: string) {
    const user = await this.usersService.findUserByEmail(email)
    user.client_id = clientId
    return this.usersService.saveUser(user)
  }

  findOneUser(clientId: string) {
    return this.usersService.findOneByClientId(clientId)
  }

  async findOneMessage(id: number) {
    const message = await this.messagesRepository.findOneBy({ id })
    if (!message) throw new NotFoundException('this message was not found')
    else return message
  }

  async update(id: number, newMessageText: string) {
    const message = await this.findOneMessage(id)
    message.text = newMessageText
    message.edited = true
    return this.messagesRepository.save(message)
  }

  async remove(messageId: number, clientId: string) {
    // check, if the user who is deleting the message, owns that message. not other one messages'.
    const userOwnMessage = await this.checkUserOwnMessage(messageId, clientId)
    const message = await this.findOneMessage(messageId)
    if (userOwnMessage) {
      await this.messagesRepository.remove(message)
      return {...message}
    }
    return { userNotOwn: true}
  }

  async checkUserOwnMessage(messageId: number, clientId: string) {
    const user = await this.usersService.findOneByClientId(clientId)
    const messageIds = user.messages.map(m => m.id)
    return messageIds.includes(messageId)
  }
}
