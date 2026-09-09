# Write-up

## 1. What did you build for Part B, and why that?

I mostly focused on the front-end. Despite having so much information in the db
about each visit, notes, spending, etc., none of that is being displayed. This felt
like the most fitting place to start. I added an API for visits, and divisioned the 
page into different tabs. There is now a Visit tab where information about each 
visit is displayed. I kept the restaurant list, but now you can expand them for 
information about total visits, total/average spending to get a better idea of 
which restaurant Brennan might be spending too much at. This also prompted 
me to add the Budget tab where we could see spending per month.

## 2. What did you decide, and what did you rule out?

I scoped out edit/delete functionality for restaurants and visits, and duplicate 
detection. These were the most significant things I left out. I prioritized 
polishing the UI so that it felt complete and usable instead of spreading my 
remaining time on those functions. However, I would add an edit option to each
visit and restaurant, that would also then allow delete.

## 3. Where did you cut corners?

There are some immediate fixes, like better error handling. I would add checks
for duplication, invalid dates, etc. I would also like to change the load to be
per-tab rather than the whole page. With an added home page, this would allow 
the other tabs to load without affecting the usability. 

---

## Part B: routes

> Every endpoint you added, with its request and response shapes, so we can
> exercise it without reverse-engineering your code. Add or remove rows as
> needed; delete this section if your Part B added no routes.

| Method and path | What it does | Success | Errors       |
| --------------- | ------------ | ------- | ------------ |
| `GET /api/visits`  | Returns all visits, most recent first | `200` + JSON array |  |
| `POST /api/visits` | Logs a new visit | `201` + created visit | `400` on invalid body, `404` if `restaurantId` doesn't exist |

**`POST /api/visits`**

```jsonc
// request
{
  "restaurantId": 2,
  "date": "2026-05-01",
  "amountSpent": 25.50,
  "notes": "Quick lunch."
}

// 201 response
{
  "id": 4,
  "restaurantId": 2,
  "date": "2026-05-01",
  "amountSpent": 25.5,
  "notes": "Quick lunch.",
  "createdAt": "2026-09-09T08:14:54.495Z"
}
```
restaurantId must be an existing positive integer, date must be a valid 
YYYY-MM-DD string, amountSpent and notes are optional but must be non-negative 
or a string respectively.

No new routes were needed for restaurant creation.


## Schema changes

None.

## How I verified this

**Part A** - the contract table in CHALLENGE.md, every row including the error
cases:

```bash
curl -i http://localhost:3000/api/restaurants          # 200 + array
curl -i http://localhost:3000/api/restaurants/1        # 200 + one restaurant
curl -i http://localhost:3000/api/restaurants/99999    # 404
curl -i http://localhost:3000/api/restaurants/abc      # 404, not 500
curl -i -X POST http://localhost:3000/api/restaurants \
  -H 'Content-Type: application/json' \
  -d '{"name":"Valid Spot","cuisine":"Test","address":"2 Test St","rating":4.5}'   # 201
curl -i -X POST http://localhost:3000/api/restaurants \
  -H 'Content-Type: application/json' \
  -d '{"name":"Out Of Range","rating":6}'              # 400
curl -i -X DELETE http://localhost:3000/api/restaurants/1   # 204, no body
curl -i -X DELETE http://localhost:3000/api/restaurants/1   # 404 (already deleted)
```

**Part B** - the equivalent cases for what you built:

```bash
curl -i http://localhost:3000/api/visits                # 200 + array

curl -i -X POST http://localhost:3000/api/visits \
  -H 'Content-Type: application/json' \
  -d '{"restaurantId":2,"date":"2026-05-01","amountSpent":25.50,"notes":"Quick lunch."}'
  # 201 + created visit

curl -i -X POST http://localhost:3000/api/visits \
  -H 'Content-Type: application/json' \
  -d '{"restaurantId":2,"date":"not-a-date","amountSpent":25.50}'
  # 400, not 500

curl -i -X POST http://localhost:3000/api/visits \
  -H 'Content-Type: application/json' \
  -d '{"restaurantId":2,"date":"2026-05-01","amountSpent":-10}'
  # 400

curl -i -X POST http://localhost:3000/api/visits \
  -H 'Content-Type: application/json' \
  -d '{"restaurantId":99999,"date":"2026-05-01","amountSpent":10}'
  # 404
```

## Known issues / what I'd do next

No edit or delete, no duplicate detection, spotty visit validation. I would
fix these and also add per-tab load with a homepage.