import { NextApiRequest, NextApiResponse } from "next";
import { getServerSession } from "next-auth";
import { authOptions } from "./auth/[...nextauth]";
import { prisma } from "../../lib/prisma";

export default async function handler(req: NextApiRequest, res: NextApiResponse) {
  const session = await getServerSession(req, res, authOptions);
  if (!session || !session.user?.email) return res.status(401).json({ error: "Unauthorized" });

  const user = await prisma.user.findUnique({ where: { email: session.user.email } });
  if (!user) return res.status(404).json({ error: "User not found" });

  if (req.method === "GET") {
    // Get all watchlist movies
    const watchlist = await prisma.watchlist.findMany({
      where: { userId: user.id },
      include: { movie: true },
    });
    return res.json(watchlist);
  }

  if (req.method === "POST") {
    // Add movie to watchlist
    const { movie } = req.body;
    if (!movie?.id || !movie?.title) return res.status(400).json({ error: "Invalid movie data" });
    // Upsert movie
    await prisma.movie.upsert({
      where: { id: movie.id },
      update: {},
      create: {
        id: movie.id,
        title: movie.title,
        poster: movie.poster_path,
        overview: movie.overview,
        release: movie.release_date,
      },
    });
    // Add to watchlist
    const entry = await prisma.watchlist.create({
      data: { userId: user.id, movieId: movie.id },
      include: { movie: true },
    });
    return res.json(entry);
  }

  if (req.method === "DELETE") {
    const { movieId } = req.body;
    if (!movieId) return res.status(400).json({ error: "Missing movieId" });
    await prisma.watchlist.deleteMany({ where: { userId: user.id, movieId } });
    return res.json({ success: true });
  }

  return res.status(405).json({ error: "Method not allowed" });
}
