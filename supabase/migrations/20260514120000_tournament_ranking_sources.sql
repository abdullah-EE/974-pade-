alter table matches
  add column if not exists tournament_id uuid references tournaments(id) on delete set null,
  add column if not exists ranking_source text not null default 'friendly'
    check (ranking_source in ('tournament', 'approved_club_event', 'friendly')),
  add column if not exists friendly_stats_only boolean not null default true;

update matches
set friendly_stats_only = ranking_source = 'friendly';

create index if not exists matches_tournament_id_idx on matches(tournament_id);
create index if not exists matches_ranking_source_idx on matches(ranking_source);
