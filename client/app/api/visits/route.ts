import { NextResponse } from 'next/server';
import { pool } from '@/db/pool';
import { handleError, ValidationError, NotFoundError } from '@/lib/errors';
import { toVisit } from '@/lib/types';

/**
 * GET /api/visits
 * Returns all visits, most recent first, each including the restaurant's name.
 */
export async function GET() {
  try {
    const { rows } = await pool.query(
      'SELECT * FROM visits ORDER BY date DESC'
    );
    return NextResponse.json(rows.map(toVisit));
  } catch (err) {
    return handleError(err);
  }
}

/**
 * POST /api/visits
 * Log a new visit.
 */
export async function POST(req: Request) {
  try {
    const body = await req.json();
    const { restaurantId, date, amountSpent, notes } = body;

    if (typeof restaurantId !== 'number' || !Number.isInteger(restaurantId) || restaurantId <= 0)
      throw new ValidationError('Please provide a valid restaurantId.');
    if (typeof date !== 'string' || Number.isNaN(Date.parse(date)))
      throw new ValidationError('Please provide a valid date (YYYY-MM-DD).');
    if (amountSpent !== null && amountSpent !== undefined && (typeof amountSpent !== 'number' || amountSpent < 0))
      throw new ValidationError('amountSpent must be a non-negative number.');
    if (notes !== null && notes !== undefined && typeof notes !== 'string')
      throw new ValidationError('notes must be a string.');

    // Confirm the restaurant actually exists before inserting.
    const restaurantCheck = await pool.query(
      'SELECT id FROM restaurants WHERE id = $1',
      [restaurantId]
    );
    if (restaurantCheck.rows.length === 0) {
      throw new NotFoundError('Restaurant not found.');
    }

    const { rows } = await pool.query(
      `INSERT INTO visits ("restaurantId", date, "amountSpent", notes)
       VALUES ($1, $2, $3, $4)
       RETURNING *`,
      [restaurantId, date, amountSpent ?? null, notes ?? null]
    );

    return NextResponse.json(toVisit(rows[0]), { status: 201 });
  } catch (err) {
    return handleError(err);
  }
}