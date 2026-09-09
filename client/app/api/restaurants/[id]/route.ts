import { NextResponse } from 'next/server';
import { pool } from '@/db/pool';
import { handleError, ValidationError, NotFoundError } from '@/lib/errors';import { toRestaurant } from '@/lib/types';
import { parseId } from '@/lib/validation';


type Params = { params: { id: string } };

/**
 * GET /api/restaurants/:id
 * Returns a single restaurant, or 404 if it doesn't exist.
 */
export async function GET(_req: Request, { params }: Params) {
  try {
    const id = parseId(params.id);
    if (id === null) {
      throw new NotFoundError('Restaurant not found');
    }

    const { rows } = await pool.query(
      'SELECT * FROM restaurants WHERE id = $1',
      [id]
    );

    if (rows.length === 0) {
      throw new NotFoundError('Restaurant not found');
    }

    return NextResponse.json(toRestaurant(rows[0]));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * PUT /api/restaurants/:id
 * Update an existing restaurant.
 *
 * TODO (A2): implement. Update the row matching :id and return the updated
 * record (or 404 if it doesn't exist). Validate the body the same way POST does.
 */
export async function PUT(req: Request, ctx: Params) {
  try {
    const id = parseId(ctx.params.id);
    if (id === null) {
      throw new NotFoundError('Restaurant not found');
    }
    
    const body = await req.json();
    const { name, cuisine, address, rating } = body;

    if (typeof name !== "string" || name.trim() === "")
      throw new ValidationError("Please enter a valid string for name.");
    if (cuisine !== null && typeof cuisine !== "string")
      throw new ValidationError("Please enter a valid string for cuisine.");
    if (address !== null && typeof address !== "string")
      throw new ValidationError("Please enter a valid string for address.");
    if (typeof rating !== "number" || rating < 0 || rating > 5)
      throw new ValidationError("Please enter a valid number from 0-5 for rating.");

    const { rows } = await pool.query(
      `UPDATE restaurants
       SET name = $1, cuisine = $2, address = $3, rating = $4
       WHERE id = $5
       RETURNING *`,
      [name, cuisine, address, rating, id]
    );

    if (rows.length === 0) {
      throw new NotFoundError('Restaurant not found');
    }

    return NextResponse.json(toRestaurant(rows[0]), { status: 200 });
  } catch (err) {
    return handleError(err);
  }
}

/**
 * DELETE /api/restaurants/:id
 * Delete a restaurant.
 *
 * TODO (A2): implement. Delete the row matching :id and return 204 (or 404
 * if it doesn't exist).
 *
 * Worth noticing: the migration already made a call about what happens to that
 * restaurant's visits. Go read it. If you disagree with it, say so in your
 * write-up.
 */
export async function DELETE(_req: Request, ctx: Params) {
  try {
    const id = parseId(ctx.params.id);
    if (id === null) {
      throw new NotFoundError('Restaurant not found');
    }

    const { rowCount } = await pool.query(
      'DELETE FROM restaurants WHERE id = $1',
      [id]
      
    );

    if (rowCount === 0) {
      throw new NotFoundError('Restaurant not found');
    }

    return new NextResponse(null, { status: 204 });
  } catch (err) {
    return handleError(err);
  }
}
