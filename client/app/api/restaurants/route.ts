import { NextResponse } from 'next/server';
import { pool } from '@/db/pool';
import { handleError, ValidationError } from '@/lib/errors';
import { toRestaurant } from '@/lib/types';

/**
 * GET /api/restaurants
 * Returns all restaurants.
 */
export async function GET() {
  try {
    const { rows } = await pool.query(
      // 'SELECT * FROM restaurants ORDER BY createdAt DESC'
      // the database uses created_at instead of createdAt, hence the error in A1
      'SELECT * FROM restaurants ORDER BY created_at DESC'
    );
    // Map every row - raw rows don't match the contract (NUMERIC comes back
    // as a string, timestamps as Date objects). See lib/types.ts.
    return NextResponse.json(rows.map(toRestaurant));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * POST /api/restaurants
 * Create a new restaurant.
 *
 * TODO (A2): implement. Read the restaurant fields from the request body,
 * insert a row, and return the created restaurant with a 201 status.
 *
 * TODO (A3): validate before you insert. Nothing validates anything today, so
 * `rating` happily accepts 6. Decide what valid means for each field and reject
 * bad bodies with a 400 rather than letting them reach the database.
 */
export async function POST(req: Request) {
  // return NextResponse.json({ error: 'Not implemented' }, { status: 501 });
  try{
    // A2
    const body = await req.json();
    const {name, cuisine, address, rating} = body;

    if(typeof name !== "string" || name.trim()==="")
      throw new ValidationError("Please enter a valid string for name.");
    if(cuisine !== null && typeof cuisine !== "string") // from create_tables.sql, this can be null
      throw new ValidationError("Please enter a valid string for cuisine.");
    if(address !== null && typeof address !== "string") // address should also be a string
      throw new ValidationError("Please enter a valid string for address.");
    if(typeof rating !== "number" || rating<0 || rating>5)
      throw new ValidationError("Please enter a valid number from 0-5 for rating.");
    
    
    const { rows } = await pool.query(
      `INSERT INTO restaurants (name, cuisine, address, rating)
      VALUES ($1, $2, $3, $4)
      RETURNING *`, 
      [name, cuisine, address, rating]
    );

    return NextResponse.json(toRestaurant(rows[0]), { status: 201 });
  }
  catch (err) {
    return handleError(err);
  }
}
