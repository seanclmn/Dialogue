import { NestFactory } from '@nestjs/core';
import { AppModule } from './app.module';
import { Repository } from 'typeorm';
import { User } from './users/entities/user.entity';
import { Chat } from './chats/entities/chat.entity';
import { Message } from './messages/entities/message.entity';
import { Notification, NotificationsType, FriendRequestNotification } from './notifications/entities/notification.entity';
import { FriendRequest } from './friends/entities/friend-request.entity';
import { Friendship } from './friends/entities/friendship.entity';
import { hash } from 'bcrypt';

async function seed() {
  const app = await NestFactory.createApplicationContext(AppModule);
  
  const userRepository = app.get<Repository<User>>('UserRepository');
  const chatRepository = app.get<Repository<Chat>>('ChatRepository');
  const messageRepository = app.get<Repository<Message>>('MessageRepository');
  const notificationRepository = app.get<Repository<Notification>>('NotificationRepository');
  const friendRequestNotificationRepository = app.get<Repository<FriendRequestNotification>>('FriendRequestNotificationRepository');
  const friendRequestRepository = app.get<Repository<FriendRequest>>('FriendRequestRepository');
  const friendshipRepository = app.get<Repository<Friendship>>('FriendshipRepository');

  console.log('Seeding database via CLI...');

  const password = await hash('password123', 10);

  // Clear existing data
  await chatRepository.query('SET FOREIGN_KEY_CHECKS = 0');
  await friendshipRepository.createQueryBuilder().delete().execute();
  await notificationRepository.createQueryBuilder().delete().execute();
  await friendRequestRepository.createQueryBuilder().delete().execute();
  await messageRepository.createQueryBuilder().delete().execute();
  await chatRepository.createQueryBuilder().delete().execute();
  await userRepository.createQueryBuilder().delete().execute();
  await chatRepository.query('SET FOREIGN_KEY_CHECKS = 1');

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

  const possibleMessages = [
    "Hey, how's it going?",
    "Did you see the latest update?",
    "Let's catch up soon!",
    "I'm working on the new feature now.",
    "Can you review my PR?",
    "The weather is great today!",
    "I'll be a bit late to the meeting.",
    "That sounds like a plan!",
    "Have you tried the new coffee shop?",
    "Let's debug this together."
  ];

  // Seed chats with 40 messages each; chunk messages by same user (not strict back-and-forth)
  const chatsToSeed = [groupChat, directChat];
  const participants = [alice, bob];
  const allMessages = [];
  const lastMessageByChat = new Map<string, { text: string; userId: string; username: string; chat: Chat; createdAt: Date }>();
  const chanceToKeepSameSender = 0.4; // 40% chance next message is from same user

  for (const chat of chatsToSeed) {
    let lastSender: User | null = null;
    for (let i = 1; i <= 40; i++) {
      const randomMessage = possibleMessages[Math.floor(Math.random() * possibleMessages.length)];
      const otherSender = lastSender
        ? participants.find((p) => p.id !== lastSender!.id)!
        : participants[Math.floor(Math.random() * participants.length)];
      const keepSame =
        lastSender && Math.random() < chanceToKeepSameSender;
      const sender = keepSame ? lastSender! : otherSender;
      lastSender = sender;
      // All messages at least 24h ago: most recent (i=40) at now-24h, older messages 1 min apart
      const twentyFourHoursMs = 24 * 60 * 60 * 1000;
      const createdAt = new Date(Date.now() - twentyFourHoursMs - (40 - i) * 60000);
      const msg = {
        text: randomMessage,
        userId: sender.id,
        username: sender.username,
        chat: chat,
        createdAt,
      };
      allMessages.push(msg);
      lastMessageByChat.set(chat.id, msg);
    }
  }

  const savedMessages = await messageRepository.save(allMessages);

  // Set lastMessage on each chat to the most recent message (saved entities are mutated in place with ids)
  for (const chat of chatsToSeed) {
    const lastMsg = lastMessageByChat.get(chat.id) as Message | undefined;
    if (lastMsg?.id) {
      chat.lastMessage = lastMsg;
      await chatRepository.save(chat);
    }
  }

  // Alice and Bob are already friends
  await friendshipRepository.save([
    { user: alice, friend: bob },
    { user: bob, friend: alice },
  ]);

  // Create a friend request from Charlie to Alice
  const fr1 = await friendRequestRepository.save({
    sender: charlie,
    receiver: alice,
    accepted: false,
    declined: false,
  });

  // Create a corresponding notification for Alice
  await friendRequestNotificationRepository.save({
    type: NotificationsType.FRIENDREQUEST,
    sender: charlie,
    receiver: alice,
    receiverId: alice.id,
    accepted: false,
    declined: false,
    friendRequestId: fr1.id,
  });

  // Create another friend request from Bob to Charlie
  const fr2 = await friendRequestRepository.save({
    sender: bob,
    receiver: charlie,
    accepted: false,
    declined: false,
  });

  // Create a corresponding notification for Charlie
  await friendRequestNotificationRepository.save({
    type: NotificationsType.FRIENDREQUEST,
    sender: bob,
    receiver: charlie,
    receiverId: charlie.id,
    accepted: false,
    declined: false,
    friendRequestId: fr2.id,
  });

  console.log('Seeding completed successfully!');
  await app.close();
}

seed().catch((error) => {
  console.error('Seeding failed:', error);
  process.exit(1);
});
