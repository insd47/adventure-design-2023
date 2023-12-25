export async function GET() {
  // redirect to /attendance
  return Response.json(null, {status: 302, headers: {Location: "/attendance"}})
}