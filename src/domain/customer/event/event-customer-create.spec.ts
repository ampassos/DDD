import { EventDispatcher } from "../../@shared/event/event-dispatcher";
import SendLog1WhenCustomerIsCreatedHandler from "./handler/Send-log1-when-customer-is-created.handler";
import SendLog2WhenCustomerIsCreatedHandler from "./handler/Send-log2-when-customer-is-created.handler";
import CustomerCreatedEvent from "./customer-created.event";

describe("Customer created event tests", () => {
  
	it("should send notify creation product", () => {
		const eventDispatcher = new EventDispatcher();
		const eventHandler1 = new SendLog1WhenCustomerIsCreatedHandler();
		const eventHandler2 = new SendLog2WhenCustomerIsCreatedHandler();

		const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");
		const spyEventHandler2 = jest.spyOn(eventHandler2, "handle");

		eventDispatcher.register("CustomerCreatedEvent", eventHandler1);
		eventDispatcher.register("CustomerCreatedEvent", eventHandler2);

		expect(eventDispatcher.eventHandlers["CustomerCreatedEvent"].length).toBe(2);

		const eventData = {
			customer: {
				id: "1",
				name: "Antonio Passos",
				active: false
			}			
		};

		const customerCreatedEvent = new CustomerCreatedEvent(eventData);

		eventDispatcher.notify(customerCreatedEvent);

		expect(spyEventHandler1).toHaveBeenCalled();
		expect(spyEventHandler2).toHaveBeenCalled();
	});

});