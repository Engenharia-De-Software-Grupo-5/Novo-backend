import { InterestCalculatorDto } from 'src/contracts/charges/calculator/interest-calculator.dto';
import { InterestCalculatorResponse } from 'src/contracts/charges/calculator/interest-calculator.response';
import { InterestCalculatorService } from 'src/services/charges/interest-calculator.service';
export declare class InterestCalculatorController {
    private readonly service;
    constructor(service: InterestCalculatorService);
    calculate(dto: InterestCalculatorDto): InterestCalculatorResponse;
}
