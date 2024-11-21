import AsyncStorage from "@react-native-async-storage/async-storage";
import { PropsWithChildren, createContext, useContext, useEffect } from "react";
import { useList } from 'react-use'

export interface CartItem {
    id: number
    name: string
    image?: string
    quantity: number
    price: number
}
export interface CartContext {
    items: CartItem[]
    total: number
    subTotal: number
    quantity: number
    discounts: number

    push: (product: CartItem) => void
    remove: (id: number) => void
    update: (itemId: number, data: CartItem) => void
    clear: () => void
}

const CartContext = createContext({} as CartContext)

export default function CartProvider({ children }: PropsWithChildren)
{
    const [items, { push: pushItem, clear, removeAt: removeItem, updateAt, set }] = useList<CartItem>()
    const quantity = items.map(item => item.quantity).reduce((x, y) => x + y, 0)
    const subTotal = items.map(item => item.quantity * item.price).reduce((x, y) => x + y, 0)
    const total = subTotal

    useEffect(() => {
        (async () => {
            const data = await AsyncStorage.getItem('@cart')
            if (data) {
                set(JSON.parse(data))
            }
        })()
    }, [])

    useEffect(() => {
        AsyncStorage.setItem('@cart', JSON.stringify(items))
    }, [items])

    function remove(id: number)
    {
        const indexOf = items.findIndex(i => i.id == id)
        removeItem(indexOf)
    }

    function push(product: CartItem) {
        const currentItemIndex = items.findIndex(i => i.id == product.id)
        if (currentItemIndex >= 0) {
            const currentItem = items[currentItemIndex]
            product.quantity = product.quantity + currentItem.quantity
            updateAt(currentItemIndex, product)
        } else {
            pushItem(product)
        }
    }

    const update = (itemId: number, item: CartItem) => {
        const currentItemIndex = items.findIndex(i => i.id == item.id)
        return updateAt(currentItemIndex, item)
    }

    return <CartContext.Provider value={{
        items, push, clear, remove, update, quantity, total, subTotal, discounts: 0
    }}>
        {children}
    </CartContext.Provider>
}

export const useCart = () => {
    const context = useContext(CartContext)

    if (!context.items)
        throw new Error('useCart must be used within a CartProvider')

    return context
}

export const useCartItemQuantity = (itemId: number) => {
    const context = useContext(CartContext)

    if (!context.items)
        throw new Error('useCart must be used within a CartProvider')

    const item = context.items.find(i => i.id == itemId)

    if (!item)
        throw new Error('Cart item does not exists.')

    const add = () => context.update(itemId, {
        ...item, quantity: item.quantity+1
    })
    const decrease = () => {
        if (item.quantity == 1) {
            context.remove(item.id)
        } else {
            context.update(itemId, {
                ...item, quantity: item.quantity-1
            })
        }
    }
    const remove = () => context.remove(itemId)

    return {
        add,
        decrease,
        quantity: item.quantity,
        remove
    }
}