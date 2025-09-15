import { NextResponse } from 'next/server'
import { supabaseClient } from '@/lib/supabase'

export async function GET(req: Request, { params }: { params: { id: string } }) {
  const { data, error } = await supabaseClient
    .from('songs')
    .select('file_path')
    .eq('id', params.id)
    .single()

  if (error || !data) {
    return NextResponse.json({ error: 'Song not found' }, { status: 404 })
  }

  const { data: publicUrl } = supabaseClient
    .storage
    .from('songs')
    .getPublicUrl(data.file_path)

  return NextResponse.json({ url: publicUrl.publicUrl })
}
