import { Injectable } from '@angular/core';
import { map } from 'rxjs/operators';
import { Observable, Subject } from 'rxjs';
import { WebsocketService } from './websocket.service';
import { Guid } from 'guid-typescript';

const CHAT_URL = 'wss://luvirosapi.com:1880/loadgistix/ws';

export interface Message {
	userId: Guid
}

@Injectable()
export class MessageService {
	public messages: Subject<Message>;

	constructor(wsService: WebsocketService) {
		this.messages = <Subject<Message>>wsService
			.connect(CHAT_URL)
			.pipe(map((response: MessageEvent): Message => {
				let data = JSON.parse(response.data);
				return {
					userId: data.userId
				}
			}));
	}
}