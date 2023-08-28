import EventHandlerInterface from "../../../@shared/event/event-handler.interface";
import { CustomerChangedAddressEvent } from "../customer-address-event";

export class Sendwhencustomeraddressischangedhandler implements EventHandlerInterface<CustomerChangedAddressEvent> {
	handle(event: CustomerChangedAddressEvent): void {
		const { id, name, oldAddress, newAddress } = event.payload.customer;

		console.log(`Customer ${name} with id ${id} changed address`);
		console.log(`Old address: ${oldAddress.street} ${oldAddress.number}, ${oldAddress.city} - ${oldAddress.zip}`);
		console.log(`New address: ${newAddress.street} ${newAddress.number}, ${newAddress.city} - ${newAddress.zip}`);
	}
}