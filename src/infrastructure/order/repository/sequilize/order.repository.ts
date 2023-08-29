import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import { OrderRepositoryInterface } from "../../../../domain/checkout/repository/order-repository.interface";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";


function orderItemModel(orderItemModel: OrderItemModel) {
	return new OrderItem(orderItemModel.id, orderItemModel.name, orderItemModel.price, orderItemModel.product_id, orderItemModel.quantity);
}

export default class OrderRepository implements OrderRepositoryInterface {
  async create(entity: Order): Promise<void> {
    await OrderModel.create(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        include: [{ model: OrderItemModel }],
      }
    );
  }
  
  async update(entity: Order): Promise<void> {
    await OrderModel.update(
      {
        id: entity.id,
        customer_id: entity.customerId,
        total: entity.total(),
        items: entity.items.map((item) => ({
          id: item.id,
          name: item.name,
          price: item.price,
          product_id: item.productId,
          quantity: item.quantity,
        })),
      },
      {
        where: {
          id: entity.id,
        },
      }
    );
  }

  async find(id: string): Promise<Order> {
		let ordersModel;

		try {
			ordersModel = await OrderModel.findOne({
				where: { id },
				include: [{ model: OrderItemModel }],
				rejectOnEmpty: true,
			});
		} catch (error) {
			throw new Error(`Order with id: ${id} not found`);
		}

		const items = ordersModel.items.map(orderItemModel);
		const order = new Order(ordersModel.id, ordersModel.customer_id, items);

		return order;
	}  
	async findAll(): Promise<Order[]> {
		const ordersModel = await OrderModel.findAll({ include: [{ model: OrderItemModel }] });

		const orders = ordersModel.map((ordersModel) => {
			const items = ordersModel.items.map(orderItemModel);
			const order = new Order(ordersModel.id, ordersModel.customer_id, items);

			return order;
		});

		return orders;
	}
 }
