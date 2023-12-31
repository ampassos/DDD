import { EventDispatcher } from "../../@shared/event/event-dispatcher";
import { CustomerChangedAddressEvent } from "./customer-address-event";
import { Sendwhencustomeraddressischangedhandler } from "./handler/Send-when-customer-address-is-changed.handler";

describe("Customer changed address tests", () => {

	it("should send notify change address customer", () => {
		const eventDispatcher = new EventDispatcher();
		const eventHandler1 = new Sendwhencustomeraddressischangedhandler();

		const spyEventHandler1 = jest.spyOn(eventHandler1, "handle");

		eventDispatcher.register("CustomerChangedAddressEvent", eventHandler1);

		expect(eventDispatcher.eventHandlers["CustomerChangedAddressEvent"].length).toBe(1);

		const eventData = {
			customer: {
				id: "1",
				name: "Antonio Passos",
				oldAddress: {
					street: "Rua A",
					number: "1",
					city: "Belo Horizonte",
					zip: "30000000"
				},
				newAddress: {
					street: "Rua B",
					number: "2",
					city: "Betim",
					zip: "30000001"
				}
			}			
		};

		const customerCreatedEvent = new CustomerChangedAddressEvent(eventData);

		eventDispatcher.notify(customerCreatedEvent);

		expect(spyEventHandler1).toHaveBeenCalled();
	});

});