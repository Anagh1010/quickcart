'use client'
import { useAuth, useUser } from "@clerk/nextjs";
import axios from "axios";
import { usePathname, useRouter } from "next/navigation";
import { createContext, useCallback, useContext, useEffect, useMemo, useRef, useState } from "react";
import toast from "react-hot-toast";
import { initClientLogger } from "@/lib/clientLogger";

export const AppContext = createContext();

export const useAppContext = () => {
    return useContext(AppContext)
}

export const AppContextProvider = (props) => {

    const currency = process.env.NEXT_PUBLIC_CURRENCY
    const router = useRouter()
    const pathname = usePathname()

    const { user } = useUser()
    const { getToken } = useAuth()

    const [products, setProducts] = useState([])
    const [userData, setUserData] = useState(false)
    const [isSeller, setIsSeller] = useState(false)
    const [isAdmin, setIsAdmin] = useState(false)
    const [cartItems, setCartItems] = useState({})

    const fetchProductData = async () => {
        try {
            
            const {data} = await axios.get('/api/product/list')

            if (data.success) {
                setProducts(data.products)
            } else {
                toast.error(data.message)
            }

        } catch (error) {
            toast.error(error.message)
        }
    }

    const fetchUserData = async () => {
        try {

            const role = user?.publicMetadata?.role
            if (role === 'seller') setIsSeller(true)
            if (role === 'admin') {
                setIsAdmin(true)
                setIsSeller(true) // admin can also access seller routes
            }

            const token = await getToken()

            const { data } = await axios.get('/api/user/data', { headers: { Authorization: `Bearer ${token}` } })

            if (data.success) {
                setUserData(data.user)
                setCartItems(data.user.cartItems)
            } else {
                // Silently retry once if user is not found (could be Clerk sync delay)
                setTimeout(async () => {
                    try {
                        const retryData = await axios.get('/api/user/data', { headers: { Authorization: `Bearer ${token}` } })
                        if (retryData.data.success) {
                            setUserData(retryData.data.user)
                            setCartItems(retryData.data.user.cartItems)
                        }
                    } catch (retryError) {
                        console.error('Retry failed:', retryError)
                    }
                }, 1000)
            }

        } catch (error) {
            console.error('Error fetching user data:', error)
            // Silently retry once on error (could be Clerk sync delay)
            setTimeout(async () => {
                try {
                    const token = await getToken()
                    const retryData = await axios.get('/api/user/data', { headers: { Authorization: `Bearer ${token}` } })
                    if (retryData.data.success) {
                        setUserData(retryData.data.user)
                        setCartItems(retryData.data.user.cartItems)
                    }
                } catch (retryError) {
                    console.error('Retry failed:', retryError)
                    toast.error('Failed to load user data. Please refresh the page.')
                }
            }, 1000)
        }
    }

    const addToCart = useCallback(async (itemId) => {
        if (!user) {
            return toast('Please login', { icon: '⚠️' })
        }

        let nextCartData
        setCartItems(prev => {
            nextCartData = { ...prev, [itemId]: (prev[itemId] || 0) + 1 }
            return nextCartData
        })
        try {
            const token = await getToken()
            await axios.post('/api/cart/update', { cartData: nextCartData }, { headers: { Authorization: `Bearer ${token}` } })
            toast.success('Item added to cart')
        } catch (error) {
            toast.error(error.message)
        }
    }, [user, getToken])

    const updateCartQuantity = useCallback(async (itemId, quantity) => {
        let nextCartData
        setCartItems(prev => {
            nextCartData = { ...prev }
            if (quantity === 0) {
                delete nextCartData[itemId]
            } else {
                nextCartData[itemId] = quantity
            }
            return nextCartData
        })
        if (user) {
            try {
                const token = await getToken()
                await axios.post('/api/cart/update', { cartData: nextCartData }, { headers: { Authorization: `Bearer ${token}` } })
                toast.success('Cart Updated')
            } catch (error) {
                toast.error(error.message)
            }
        }
    }, [user, getToken])

    const getCartCount = useCallback(() => {
        let totalCount = 0;
        for (const items in cartItems) {
            if (cartItems[items] > 0) {
                totalCount += cartItems[items];
            }
        }
        return totalCount;
    }, [cartItems])

    const getCartAmount = useCallback(() => {
        let totalAmount = 0;
        for (const items in cartItems) {
            let itemInfo = products.find((product) => product._id === items);
            if (itemInfo && cartItems[items] > 0) {
                totalAmount += itemInfo.offerPrice * cartItems[items];
            }
        }
        return Math.floor(totalAmount * 100) / 100;
    }, [cartItems, products])

    const loggerInitRef = useRef(false)

    useEffect(() => {
        const hasCartItems = Object.values(cartItems).some((quantity) => quantity > 0)
        const needsClientCatalog = pathname && pathname !== '/' && pathname !== '/all-products' && !pathname.startsWith('/product/')

        if (needsClientCatalog && hasCartItems && products.length === 0) {
            fetchProductData()
        }
    }, [pathname, cartItems, products.length])

    useEffect(() => {
        if (user) {
            fetchUserData()
            // Boot client-side perf logger once per session in production only
            if (process.env.NODE_ENV === 'production' && !loggerInitRef.current) {
                loggerInitRef.current = true
                initClientLogger(user.id)
            }
        } else {
            setIsSeller(false)
            setIsAdmin(false)
            setUserData(false)
            setCartItems({})
        }
    }, [user])

    const value = useMemo(() => ({
        user, getToken,
        currency, router,
        isSeller, setIsSeller,
        isAdmin, setIsAdmin,
        userData, fetchUserData,
        products, fetchProductData,
        cartItems, setCartItems,
        addToCart, updateCartQuantity,
        getCartCount, getCartAmount
    }), [user, getToken, currency, router, isSeller, isAdmin, userData, products, cartItems, addToCart, updateCartQuantity, getCartCount, getCartAmount])

    return (
        <AppContext.Provider value={value}>
            {props.children}
        </AppContext.Provider>
    )
}
