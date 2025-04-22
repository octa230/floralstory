import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      asHydrated: false,
      isAuthenticated: false,

      // Actions
      login: (userData) => set({
        user: userData,
        isAuthenticated: true,
      }),
      logout: () => set({ 
        user: null,
        isAuthenticated: false 
      }),
      updateUser: (userData) => set({user: userData}),
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        //token: state.token
      })
    }
  )
);

export const useOrderDetails = create(
  persist(
    (set) => ({
      date: null,
      city: null,
      slot: null,
      
      // Actions
      saveDetails: (detailsData) => set({ 
        date: detailsData.date, 
        city: detailsData.city,
        slot: detailsData.slot
      }),
      deleteDetails: () => set({ 
        date: null, 
        city: null,
        slot: null 
      }),
      updateDetails: (detailsData) => set(detailsData)
    }),
    {
      name: 'order-storage',
      partialize: (state) => ({
        date: state.date,
        city: state.city,
        slot: state.slot
      })
    }
  )
);

export const useCartStore = create(
  persist(
    (set, get) => ({
      items: [],
      totalPrice: 0,
      
      // Add an item to the cart
      addItem: (item) => set(state => {
        // Generate a unique cartId for each item added
        const cartId = Date.now().toString();
        const itemWithCartId = { ...item, cartId };
        
        // Create updated array with new item
        const updatedItems = [...state.items, itemWithCartId];
        
        return {
          items: updatedItems,
          totalPrice: calculateTotalWithAccessories(updatedItems),
        };
      }),
      
      // Update item quantity
      updateItemQuantity: (cartId, change) => set(state => {
        const updatedItems = state.items.map(item => {
          if (item.cartId === cartId) {
            const newQuantity = Math.max(1, (item.quantity || 1) + change);
            return { ...item, quantity: newQuantity };
          }
          return item;
        });
        
        return {
          items: updatedItems,
          totalPrice: calculateTotalWithAccessories(updatedItems)
        };
      }),
      
      // Remove an item from cart
      removeItem: (cartId) => set(state => {
        const updatedItems = state.items.filter(i => i.cartId !== cartId);
        
        return {
          items: updatedItems,
          totalPrice: calculateTotalWithAccessories(updatedItems)
        };
      }),
      
      // Add accessory to an item
      addAccessoryToItem: (itemId, accessory) => set(state => {
        const updatedItems = state.items.map(item => {
          if (item._id === itemId) {
            return {
              ...item,
              accessories: [...(item.accessories || []), accessory]
            };
          }
          return item;
        });
        
        return {
          items: updatedItems,
          totalPrice: calculateTotalWithAccessories(updatedItems)
        };
      }),
      
      // Remove accessory from an item
      removeAccessoryFromItem: (itemId, accessoryId) => set(state => {
        const updatedItems = state.items.map(item => {
          if (item._id === itemId) {
            return {
              ...item,
              accessories: (item.accessories || []).filter(acc => acc._id !== accessoryId)
            };
          }
          return item;
        });
        
        return {
          items: updatedItems,
          totalPrice: calculateTotalWithAccessories(updatedItems)
        };
      }),
      
      // Add message card to an item
      addCard: (itemId, message) => set(state => {
        const updatedItems = state.items.map(item => {
          if (item.cartId === itemId) {
            return { ...item, message };
          }
          return item;
        });
        
        return {
          items: updatedItems,
          totalPrice: calculateTotalWithAccessories(updatedItems)
        };
      }),
      
      // Add address to an item
      addAddress: (itemId, address) => set(state => {
        console.log('Adding address:', address, 'for item:', itemId);
        const updatedItems = state.items.map(item => {
          if (item.cartId === itemId) {
            return { ...item, address };
          }
          return item;
        });
        
        return {
          items: updatedItems,
          totalPrice: calculateTotalWithAccessories(updatedItems)
        };
      }),
      
      // Get order data in format ready for MongoDB
      getOrderData: (user) => {
        const state = get();
        const { deliveryFees, total, accessoriesTotal, fullTotal } = calculateTotalWithAccessories(state.items);
        
        return {
          user,
          items: state.items, // An array, ready for MongoDB
          deliveryFees,
          total,
          accessoriesTotal,
          fullTotal,
          isPaid: false
        };
      },
      
      // Clear the cart
      clearCart: () => set({ items: [], totalPrice: 0 })
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);


// Updated calculation to include accessories
export const calculateTotalWithAccessories = (items) => {
  return items.reduce((acc, item) => {
    const itemTotal = item.price * (item.quantity || 1);
    acc.total += itemTotal;

    if (item.deliverySlot && item.deliverySlot.price) {
      acc.deliveryFees += item.deliverySlot.price;
    }

    const accessoriesTotal = (item.accessories || []).reduce(
      (accessoryAcc, accessory) => accessoryAcc + (accessory.price * (accessory.quantity || 1)),
      0
    );
    
    acc.accessoriesTotal += accessoriesTotal;
    acc.fullTotal = acc.total + acc.deliveryFees + acc.accessoriesTotal;
    return acc;
  }, { total: 0, deliveryFees: 0, accessoriesTotal: 0, fullTotal: 0 });
};




// Convenience exports
export const getUser = () => useUserStore.getState().user;
export const getToken = () => useUserStore.getState().token;


//// Cart Convenience exports
export const getCartItems = () => useCartStore.getState().items;
export const getCartTotal = () => useCartStore.getState().totalPrice;



// Order Details convinience exports
export const saveOrderDetails = (data) => useOrderDetails.getState().saveDetails(data);
export const clearOrderDetails = () => useOrderDetails.getState().deleteDetails();