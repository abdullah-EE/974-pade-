create table if not exists conversations (
  id uuid primary key default gen_random_uuid(),
  challenge_id uuid references challenges(id) on delete set null,
  created_at timestamptz not null default now()
);

create table if not exists conversation_participants (
  conversation_id uuid references conversations(id) on delete cascade,
  profile_id uuid references profiles(id) on delete cascade,
  created_at timestamptz not null default now(),
  primary key (conversation_id, profile_id)
);

create table if not exists messages (
  id uuid primary key default gen_random_uuid(),
  conversation_id uuid references conversations(id) on delete cascade,
  sender_id uuid references profiles(id) on delete set null,
  body text not null,
  created_at timestamptz not null default now()
);

alter table conversations enable row level security;
alter table conversation_participants enable row level security;
alter table messages enable row level security;

drop policy if exists "participants read conversations" on conversations;
drop policy if exists "participants read conversation_participants" on conversation_participants;
drop policy if exists "participants read messages" on messages;
drop policy if exists "participants insert messages" on messages;

create policy "participants read conversations" on conversations for select using (
  exists (
    select 1 from conversation_participants cp
    where cp.conversation_id = conversations.id and cp.profile_id = auth.uid()
  )
);

create policy "participants read conversation_participants" on conversation_participants for select using (profile_id = auth.uid());

create policy "participants read messages" on messages for select using (
  exists (
    select 1 from conversation_participants cp
    where cp.conversation_id = messages.conversation_id and cp.profile_id = auth.uid()
  )
);

create policy "participants insert messages" on messages for insert with check (sender_id = auth.uid());
