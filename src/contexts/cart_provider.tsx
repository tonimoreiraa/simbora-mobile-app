import AsyncStorage from "@react-native-async-storage/async-storage";
import { PropsWithChildren, createContext, useContext, useEffect } from "react";
import { useList } from 'react-use'

export interface Product {
    id: number
    name: string
    image?: string
    quantity: number
    price: number
}
export interface CartContext {
    items: Product[]
    total: number
    subTotal: number
    quantity: number
    discounts: number

    push: (product: Product) => void
    remove: (id: number) => void
    update: (skuId: number, data: Product) => void
    clear: () => void
}

const CartContext = createContext({} as CartContext)

export default function CartProvider({ children }: PropsWithChildren)
{
    const [items, { push: pushItem, clear, removeAt: removeItem, updateAt, set }] = useList<Product>()
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

    function push(product: Product) {
        const currentItemIndex = items.findIndex(i => i.id == product.id)
        if (currentItemIndex >= 0) {
            const currentItem = items[currentItemIndex]
            product.quantity = product.quantity + currentItem.quantity
            updateAt(currentItemIndex, product)
        } else {
            pushItem(product)
        }
    }

    return <CartContext.Provider value={{
        items, push, clear, remove, update: updateAt, quantity, total, subTotal, discounts: 0
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