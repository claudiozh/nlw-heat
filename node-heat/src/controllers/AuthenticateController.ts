import { Request, Response } from 'express';
import { AuthenticateService } from '../services/AuthenticateService';

export class AuthenticateController {
  async handle(request: Request, response: Response) {
    const { code } = request.body;
    const service = new AuthenticateService();

    try {
      const result = await service.execute(code);
      return response.json(result);
    } catch (error) {
      return response.json({ error: error.message });
    }
  }
}
