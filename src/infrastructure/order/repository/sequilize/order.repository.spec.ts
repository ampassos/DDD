import { Sequelize } from "sequelize-typescript";
import Order from "../../../../domain/checkout/entity/order";
import OrderItem from "../../../../domain/checkout/entity/order_item";
import Customer from "../../../../domain/customer/entity/customer";
import Address from "../../../../domain/customer/value-object/address";
import Product from "../../../../domain/product/entity/product";
import CustomerModel from "../../../customer/repository/sequelize/customer.model";
import CustomerRepository from "../../../customer/repository/sequelize/customer.repository";
import ProductModel from "../../../product/repository/sequelize/product.model";
import ProductRepository from "../../../product/repository/sequelize/product.repository";
import OrderItemModel from "./order-item.model";
import OrderModel from "./order.model";
import OrderRepository from "./order.repository";

describe("Order repository test", () => {
  let sequelize: Sequelize;

  beforeEach(async () => {
    sequelize = new Sequelize({
      dialect: "sqlite",
      storage: ":memory:",
      logging: false,
      sync: { force: true },
    });

    await sequelize.addModels([
      CustomerModel,
      OrderModel,
      OrderItemModel,
      ProductModel,
    ]);
    await sequelize.sync();
  });

  afterEach(async () => {
    await sequelize.close();
  });

	function getAddress() {
		const customer = new Customer("123", "John Doe");
		const address = new Address("Rua A", 1, "30000000", "Belo Horizonte, MG");
		customer.changeAddress(address);
		
		return customer;
	}

  it("should create a new order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("123", "123", [orderItem]);

    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    const orderModel = await OrderModel.findOne({
      where: { id: order.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "123",
      customer_id: "123",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "123",
          product_id: "123",
        },
      ],
    });
  });

    it("should update Order", async () => {
    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("5", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

    //update new customer
    const customer2 = new Customer("321", "Customer 2");
    const address2 = new Address("Street 2", 1, "Zipcode 2", "City 2");
    customer2.changeAddress(address2);
    await customerRepository.create(customer2);

    const orderNewCustomer = new Order("5", "321", [orderItem]);
    await orderRepository.update(orderNewCustomer);
    
    const orderModel = await OrderModel.findOne({
      where: { id: orderNewCustomer.id },
      include: ["items"],
    });

    expect(orderModel.toJSON()).toStrictEqual({
      id: "5",
      customer_id: "321",
      total: order.total(),
      items: [
        {
          id: orderItem.id,
          name: orderItem.name,
          price: orderItem.price,
          quantity: orderItem.quantity,
          order_id: "5",
          product_id: "123",
        },
      ],
    });
  });
 
  it("should find a order", async () => {

    const customerRepository = new CustomerRepository();
    const customer = new Customer("123", "Customer 1");
    const address = new Address("Street 1", 1, "Zipcode 1", "City 1");
    customer.changeAddress(address);
    await customerRepository.create(customer);

    const productRepository = new ProductRepository();
    const product = new Product("123", "Product 1", 10);
    await productRepository.create(product);

    const orderItem = new OrderItem(
      "1",
      product.name,
      product.price,
      product.id,
      2
    );

    const order = new Order("5", "123", [orderItem]);
    const orderRepository = new OrderRepository();
    await orderRepository.create(order);

		const orderFound = await orderRepository.find("5");

		expect(orderFound).toEqual(order);
   
  });

	it("should find all orders", async () => {
		const customerRepository = new CustomerRepository();
		const productRepository = new ProductRepository();
		const orderRepository = new OrderRepository();

		const customer = getAddress();
		await customerRepository.create(customer);

		const product1 = new Product("1", "A", 1.00);
		const product2 = new Product("2", "B", 2.00);
		const product3 = new Product("3", "C", 3.00);

		await productRepository.create(product1);
		await productRepository.create(product2);
		await productRepository.create(product3);

		const orderItem1 = new OrderItem("1","Order Item 1", product1.price, product1.id, 1);
		const orderItem2 = new OrderItem("2","Order Item 2", product2.price, product2.id, 2);
		const orderItem3 = new OrderItem("3","Order Item 3", product3.price, product3.id, 3);

		const order1 = new Order("1", customer.id, [orderItem1]);
    const order2 = new Order("2", customer.id, [orderItem2]);
		const order3 = new Order("3", customer.id, [orderItem3]);

		await orderRepository.create(order1);
		await orderRepository.create(order2);
    await orderRepository.create(order3);

		const orders = await orderRepository.findAll();

		expect(orders.length).toBe(3);
		expect(orders).toContainEqual(order1);
		expect(orders).toContainEqual(order2);
    expect(orders).toContainEqual(order3);
	});

});
