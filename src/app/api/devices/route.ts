export const dynamic = "force-dynamic";

export async function POST(req: Request) {
  const { temperature, humidity, gas } = await req.json();

  console.log(temperature, humidity, gas);

  return Response.json(
    null,
    {
      status: 200,
      headers: {
        "Access-Control-Allow-Origin": "*",
        "Access-Control-Allow-Methods": "POST",
        "Access-Control-Allow-Headers": "Content-Type, Authorization",
      },
    }
  );
}
