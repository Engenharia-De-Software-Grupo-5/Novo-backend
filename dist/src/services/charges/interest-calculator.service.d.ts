import { InterestCalculatorDto } from 'src/contracts/charges/calculator/interest-calculator.dto';
import { InterestCalculatorResponse } from 'src/contracts/charges/calculator/interest-calculator.response';
export declare class InterestCalculatorService {
    private round2;
    private diffDays;
    calculate(dto: InterestCalculatorDto): InterestCalculatorResponse;
}
