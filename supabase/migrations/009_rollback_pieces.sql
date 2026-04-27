-- =============================================================
-- 009 — Rollback "Pièce documentée à vie"
-- =============================================================
-- Retire la persistence par pièce (certificat + registre + transmission).
-- Le monogramme à la commande est conservé sur order_items (option payante
-- qui ne nécessite aucun suivi post-vente côté maison).

drop table if exists public.piece_events cascade;
drop table if exists public.pieces cascade;
drop function if exists public.next_piece_number();
drop sequence if exists public.piece_number_seq;
