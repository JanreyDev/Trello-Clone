"use client"

import { createContext, useEffect, useState } from "react"
import { createClient, SupabaseClient } from "@supabase/supabase-js"
import { useAuth } from "@clerk/nextjs"

type SupabaseContextType = {
    supabase: SupabaseClient | null
    isLoaded: boolean
}

export const SupabaseContext = createContext<SupabaseContextType>({
    supabase: null,
    isLoaded: false,
})

export default function SupabaseProvider({
    children,
}: {
    children: React.ReactNode
}) {
    const { getToken, isLoaded: authLoaded } = useAuth()
    const [supabase, setSupabase] = useState<SupabaseClient | null>(null)

    useEffect(() => {
        if (!authLoaded) return

        const client = createClient(
            process.env.NEXT_PUBLIC_SUPABASE_URL!,
            process.env.NEXT_PUBLIC_SUPABASE_ANON_KEY!,
            {
                auth: {
                    accessToken: async () => {
                        return await getToken({ template: "supabase" })
                    },
                },
            }
        )

        setSupabase(client)
    }, [authLoaded, getToken])

    return (
        <SupabaseContext.Provider value={{ supabase, isLoaded: !!supabase }}>
            {!supabase ? <div>Loading...</div> : children}
        </SupabaseContext.Provider>
    )
}
