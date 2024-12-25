create table youtube_tokens (
  id uuid primary key default uuid_generate_v4(),
  user_id uuid references auth.users not null,
  access_token text not null,
  refresh_token text,
  expiry_date timestamp with time zone,
  created_at timestamp with time zone default timezone('utc'::text, now()) not null,
  updated_at timestamp with time zone default timezone('utc'::text, now()) not null,
  unique(user_id)
);

-- Add RLS policies
alter table youtube_tokens enable row level security;

create policy "Users can view their own tokens"
  on youtube_tokens for select
  using (auth.uid() = user_id);

create policy "Users can insert their own tokens"
  on youtube_tokens for insert
  with check (auth.uid() = user_id);

create policy "Users can update their own tokens"
  on youtube_tokens for update
  using (auth.uid() = user_id);

-- Add updated_at trigger
create or replace function update_updated_at_column()
returns trigger as $$
begin
  new.updated_at = now();
  return new;
end;
$$ language plpgsql;

create trigger update_youtube_tokens_updated_at
  before update on youtube_tokens
  for each row
  execute function update_updated_at_column();