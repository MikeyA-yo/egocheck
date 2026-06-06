import { MongoClient } from 'mongodb'

const uri = process.env.MONGODB_URI!

if (!uri) throw new Error('MONGODB_URI is not set in environment variables')

let clientPromise: Promise<MongoClient>

if (process.env.NODE_ENV === 'development') {
  // In dev, preserve connection across HMR reloads
  const g = global as typeof globalThis & { _mongoClientPromise?: Promise<MongoClient> }
  if (!g._mongoClientPromise) {
    g._mongoClientPromise = new MongoClient(uri).connect()
  }
  clientPromise = g._mongoClientPromise
} else {
  clientPromise = new MongoClient(uri).connect()
}

export default clientPromise
