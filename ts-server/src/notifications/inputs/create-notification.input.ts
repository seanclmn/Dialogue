import { NotificationsType } from "src/notifications/entities/notification.entity";
import { User } from "src/users/entities/user.entity";

export interface CreateNotificationParams {
  type: NotificationsType;
  sender: User
  receiver: User
}