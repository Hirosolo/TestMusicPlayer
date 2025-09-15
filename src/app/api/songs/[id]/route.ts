import { NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/supabase'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseClient
    .from('songs')
    .select('*')
    .eq('id', params.id)
    .single()

  if (error) {
    return NextResponse.json({ error: error.message }, { status: 404 })
  }
  return NextResponse.json(data)
}
