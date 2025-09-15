export class TypingEvent {
  constructor(
    public readonly chatId: string,
    public readonly userId: string,
    public readonly isTyping: boolean,
  ) { }
}