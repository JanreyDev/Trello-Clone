"use client"

import { useUser } from "@clerk/nextjs"
import { boardDataService } from "../services"
import { Board } from "../supabase/models"
import { useState } from "react"
import { useSupabase } from "../supabase/SupabaseProvider"

export function useUserBoards() {
    const { user } = useUser()
    const { supabase } = useSupabase()
    const [boards, setBoards] = useState<Board[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    async function loadBoards() {
        if (!user) return;

        try {

        } catch () {

        }
    }

    async function createBoard(boardData: {
        title: string
        description?: string
        color?: string
    }) {
        if (!user) throw new Error("User not authenticated")

        setLoading(true)
        setError(null)

        try {
            const newBoard = await boardDataService.createBoardWithDefaultColumns(supabase!, {
                ...boardData,
                userId: user.id,
            })

            setBoards((prev) => [...prev, newBoard])
            return newBoard
        } catch (err) {
            const message =
                err instanceof Error ? err.message : "Failed to create board"
            setError(message)
            throw err
        } finally {
            setLoading(false)
        }
    }

    return {
        boards,
        loading,
        error,
        createBoard,
    }
}
