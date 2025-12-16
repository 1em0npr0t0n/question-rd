import { Controller, Get } from '@nestjs/common';

@Controller('question')
export class QuestionController {
    @Get()
    findAll(): string {
        return 'aaa';
    }
    
    @Get('test')
    getTest(): string {
        return `question test`;
    }
}
