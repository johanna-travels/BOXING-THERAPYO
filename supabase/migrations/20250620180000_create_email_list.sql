-- Newsletter subscribers (email list)
create table if not exists public.email_list (
  id uuid primary key default gen_random_uuid(),
  email text not null,
  active boolean not null default true,
  subscribed_at timestamptz not null default now(),
  unsubscribed_at timestamptz,
  unsubscribe_token uuid not null default gen_random_uuid(),
  created_at timestamptz not null default now(),
  updated_at timestamptz not null default now(),
  constraint email_list_email_unique unique (email),
  constraint email_list_email_format check (
    email ~* '^[^@[:space:]]+@[^@[:space:]]+\.[^@[:space:]]+$'
  )
);

create index if not exists email_list_active_idx
  on public.email_list (active)
  where active = true;

create or replace function public.set_email_list_updated_at()
returns trigger
language plpgsql
as $$
begin
  new.updated_at = now();
  return new;
end;
$$;

drop trigger if exists email_list_updated_at on public.email_list;

create trigger email_list_updated_at
  before update on public.email_list
  for each row
  execute function public.set_email_list_updated_at();

-- Public unsubscribe link: /unsubscribe?token=...
create or replace function public.unsubscribe_by_token(token uuid)
returns boolean
language plpgsql
security definer
set search_path = public
as $$
declare
  updated_count integer;
begin
  update public.email_list
  set
    active = false,
    unsubscribed_at = now()
  where unsubscribe_token = token
    and active = true;

  get diagnostics updated_count = row_count;
  return updated_count > 0;
end;
$$;

alter table public.email_list enable row level security;

-- Signup form: anon users can insert an email only
create policy "Public can subscribe"
  on public.email_list
  for insert
  to anon, authenticated
  with check (
    active = true
    and unsubscribed_at is null
  );

-- Resubscribe / admin updates: use service role or a future edge function.
-- No public SELECT or UPDATE policies on this table.

grant execute on function public.unsubscribe_by_token(uuid) to anon, authenticated;

comment on table public.email_list is 'Newsletter / article notification subscribers';
comment on column public.email_list.unsubscribe_token is 'Secret token for one-click unsubscribe links';
