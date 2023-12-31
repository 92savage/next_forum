import { connectDB } from '@/util/database';
import { getServerSession } from 'next-auth';
import { authOptions } from '../auth/[...nextauth]';

export default async function handler(req, res) {
  if (req.method == 'POST') {
    const session = await getServerSession(req, res, authOptions);

    if (session) {
      req.body.author = session.user.email;
    }

    if (req.body.title == '') {
      return res.status(500).json('TITLE EMPTY');
    }

    try {
      const db = (await connectDB).db('forum');
      const result = await db.collection('post').insertOne(req.body);
      return res.redirect(302, '/list');
    } catch (err) {
      console.log(err);
      return res.status(500).json('DB ERR');
    }
  }
}
