"use client"

import { useUser } from "@clerk/nextjs"
import { boardDataService, boardService } from "../services"
import { Board } from "../supabase/models"
import { useEffect, useState } from "react"
import { useSupabase } from "../supabase/SupabaseProvider"


export function useUserBoards() {
    const { user } = useUser()
    const { supabase } = useSupabase()
    const [boards, setBoards] = useState<Board[]>([])
    const [loading, setLoading] = useState(false)
    const [error, setError] = useState<string | null>(null)

    useEffect(() => {
        if (user) {
            loadBoards();
        }
    }, [supabase!, user])

    async function loadBoards() {
        if (!user) return;

        try {
            setLoading(true);
            setError(null);
            const data = await boardService.getBoard(supabase!, user.id)
            setBoards(data);
        } catch (err) {
            setError(err instanceof Error ? err.message : "Failed to load boards.");
        } finally {
            setLoading(false);
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
