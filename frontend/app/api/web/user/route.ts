import axios from "axios";

export async function GET() {
  try {
    const res = await axios.get(
      `${process.env.NEXT_PUBLIC_BACKEND_URL}/api/web/user`,
    );

    return Response.json(res.data);
  } catch (err) {
    console.log(err);
  }
}
