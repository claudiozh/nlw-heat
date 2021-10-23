import { Request, Response } from 'express';
import { Last3MessageService } from '../services/Last3MessageService';

export class Last3MessageController {
  async handle(request: Request, response: Response) {
    const service = new Last3MessageService();
    const messages = await service.execute();

    return response.json(messages);
  }
}
