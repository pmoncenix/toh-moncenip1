import { Injectable, signal } from '@angular/core';

@Injectable({ providedIn: 'root' })
export class MessageService {
  private _messages = signal<string[]>([]);

  messages = this._messages.asReadonly();

  add(message: string) {
    this._messages.update(list => [...list, message]);
  }

  clear() {
    this._messages.set([]);
  }
}
