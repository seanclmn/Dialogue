import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { InjectRepository } from '@nestjs/typeorm';
import { Repository } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Chat } from './chats/entities/chat.entity';
import { Message } from './messages/entities/message.entity';
import { Notification, NotificationsType } from './notifications/entities/notification.entity';
import { hash } from 'bcrypt';
import { INestApplicationContext } from '@nestjs/common';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const userRepository = app.get<Repository<User>>('UserRepository');
  const chatRepository = app.get<Repository<Chat>>('ChatRepository');
  const messageRepository = app.get<Repository<Message>>('MessageRepository');
  const notificationRepository = app.get<Repository<Notification>>('NotificationRepository');

  console.log('Seeding database via CLI...');

  const password = await hash('password123', 10);

  // Clear existing data (optional, but often useful for seeds)
  // await notificationRepository.delete({});
  // await messageRepository.delete({});
  // await chatRepository.delete({});
  // await userRepository.delete({});

  const alice = await userRepository.save({
    username: 'alice',
    password,
    bio: 'Alice from Wonderland',
  });

  const bob = await userRepository.save({
    username: 'bob',
    password,
    bio: 'Bob the Builder',
  });

  const charlie = await userRepository.save({
    username: 'charlie',
    password,
    bio: 'Charlie in the Chocolate Factory',
  });

  const groupChat = await chatRepository.save({
    name: 'General Chat',
    participants: [alice, bob, charlie],
  });

  const directChat = await chatRepository.save({
    name: 'Alice & Bob',
    participants: [alice, bob],
  });

  await messageRepository.save([
    {
      text: 'Hello everyone!',
      userId: alice.id,
      chat: groupChat,
    },
    {
      text: 'Hey Alice!',
      userId: bob.id,
      chat: groupChat,
    },
    {
      text: 'Hi guys!',
      userId: charlie.id,
      chat: groupChat,
    },
    {
      text: 'Hey Bob, did you finish the project?',
      userId: alice.id,
      chat: directChat,
    },
  ]);

  await notificationRepository.save([
    {
      type: NotificationsType.FRIENDREQUEST,
      sender: charlie,
      receiver: alice,
      receiverId: alice.id,
    },
  ]);

  console.log('Seeding completed successfully!');
  await app.close();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
