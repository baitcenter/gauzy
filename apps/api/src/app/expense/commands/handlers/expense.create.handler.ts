import { CommandHandler, ICommandHandler } from '@nestjs/cqrs';
import { ExpenseCreateCommand } from '../expense.create.command';
import { Expense } from '../../expense.entity';
import { ExpenseService } from '../../expense.service';
import { EmployeeService } from '../../../employee';
import { OrganizationService } from '../../../organization';

@CommandHandler(ExpenseCreateCommand)
export class ExpenseCreateHandler
	implements ICommandHandler<ExpenseCreateCommand> {
	constructor(
		private readonly expenseService: ExpenseService,
		private readonly employeeService: EmployeeService,
		private readonly organizationService: OrganizationService
	) {}

	public async execute(command: ExpenseCreateCommand): Promise<Expense> {
		const { input } = command;

		const expense = new Expense();
		const employee = input.employeeId
			? await this.employeeService.findOne(input.employeeId)
			: null;
		const organization = await this.organizationService.findOne(
			input.orgId
		);

		expense.amount = Math.abs(input.amount);
		expense.categoryId = input.categoryId;
		expense.categoryName = input.categoryName;
		expense.vendorId = input.vendorId;
		expense.vendorName = input.vendorName;
		expense.typeOfExpense = input.typeOfExpense;
		expense.clientName = input.clientName;
		expense.clientId = input.clientId;
		expense.projectName = input.projectName;
		expense.projectId = input.projectId;
		expense.notes = input.notes;
		expense.valueDate = input.valueDate;
		expense.employee = employee;
		expense.organization = organization;
		expense.currency = input.currency;
		expense.purpose = input.purpose;
		expense.taxType = input.taxType;
		expense.taxLabel = input.taxLabel;
		expense.rateValue = input.rateValue;
		expense.receipt = input.receipt;

		if (!expense.currency) {
			expense.currency = organization.currency;
		}

		return await this.expenseService.create(expense);
	}
}
