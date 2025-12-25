import { createClient } from "@/lib/supabase/client"
import { Board, Column } from "./supabase/models";
import { title } from "process";

const supabase = createClient();

export const boardService = {
    async getBoard(userId: string): Promise<Board[]> {
        const { data, error } = await supabase.from('boards').select('*').eq('user_id', userId).order('created_at', { ascending: true });
        if (error) {
            throw error;
        }
        return data || [];
    },

    async createBoard(board: Omit<Board, "id" | "created_at" | "updated_at">): Promise<Board> {
        const { data, error } = await supabase
            .from('boards')
            .insert(board)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};



export const columnService = {
    // async getBoard(userId: string): Promise<Board[]> {
    //     const { data, error } = await supabase.from('boards').select('*').eq('user_id', userId).order('created_at', { ascending: true });
    //     if (error) {
    //         throw error;
    //     }
    //     return data || [];
    // },

    async createColumn(column: Omit<Column, "id" | "created_at">): Promise<Column> {
        const { data, error } = await supabase
            .from('columns')
            .insert(column)
            .select()
            .single();

        if (error) throw error;
        return data;
    }
};


export const boardDataService = {
    async createBoardWithDefaultColumns(boardData: {
        title: string
        description?: string
        color?: string
        userId: string
    }) {
        const board = await boardService.createBoard({
            title: boardData.title,
            description: boardData.description || null,
            color: boardData.color || "bg-blue-500",
            user_id: boardData.userId,
        });

        const defaultColumns = [
            { title: "To Do", sort_order: 0, },
            { title: "In Progress", sort_order: 1, },
            { title: "Review", sort_order: 2, },
            { title: "Done", sort_order: 3, },
        ];

        await Promise.all(defaultColumns.map(col =>
            columnService.createColumn({
                ...col, board_id: board.id
            })
        ));

        return board;
    },
};

