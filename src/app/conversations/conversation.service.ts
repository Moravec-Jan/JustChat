import {Conversation} from "../conversation/conversation";
import {User} from "../users/user";

export interface IOnChangeCallback {
  (user: User): void;
}

export class ConversationService {
  public onHideCallback: IOnChangeCallback;
  public onUserClickCallback: IOnChangeCallback;

  private _conversations: Conversation[] = [
    {
      user: {
        id: "1",
        name: "Rodrigo"
      },
      messages: [
        {
          author: "Rodrigo",
          body: "Hi"
        },
        {
          author: "You",
          body: "Oh hello Rodrigo."
        }
      ],
      active: true
    },
    {
      user: {
        id: "2",
        name: "Marco"
      },
      messages: [
        {
          author: "Marco",
          body: "Hello"
        }
      ],
      active: true
    },
    {
      user: {
        id: "3",
        name: "Ginny"
      },
      messages: [
        {
          author: "Ginny",
          body: "Cao"
        }
      ],
      active: true
    }
  ];

  public constructor() {
  }

  public get conversations(): Conversation[] {
    return this._conversations;
  }

  public add(item: Conversation) {
    this._conversations.push(item);
  }

  public hide(user: User) {
    this.onHideCallback(user);
  }

  public show(user: User) {
    this.onUserClickCallback(user);
  }
}

