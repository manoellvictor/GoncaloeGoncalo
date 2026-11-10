-- set_updated_at() só é chamada por triggers; não precisa estar exposta na API
-- REST. Sendo SECURITY DEFINER, deixá-la executável por anon/authenticated é
-- superfície de ataque desnecessária.
revoke execute on function public.set_updated_at() from anon, authenticated, public;
