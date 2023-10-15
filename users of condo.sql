SELECT users.user_id, users.username, users.password, users.phone_number_main, users.is_active, users.user_role, units.unit_id, units.unit as unit_number
FROM users
JOIN units ON users.user_id = units.user_id
JOIN condos ON units.condo_id = condos.condo_id
WHERE condos.condo_id = 1;



-- function getCondoUsers(condoId) {
--   return knex('users')
--     .join('units', 'users.user_id', '=', 'units.user_id')
--     .join('condos', 'units.condo_id', '=', 'condos.condo_id')
--     .where('condos.condo_id', condoId)
--     .select('users.user_id', 'users.username', 'users.password', 'users.phone_number_main', 'users.is_active', 'users.user_role', 'units.unit_id', 'units.unit as unit_number');
-- }