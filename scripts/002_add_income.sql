ALTER TABLE public.tickets ADD COLUMN income DECIMAL(10, 2) DEFAULT 0 NOT NULL;

CREATE INDEX idx_tickets_status_income ON public.tickets(status, income);
