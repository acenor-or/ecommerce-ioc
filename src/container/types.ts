// Um Symbol para cada dependência: a interface some ao compilar,
// então é o Symbol que o container usa para saber o que entregar.
export const TYPES = {
  PrismaClient: Symbol.for('PrismaClient'),
  ProductRepository: Symbol.for('ProductRepository'),
  OrderRepository: Symbol.for('OrderRepository'),
  MailProvider: Symbol.for('MailProvider'),
  PaymentMethod: Symbol.for('PaymentMethod'),
  PaymentMethodRegistry: Symbol.for('PaymentMethodRegistry'),
  NotificationService: Symbol.for('NotificationService'),
  OrderService: Symbol.for('OrderService'),
  OrderController: Symbol.for('OrderController'),
};
