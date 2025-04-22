import Order from "../models/order.js";
import MailingService from "./MailingService.js";

class OrderService {
  static async PlaceOrder(orderData) {
    try {
      console.log("[1] Raw order data:", JSON.stringify(orderData, null, 2));
      
      /* const cleanOrderData = {
        ...orderData,
        items: orderData.items.map(item => ({
          ...item,
          address: {
            title: item.address?.title || '',
            firstName: item.address?.firstName || '',
            lastName: item.address?.lastName || '',
            city: item.address?.city || '',
            address: item.address?.address || '',
            mobile: item.address?.mobile || '',
            altMobile: item.address?.altMobile || '',
            email: item.address?.email || '',
            addressType: item.address?.addressType || '',
            landmark: item.address?.landmark || ''
          },
          deliverySlot: {
            key: item.deliverySlot?.key || '',
            time: item.deliverySlot?.time || '',
            price: item.deliverySlot?.price || 0
          },
          accessories: item.accessories || [],
          message: item.message ? {
            recipient: item.message.recipient || '',
            sender: item.message.sender || '',
            themeOption: item.message.themeOption || '',
            messageBody: item.message.messageBody || ''
          } : null
        }))
      }; */
  
      console.log("[2] Cleaned order data:", JSON.stringify(orderData, null, 2));
  
      const order = new Order(orderData);
      const savedOrder = await order.save();
      
      console.log("[3] Saved order (Mongoose doc):", savedOrder);
      console.log("[4] Saved order (plain object):", savedOrder.toObject());
  
      await MailingService.sendNewOrderEmail(
        order.user.email, 
        savedOrder
      );
      
      return savedOrder;
    } catch (error) {
      console.error("Error saving order:", error);
      throw error;
    }
  }
}
  
  export default OrderService;