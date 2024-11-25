import { NextResponse } from "next/server";

// To handle a GET request to /api
export async function GET() {
  return NextResponse.json([
    { id: '1', local: 'Al. Vicente Pinzon, 54, 3º andar 04547-130 - São Paulo/SP', usage: 0, status: 'Vazio' },
    { id: '2', local: 'Av. Paulista, 2300 Andar Pilotis 01310-300 - São Paulo/SP', usage: 0, status: 'Vazio' },
    { id: '3', local: 'R. Dr. Celestino, 122 - 611 24020-091 - Niterói/RJ', usage: 0, status: 'Vazio' },
    { id: '4', local: 'Teresina/PI', usage: 0, status: 'Vazio' },
  ], { status: 200 });
}