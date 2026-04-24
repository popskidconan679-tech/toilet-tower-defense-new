-- Create function to safely add currency
create or replace function public.add_currency(
  user_id_param uuid,
  coins_delta bigint default 0,
  gems_delta bigint default 0
)
returns void
language plpgsql
security definer
set search_path = public
as $$
begin
  update player_stats
  set 
    coins = coins + coins_delta,
    gems = gems + gems_delta,
    total_coins_earned = case when coins_delta > 0 then total_coins_earned + coins_delta else total_coins_earned end,
    total_gems_earned = case when gems_delta > 0 then total_gems_earned + gems_delta else total_gems_earned end,
    updated_at = now()
  where user_id = user_id_param;
end;
$$;

-- Grant permission
grant execute on function public.add_currency to authenticated;
