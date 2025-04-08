import { create } from 'zustand';
import { persist } from 'zustand/middleware';

export const useUserStore = create(
  persist(
    (set) => ({
      user: null,
      token: null,
      isAuthenticated: false,
      
      // Actions
      login: (userData, authToken) => set({ 
        user: userData, 
        token: authToken,
        isAuthenticated: true
      }),
      logout: () => set({ 
        user: null, 
        token: null,
        isAuthenticated: false 
      }),
      updateUser: (userData) => set({ user: userData })
    }),
    {
      name: 'user-storage',
      partialize: (state) => ({
        user: state.user,
        token: state.token
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

      addItem: (item) => set(state => {
        // Generate a unique cartId for each item added
        const cartId = Date.now().toString();
        const itemWithCartId = { ...item, cartId };
        
        return {
          items: [...state.items, itemWithCartId],
          totalPrice: calculateTotalWithAccessories([...state.items, itemWithCartId])
        };
      }),
      
      // Actions
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

      removeItem: (cartId) => set(state => {
        const updatedItems = state.items.filter(i => i.cartId !== cartId);
        return {
          items: updatedItems,
          totalPrice: calculateTotalWithAccessories(updatedItems)
        };
      }),
      
      addAccessoryToItem: (itemId, accessory) => set(state => {
        const updatedItems = state.items.map(item => {
          if (item._id === itemId) {
            return {
              ...item,
              accessories: [
                ...(item.accessories || []),
                accessory
              ]
            };
          }
          return item;
        });
        
        return {
          items: updatedItems,
          totalPrice: calculateTotalWithAccessories(updatedItems)
        };
      }),
      
      removeAccessoryFromItem: (itemId, accessoryId) => set(state => {
        const updatedItems = state.items.map(item => {
          if (item._id === itemId) {
            return {
              ...item,
              accessories: (item.accessories || []).filter(
                acc => acc._id !== accessoryId
              )
            };
          }
          return item;
        });
        
        return {
          items: updatedItems,
          totalPrice: calculateTotalWithAccessories(updatedItems)
        };
      }),
      
      clearCart: () => set({ items: [], totalPrice: 0 })
      // ... other existing actions (removeItem, clearCart)
    }),
    {
      name: 'cart-storage',
      getStorage: () => localStorage,
    }
  )
);

// Updated calculation to include accessories
const calculateTotalWithAccessories = (items) => {
  return items.reduce((total, item) => {
    const itemTotal = item.price * (item.quantity || 1);
    const accessoriesTotal = (item.accessories || []).reduce(
      (accTotal, accessory) => accTotal + (accessory.price * (accessory.quantity || 1)),
      0
    );
    return total + itemTotal + accessoriesTotal;
  }, 0);
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