import connectDb from "../../../lib/db"

export async function GET() {
  await connectDb();
  return Response.json({ message: "DB connection tested" });
}
